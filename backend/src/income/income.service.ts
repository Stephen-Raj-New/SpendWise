import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Category } from '../schemas/category.schema';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private notificationsService: NotificationsService,
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
    const { page = 1, limit = 10, source, category, status, dateFrom, dateTo, range } = query;
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (source) filter.source = new RegExp(source, 'i');
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    } else if (query.range) {
      filter.date = this.getDateRange(query);
    }

    const total = await this.incomeModel.countDocuments(filter);
    const data = await this.incomeModel
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

    const matchCurrent = { userId: new Types.ObjectId(userId), date: dateRange, status: 'Confirmed' };
    const matchPrev = { userId: new Types.ObjectId(userId), date: prevDateRange, status: 'Confirmed' };

    const [currentStats, prevStats, topSourceStats] = await Promise.all([
      this.incomeModel.aggregate([
        { $match: matchCurrent },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      this.incomeModel.aggregate([
        { $match: matchPrev },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      this.incomeModel.aggregate([
        { $match: matchCurrent },
        { $group: { _id: '$source', total: { $sum: '$amount' } } },
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
    
    let topSource = { name: 'N/A', percentage: 0 };
    if (topSourceStats.length > 0 && monthlyTotal > 0) {
      topSource = {
        name: topSourceStats[0]._id,
        percentage: (topSourceStats[0].total / monthlyTotal) * 100
      };
    }

    return {
      monthlyTotal,
      monthlyTotalTrendPct,
      avgPerTransaction,
      topSource
    };
  }

  async getSourceDistribution(userId: string, query: any) {
    const dateRange = this.getDateRange(query);
    
    const pipeline: any[] = [
      { $match: { userId: new Types.ObjectId(userId), date: dateRange, status: 'Confirmed' } },
      { $group: { _id: '$source', amount: { $sum: '$amount' } } },
      { $sort: { amount: -1 } }
    ];

    const distribution = await this.incomeModel.aggregate(pipeline);
    const totalAmount = distribution.reduce((sum, item) => sum + item.amount, 0);

    return distribution.map(item => ({
      source: item._id,
      amount: item.amount,
      percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0
    }));
  }

  async create(userId: string, createIncomeDto: CreateIncomeDto) {
    const uid = new Types.ObjectId(userId);
    
    // Auto-create category if it doesn't exist
    const existingCategory = await this.categoryModel.findOne({ userId: uid, name: new RegExp(`^${createIncomeDto.category}$`, 'i'), type: 'income' });
    if (!existingCategory) {
      await new this.categoryModel({
        userId: uid,
        name: createIncomeDto.category,
        color: '#10b981', // green for income
        type: 'income'
      }).save();
    }

    const newIncome = new this.incomeModel({
      ...createIncomeDto,
      userId: uid
    });
    
    const saved = await newIncome.save();
    
    this.notificationsService.createNotification(userId, {
      title: 'Income Received',
      message: `Income of ₹${saved.amount} received from ${saved.source}`,
      type: 'income_received',
      meta: { incomeId: saved._id, amount: saved.amount },
      actions: [
        { label: 'View Income', actionType: 'navigate', payload: '/income' }
      ]
    });

    return saved;
  }

  async update(userId: string, id: string, updateIncomeDto: UpdateIncomeDto) {
    const income = await this.incomeModel.findById(id);
    if (!income) throw new NotFoundException('Income not found');
    if (income.userId.toString() !== userId) throw new ForbiddenException('Not authorized');

    const oldAmount = income.amount;
    const updated = await this.incomeModel.findByIdAndUpdate(id, updateIncomeDto, { new: true }).exec();

    // Send a notification if the amount was changed
    if (updated && updateIncomeDto.amount !== undefined && Number(updateIncomeDto.amount) !== oldAmount) {
      this.notificationsService.createNotification(userId, {
        title: 'Income Updated',
        message: `Income from ${updated.source} was updated from ₹${oldAmount} to ₹${updated.amount}`,
        type: 'system_update',
        meta: { incomeId: updated._id, amount: updated.amount, oldAmount },
        actions: [
          { label: 'View Income', actionType: 'navigate', payload: '/income' }
        ]
      });
    }

    return updated;
  }

  async remove(userId: string, id: string) {
    const income = await this.incomeModel.findById(id);
    if (!income) throw new NotFoundException('Income not found');
    if (income.userId.toString() !== userId) throw new ForbiddenException('Not authorized');

    await this.incomeModel.findByIdAndDelete(id).exec();
    return { success: true };
  }

  async exportCsv(userId: string, query: any) {
    const data = await this.findAll(userId, { ...query, limit: 10000 }); // Large limit for export
    
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'Date' },
        { id: 'source', title: 'Source' },
        { id: 'category', title: 'Category' },
        { id: 'description', title: 'Description' },
        { id: 'amount', title: 'Amount' },
        { id: 'currency', title: 'Currency' },
        { id: 'status', title: 'Status' }
      ]
    });

    const records = data.data.map(item => ({
      date: item.date.toISOString().split('T')[0],
      source: item.source,
      category: item.category,
      description: item.description || '',
      amount: item.amount,
      currency: item.currency,
      status: item.status
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
  }
}
