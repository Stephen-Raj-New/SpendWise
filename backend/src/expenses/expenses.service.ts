import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense } from '../schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  private getDateRange(query: any): { $gte: Date; $lte: Date } {
    if (typeof query === 'string') query = { range: query };
    const { range = 'month', year, month, quarter } = query || {};
    
    let start, end;
    
    if (range === 'year' && year) {
      start = new Date(Number(year), 0, 1);
      end = new Date(Number(year), 11, 31, 23, 59, 59, 999);
    } else if (range === 'month' && year && month) {
      start = new Date(Number(year), Number(month) - 1, 1);
      end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    } else if (range === 'quarter' && year && quarter) {
      const qStartMonth = (Number(quarter) - 1) * 3;
      start = new Date(Number(year), qStartMonth, 1);
      end = new Date(Number(year), qStartMonth + 3, 0, 23, 59, 59, 999);
    } else {
      end = new Date();
      start = new Date();
      if (range === 'year') start.setFullYear(start.getFullYear() - 1);
      else if (range === 'quarter') start.setMonth(start.getMonth() - 3);
      else start.setMonth(start.getMonth() - 1);
    }
    
    return { $gte: start, $lte: end };
  }

  async findAll(userId: string, query: any) {
    const { page = 1, limit = 10, merchant, category, dateFrom, dateTo, range } = query;
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (merchant) filter.merchant = new RegExp(merchant, 'i');
    if (category) filter.category = category;
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    } else if (query.range) {
      filter.date = this.getDateRange(query);
    }

    const total = await this.expenseModel.countDocuments(filter);
    const data = await this.expenseModel
      .find(filter)
      .sort({ date: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .exec();

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async getSummary(userId: string, query: any) {
    const dateRange = this.getDateRange(query);
    const prevDateRange = this.getDateRange(query); // rough previous period
    const diff = dateRange.$lte.getTime() - dateRange.$gte.getTime();
    prevDateRange.$gte = new Date(dateRange.$gte.getTime() - diff);
    prevDateRange.$lte = new Date(dateRange.$lte.getTime() - diff);

    const matchCurrent = { userId: new Types.ObjectId(userId), date: dateRange };
    const matchPrev = { userId: new Types.ObjectId(userId), date: prevDateRange };

    const [currentStats, prevStats, topCategoryStats] = await Promise.all([
      this.expenseModel.aggregate([
        { $match: matchCurrent },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      this.expenseModel.aggregate([
        { $match: matchPrev },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      this.expenseModel.aggregate([
        { $match: matchCurrent },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ])
    ]);

    const monthlyTotal = currentStats[0]?.total || 0;
    const prevTotal = prevStats[0]?.total || 0;
    const count = currentStats[0]?.count || 0;
    
    let monthlyTotalTrendPct = 0;
    if (prevTotal > 0) {
      monthlyTotalTrendPct = ((monthlyTotal - prevTotal) / prevTotal) * 100;
    } else if (monthlyTotal > 0) {
      monthlyTotalTrendPct = 100;
    }

    const avgPerTransaction = count > 0 ? monthlyTotal / count : 0;
    
    let topCategory = { name: 'N/A', percentage: 0 };
    if (topCategoryStats.length > 0 && monthlyTotal > 0) {
      topCategory = {
        name: topCategoryStats[0]._id,
        percentage: (topCategoryStats[0].total / monthlyTotal) * 100
      };
    }

    return {
      monthlyTotal,
      monthlyTotalTrendPct,
      avgPerTransaction,
      topCategory
    };
  }

  async getCategoryDistribution(userId: string, query: any) {
    const dateRange = this.getDateRange(query);
    
    const pipeline: any[] = [
      { $match: { userId: new Types.ObjectId(userId), date: dateRange } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $sort: { amount: -1 } }
    ];

    const distribution = await this.expenseModel.aggregate(pipeline);
    const totalAmount = distribution.reduce((sum, item) => sum + item.amount, 0);

    return distribution.map(item => ({
      category: item._id,
      amount: item.amount,
      percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0
    }));
  }

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const newExpense = new this.expenseModel({
      ...createExpenseDto,
      userId: new Types.ObjectId(userId)
    });
    
    const saved = await newExpense.save();
    
    this.notificationsGateway.sendNotificationToUser(userId, {
      title: 'Expense Added',
      message: `Expense of ₹${saved.amount} for ${saved.merchant} added.`,
      type: 'info'
    });

    return saved;
  }

  async update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseModel.findById(id);
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.userId.toString() !== userId) throw new ForbiddenException('Not authorized');

    return this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, { new: true }).exec();
  }

  async remove(userId: string, id: string) {
    const expense = await this.expenseModel.findById(id);
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.userId.toString() !== userId) throw new ForbiddenException('Not authorized');

    await this.expenseModel.findByIdAndDelete(id).exec();
    return { success: true };
  }

  async exportCsv(userId: string, query: any) {
    const data = await this.findAll(userId, { ...query, limit: 10000 }); // Large limit for export
    
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'Date' },
        { id: 'merchant', title: 'Merchant' },
        { id: 'category', title: 'Category' },
        { id: 'amount', title: 'Amount' }
      ]
    });

    const records = data.data.map(item => ({
      date: item.date.toISOString().split('T')[0],
      merchant: item.merchant,
      category: item.category,
      amount: item.amount
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
  }
}
