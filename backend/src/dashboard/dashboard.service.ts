import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Expense } from '../schemas/expense.schema';
import { Budget } from '../schemas/budget.schema';
import { Category } from '../schemas/category.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  private getMonthRange(date: Date = new Date()) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  async getSummary(userId: string, period?: string) {
    const uid = new Types.ObjectId(userId);
    const currentMonth = this.getMonthRange();
    
    // Calculate previous month for trend
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevMonth = this.getMonthRange(prevDate);

    const [currentIncome, currentExpense, prevIncome, prevExpense, budgets] = await Promise.all([
      this.incomeModel.aggregate([{ $match: { userId: uid, date: currentMonth } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      this.expenseModel.aggregate([{ $match: { userId: uid, date: currentMonth } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      this.incomeModel.aggregate([{ $match: { userId: uid, date: prevMonth } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      this.expenseModel.aggregate([{ $match: { userId: uid, date: prevMonth } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      this.budgetModel.find({ userId: uid, month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}` })
    ]);

    const income = currentIncome[0]?.total || 0;
    const expenses = currentExpense[0]?.total || 0;
    const totalBalance = income - expenses;

    const pIncome = prevIncome[0]?.total || 0;
    const pExpenses = prevExpense[0]?.total || 0;
    const pBalance = pIncome - pExpenses;

    let totalBalanceTrendPct = 0;
    if (pBalance > 0) {
      totalBalanceTrendPct = ((totalBalance - pBalance) / pBalance) * 100;
    } else if (totalBalance > 0) {
      totalBalanceTrendPct = 100;
    }

    const budgetGoal = budgets.reduce((acc, b) => acc + b.limit, 0);

    return {
      totalBalance,
      totalBalanceTrendPct,
      income,
      expenses,
      budgetGoal,
    };
  } 

  async getIncomeVsExpense(userId: string) {
    const uid = new Types.ObjectId(userId);
    
    // Aggregate over the last 6 months
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const range = this.getMonthRange(d);
      
      const [inc, exp] = await Promise.all([
        this.incomeModel.aggregate([{ $match: { userId: uid, date: range } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        this.expenseModel.aggregate([{ $match: { userId: uid, date: range } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      ]);

      data.push({
        label: d.toLocaleString('default', { month: 'short' }),
        income: inc[0]?.total || 0,
        expense: exp[0]?.total || 0
      });
    }
    return data;
  }

  async getSpendingByCategory(userId: string) {
    const uid = new Types.ObjectId(userId);
    const range = this.getMonthRange();
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
    
    const stats = await this.expenseModel.aggregate([
      { $match: { userId: uid, date: range } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $sort: { amount: -1 } }
    ]);

    return stats.map((s, idx) => ({
      category: s._id,
      amount: s.amount,
      color: colors[idx % colors.length]
    }));
  }

  async getRecentTransactions(userId: string, page: number, limit: number) {
    const uid = new Types.ObjectId(userId);
    
    const [incomes, expenses] = await Promise.all([
      this.incomeModel.find({ userId: uid }).sort({ date: -1 }).limit(limit),
      this.expenseModel.find({ userId: uid }).sort({ date: -1 }).limit(limit)
    ]);

    const mapped = [
      ...incomes.map(i => ({ id: i._id, merchant: i.source, category: i.category, date: i.date, amount: i.amount, type: 'income' })),
      ...expenses.map(e => ({ id: e._id, merchant: e.merchant, category: e.category, date: e.date, amount: -e.amount, type: 'expense' }))
    ];

    mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return {
      data: mapped.slice(0, limit),
      currentPage: page,
      totalPages: 1,
      totalItems: mapped.length,
    };
  }

  async getBudgetProgress(userId: string) {
    const uid = new Types.ObjectId(userId);
    const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const range = this.getMonthRange();

    const budgets = await this.budgetModel.find({ userId: uid, month: currentMonth });
    
    // If no budgets exist, just return empty
    if (budgets.length === 0) return [];

    const stats = await this.expenseModel.aggregate([
      { $match: { userId: uid, date: range } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } }
    ]);

    const expenseMap = new Map(stats.map(s => [s._id, s.amount]));

    return budgets.map(b => {
      const spent = expenseMap.get(b.category) || 0;
      const pct = (spent / b.limit) * 100;
      let status = 'success';
      if (pct > 90) status = 'danger';
      else if (pct > 75) status = 'warning';

      return {
        category: b.category,
        spent,
        limit: b.limit,
        status
      };
    });
  }
}
