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

  async getSummary(userId: string, period?: string) {
    // For now, return mock data since DB is likely empty
    // In production, this would use an aggregation pipeline across incomes and expenses
    return {
      totalBalance: 12500,
      totalBalanceTrendPct: 4.5,
      income: 8200,
      expenses: 3450,
      budgetGoal: 5000,
    };
  }

  async getIncomeVsExpense(userId: string) {
    return [
      { label: 'Week 1', income: 2000, expense: 800 },
      { label: 'Week 2', income: 2200, expense: 1200 },
      { label: 'Week 3', income: 1500, expense: 900 },
      { label: 'Week 4', income: 2500, expense: 550 },
    ];
  }

  async getSpendingByCategory(userId: string) {
    return [
      { category: 'Housing', amount: 1500, color: '#3b82f6' },
      { category: 'Food', amount: 600, color: '#10b981' },
      { category: 'Transport', amount: 300, color: '#f59e0b' },
      { category: 'Entertainment', amount: 450, color: '#ef4444' },
      { category: 'Utilities', amount: 600, color: '#8b5cf6' },
    ];
  }

  async getRecentTransactions(userId: string, page: number, limit: number) {
    // Mock paginated list
    return {
      data: [
        { id: '1', merchant: 'Whole Foods', category: 'Food', date: '2026-07-06T12:00:00Z', amount: -120.50, type: 'expense' },
        { id: '2', merchant: 'Salary', category: 'Income', date: '2026-07-05T09:00:00Z', amount: 4500.00, type: 'income' },
        { id: '3', merchant: 'Uber', category: 'Transport', date: '2026-07-04T18:30:00Z', amount: -24.00, type: 'expense' },
        { id: '4', merchant: 'Netflix', category: 'Entertainment', date: '2026-07-01T10:00:00Z', amount: -15.99, type: 'expense' },
        { id: '5', merchant: 'Electric Bill', category: 'Utilities', date: '2026-06-28T14:00:00Z', amount: -85.00, type: 'expense' },
      ],
      currentPage: page,
      totalPages: 1,
      totalItems: 5,
    };
  }

  async getBudgetProgress(userId: string) {
    return [
      { category: 'Housing', spent: 1500, limit: 1500, status: 'warning' },
      { category: 'Food', spent: 600, limit: 800, status: 'success' },
      { category: 'Entertainment', spent: 450, limit: 300, status: 'danger' },
      { category: 'Transport', spent: 300, limit: 400, status: 'success' },
    ];
  }
}
