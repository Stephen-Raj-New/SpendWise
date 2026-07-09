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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../schemas/expense.schema");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const csv_writer_1 = require("csv-writer");
let ExpensesService = class ExpensesService {
    expenseModel;
    notificationsGateway;
    constructor(expenseModel, notificationsGateway) {
        this.expenseModel = expenseModel;
        this.notificationsGateway = notificationsGateway;
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
        const { page = 1, limit = 10, merchant, category, dateFrom, dateTo, range } = query;
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (merchant)
            filter.merchant = new RegExp(merchant, 'i');
        if (category)
            filter.category = category;
        if (dateFrom || dateTo) {
            filter.date = {};
            if (dateFrom)
                filter.date.$gte = new Date(dateFrom);
            if (dateTo)
                filter.date.$lte = new Date(dateTo);
        }
        else if (range) {
            filter.date = this.getDateRange(range);
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
    async getSummary(userId, range) {
        const dateRange = this.getDateRange(range);
        const prevDateRange = this.getDateRange(range);
        const diff = dateRange.$lte.getTime() - dateRange.$gte.getTime();
        prevDateRange.$gte = new Date(dateRange.$gte.getTime() - diff);
        prevDateRange.$lte = new Date(dateRange.$lte.getTime() - diff);
        const matchCurrent = { userId: new mongoose_2.Types.ObjectId(userId), date: dateRange };
        const matchPrev = { userId: new mongoose_2.Types.ObjectId(userId), date: prevDateRange };
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
        }
        else if (monthlyTotal > 0) {
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
    async getCategoryDistribution(userId, range) {
        const dateRange = this.getDateRange(range);
        const pipeline = [
            { $match: { userId: new mongoose_2.Types.ObjectId(userId), date: dateRange } },
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
    async create(userId, createExpenseDto) {
        const newExpense = new this.expenseModel({
            ...createExpenseDto,
            userId: new mongoose_2.Types.ObjectId(userId)
        });
        const saved = await newExpense.save();
        this.notificationsGateway.sendNotificationToUser(userId, {
            title: 'Expense Added',
            message: `Expense of ₹${saved.amount} for ${saved.merchant} added.`,
            type: 'info'
        });
        return saved;
    }
    async update(userId, id, updateExpenseDto) {
        const expense = await this.expenseModel.findById(id);
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        if (expense.userId.toString() !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        return this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, { new: true }).exec();
    }
    async remove(userId, id) {
        const expense = await this.expenseModel.findById(id);
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        if (expense.userId.toString() !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        await this.expenseModel.findByIdAndDelete(id).exec();
        return { success: true };
    }
    async exportCsv(userId, query) {
        const data = await this.findAll(userId, { ...query, limit: 10000 });
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
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
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map