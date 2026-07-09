import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Expense } from '../schemas/expense.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  async getSummaryReport(userId: string, year: number) {
    const uid = new Types.ObjectId(userId);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    const [incomes, expenses] = await Promise.all([
      this.incomeModel.aggregate([
        { $match: { userId: uid, date: { $gte: startDate, $lte: endDate } } },
        { 
          $group: { 
            _id: { month: { $month: '$date' } }, 
            total: { $sum: '$amount' } 
          } 
        },
        { $sort: { '_id.month': 1 } }
      ]),
      this.expenseModel.aggregate([
        { $match: { userId: uid, date: { $gte: startDate, $lte: endDate } } },
        { 
          $group: { 
            _id: { month: { $month: '$date' } }, 
            total: { $sum: '$amount' } 
          } 
        },
        { $sort: { '_id.month': 1 } }
      ])
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyData = months.map((label, index) => {
      const monthNum = index + 1;
      const inc = incomes.find(i => i._id.month === monthNum);
      const exp = expenses.find(e => e._id.month === monthNum);
      return {
        label,
        income: inc ? inc.total : 0,
        expense: exp ? exp.total : 0,
      };
    });

    const categoryBreakdown = await this.expenseModel.aggregate([
      { $match: { userId: uid, date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    return {
      monthlyData,
      categoryBreakdown: categoryBreakdown.map(c => ({ category: c._id, total: c.total }))
    };
  }
}
