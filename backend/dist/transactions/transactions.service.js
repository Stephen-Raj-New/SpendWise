"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const income_schema_1 = require("../schemas/income.schema");
const expense_schema_1 = require("../schemas/expense.schema");
const csv_writer_1 = require("csv-writer");
let TransactionsService = class TransactionsService {
    incomeModel;
    expenseModel;
    constructor(incomeModel, expenseModel) {
        this.incomeModel = incomeModel;
        this.expenseModel = expenseModel;
    }
    getDateRange(range) {
        const end = new Date();
        const start = new Date();
        if (range === 'year')
            start.setFullYear(start.getFullYear() - 1);
        else if (range === 'quarter')
            start.setMonth(start.getMonth() - 3);
        else
            start.setMonth(start.getMonth() - 1);
        return { $gte: start, $lte: end };
    }
    async findAll(userId, query) {
        const { page = 1, limit = 10, type, category, dateFrom, dateTo, range } = query;
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (category)
            filter.category = category;
        if (dateFrom || dateTo) {
            filter.date = {};
            if (dateFrom)
                filter.date.$gte = new Date(dateFrom);
            if (dateTo)
                filter.date.$lte = new Date(dateTo);
        }
        else if (range && range !== 'all') {
            filter.date = this.getDateRange(range);
        }
        let transactions = [];
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
        if (!type || type === 'expense') {
            const expenses = await this.expenseModel.find(filter).exec();
            const mappedExpenses = expenses.map(exp => ({
                _id: exp._id,
                userId: exp.userId,
                title: exp.merchant,
                description: '',
                amount: -exp.amount,
                category: exp.category,
                date: exp.date,
                type: 'expense',
                status: 'Completed',
            }));
            transactions.push(...mappedExpenses);
        }
        transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
        const total = transactions.length;
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedData = transactions.slice(skip, skip + Number(limit));
        return {
            data: paginatedData,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        };
    }
    async exportCsv(userId, query) {
        const data = await this.findAll(userId, { ...query, limit: 10000 });
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(income_schema_1.Income.name)),
    __param(1, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map