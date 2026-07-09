import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { Expense } from '../schemas/expense.schema';
import { SetBudgetDto } from './dto/set-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  async getBudgets(userId: string, month: string) {
    const uid = new Types.ObjectId(userId);
    const budgets = await this.budgetModel.find({ userId: uid, month });
    
    // Calculate spent for each budget in real-time
    const [year, monthStr] = month.split('-');
    const startDate = new Date(Number(year), Number(monthStr) - 1, 1);
    const endDate = new Date(Number(year), Number(monthStr), 0, 23, 59, 59, 999);

    const expenses = await this.expenseModel.aggregate([
      { 
        $match: { 
          userId: uid, 
          date: { $gte: startDate, $lte: endDate } 
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
      const bObj = b.toObject();
      bObj.spent = spentMap.get(b.category) || 0;
      return bObj;
    });
  }

  async setBudget(userId: string, dto: SetBudgetDto) {
    const uid = new Types.ObjectId(userId);
    
    // Upsert budget for category and month
    const budget = await this.budgetModel.findOneAndUpdate(
      { userId: uid, category: dto.category, month: dto.month },
      { $set: { limit: dto.limit } },
      { new: true, upsert: true }
    );

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
