import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Expense } from '../schemas/expense.schema';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<Income>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  private getDateRange(query: any): { $gte: Date; $lte: Date } | null {
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
    } else if (range !== 'all') {
      end = new Date();
      start = new Date();
      if (range === 'year') start.setFullYear(start.getFullYear() - 1);
      else if (range === 'quarter') start.setMonth(start.getMonth() - 3);
      else start.setMonth(start.getMonth() - 1);
    } else {
      return null;
    }
    
    return { $gte: start, $lte: end };
  }

  async findAll(userId: string, query: any) {
    const { page = 1, limit = 10, type, category, dateFrom, dateTo, range } = query;
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (category) filter.category = category;
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    } else if (query.range && query.range !== 'all') {
      const rangeDate = this.getDateRange(query);
      if (rangeDate) filter.date = rangeDate;
    }

    let transactions = [];

    // Fetch Incomes if type allows
    if (!type || type === 'income') {
      const incomes = await this.incomeModel.find(filter).exec();
      const mappedIncomes = incomes.map(inc => ({
        _id: inc._id,
        userId: inc.userId,
        title: inc.source,
        description: inc.description,
        amount: inc.amount,
        category: inc.category,
        date: inc.date,
        type: 'income',
        status: inc.status,
      }));
      transactions.push(...mappedIncomes);
    }

    // Fetch Expenses if type allows
    if (!type || type === 'expense') {
      const expenses = await this.expenseModel.find(filter).exec();
      const mappedExpenses = expenses.map(exp => ({
        _id: exp._id,
        userId: exp.userId,
        title: exp.merchant,
        description: '', // expenses don't have description in current schema
        amount: -exp.amount, // Negate amount for expenses in unified view
        category: exp.category,
        date: exp.date,
        type: 'expense',
        status: 'Completed', // default for expenses
      }));
      transactions.push(...mappedExpenses);
    }

    // Sort by date descending
    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    const total = transactions.length;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Manual Pagination
    const paginatedData = transactions.slice(skip, skip + Number(limit));

    return {
      data: paginatedData,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async exportCsv(userId: string, query: any) {
    const data = await this.findAll(userId, { ...query, limit: 10000 }); // Large limit for export
    
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'Date' },
        { id: 'title', title: 'Merchant / Source' },
        { id: 'type', title: 'Type' },
        { id: 'category', title: 'Category' },
        { id: 'description', title: 'Description' },
        { id: 'amount', title: 'Amount' },
        { id: 'status', title: 'Status' }
      ]
    });

    const records = data.data.map(item => ({
      date: item.date.toISOString().split('T')[0],
      title: item.title,
      type: item.type.toUpperCase(),
      category: item.category,
      description: item.description || '',
      amount: item.amount,
      status: item.status
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
  }
}
