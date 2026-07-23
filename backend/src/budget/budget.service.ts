import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { Expense } from '../schemas/expense.schema';
import { SetBudgetDto } from './dto/set-budget.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private notificationsService: NotificationsService,
  ) {}

  private getMonthRange(query: any = {}): { start: Date; end: Date } {
    if (typeof query === 'string') {
      try {
        query = JSON.parse(query);
      } catch (e) {
        query = { range: 'month', year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
      }
    }
    const { range, year, month, quarter } = query || {};
    
    let start, end;
    
    if (range === 'this-year' || range === 'year') {
      start = year ? new Date(Number(year), 0, 1) : new Date(new Date().getFullYear(), 0, 1);
      end = year ? new Date(Number(year), 11, 31, 23, 59, 59, 999) : new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
    } else if (range === 'month' && year && month) {
      start = new Date(Number(year), Number(month) - 1, 1);
      end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    } else if (range === 'quarter' && year && quarter) {
      const qStartMonth = (Number(quarter) - 1) * 3;
      start = new Date(Number(year), qStartMonth, 1);
      end = new Date(Number(year), qStartMonth + 3, 0, 23, 59, 59, 999);
    } else if (range === 'last-month') {
      const date = new Date();
      start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      end = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999);
    } else {
      // default to this-month
      const date = new Date();
      start = new Date(date.getFullYear(), date.getMonth(), 1);
      end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    
    return { start, end };
  }

  async getBudgets(userId: string, query: any) {
    const uid = new Types.ObjectId(userId);
    const { start, end } = this.getMonthRange(query);
    
    const startMonthStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
    const endMonthStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}`;
    // Aggregate budgets across the selected month range
    const budgets = await this.budgetModel.aggregate([
      { 
        $match: { 
          userId: uid, 
          month: { $gte: startMonthStr, $lte: endMonthStr } 
        } 
      },
      {
        $group: {
          _id: '$category',
          limit: { $sum: '$limit' },
          budgets: { $push: '$$ROOT' }
        }
      }
    ]);
    
    const expenses = await this.expenseModel.aggregate([
      { 
        $match: { 
          userId: uid, 
          date: { $gte: start, $lte: end } 
        } 
      },
      { 
        $group: { 
          _id: '$category', 
          totalSpent: { $sum: '$amount' } 
        } 
      }
    ]);

    const spentMap = new Map(expenses.map(e => [e._id, e.totalSpent]));

    return budgets.map(b => {
      const firstBudget = b.budgets[0];
      return {
        _id: firstBudget._id, // use the first budget ID for deletion references
        userId: firstBudget.userId,
        category: b._id,
        limit: b.limit,
        month: firstBudget.month,
        spent: spentMap.get(b._id) || 0
      };
    });
  }

  async setBudget(userId: string, dto: SetBudgetDto) {
    const uid = new Types.ObjectId(userId);
    
    // Check old budget
    const oldBudget = await this.budgetModel.findOne({ userId: uid, category: dto.category, month: dto.month });
    const oldLimit = oldBudget ? oldBudget.limit : 0;

    // Upsert budget for category and month
    const budget = await this.budgetModel.findOneAndUpdate(
      { userId: uid, category: dto.category, month: dto.month },
      { $set: { limit: dto.limit } },
      { new: true, upsert: true }
    );

    if (oldLimit !== dto.limit) {
       this.notificationsService.createNotification(userId, {
        title: oldBudget ? 'Budget Updated' : 'Budget Created',
        message: oldBudget 
           ? `Budget limit for ${dto.category} was updated from ₹${oldLimit} to ₹${dto.limit}`
           : `New budget limit of ₹${dto.limit} set for ${dto.category}`,
        type: 'system_update',
        meta: { budgetId: budget._id, limit: dto.limit, oldLimit },
        actions: [
          { label: 'View Budgets', actionType: 'navigate', payload: '/budget' }
        ]
      });
    }

    return budget;
  }

  async deleteBudget(userId: string, id: string) {
    const uid = new Types.ObjectId(userId);
    const result = await this.budgetModel.findOneAndDelete({ _id: new Types.ObjectId(id), userId: uid });
    if (!result) {
      throw new NotFoundException('Budget not found');
    }
    return { success: true };
  }
}
