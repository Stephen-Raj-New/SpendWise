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
exports.BudgetService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const budget_schema_1 = require("../schemas/budget.schema");
const expense_schema_1 = require("../schemas/expense.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let BudgetService = class BudgetService {
    budgetModel;
    expenseModel;
    notificationsService;
    constructor(budgetModel, expenseModel, notificationsService) {
        this.budgetModel = budgetModel;
        this.expenseModel = expenseModel;
        this.notificationsService = notificationsService;
    }
    getMonthRange(query = {}) {
        if (typeof query === 'string') {
            try {
                query = JSON.parse(query);
            }
            catch (e) {
                query = { range: 'month', year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
            }
        }
        const { range, year, month, quarter } = query || {};
        let start, end;
        if (range === 'this-year' || range === 'year') {
            start = year ? new Date(Number(year), 0, 1) : new Date(new Date().getFullYear(), 0, 1);
            end = year ? new Date(Number(year), 11, 31, 23, 59, 59, 999) : new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
        }
        else if (range === 'month' && year && month) {
            start = new Date(Number(year), Number(month) - 1, 1);
            end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
        }
        else if (range === 'quarter' && year && quarter) {
            const qStartMonth = (Number(quarter) - 1) * 3;
            start = new Date(Number(year), qStartMonth, 1);
            end = new Date(Number(year), qStartMonth + 3, 0, 23, 59, 59, 999);
        }
        else if (range === 'last-month') {
            const date = new Date();
            start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            end = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999);
        }
        else {
            const date = new Date();
            start = new Date(date.getFullYear(), date.getMonth(), 1);
            end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        }
        return { start, end };
    }
    async getBudgets(userId, query) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const { start, end } = this.getMonthRange(query);
        const startMonthStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
        const endMonthStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}`;
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
                _id: firstBudget._id,
                userId: firstBudget.userId,
                category: b._id,
                limit: b.limit,
                month: firstBudget.month,
                spent: spentMap.get(b._id) || 0
            };
        });
    }
    async setBudget(userId, dto) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const oldBudget = await this.budgetModel.findOne({ userId: uid, category: dto.category, month: dto.month });
        const oldLimit = oldBudget ? oldBudget.limit : 0;
        const budget = await this.budgetModel.findOneAndUpdate({ userId: uid, category: dto.category, month: dto.month }, { $set: { limit: dto.limit } }, { new: true, upsert: true });
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
    async deleteBudget(userId, id) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const result = await this.budgetModel.findOneAndDelete({ _id: new mongoose_2.Types.ObjectId(id), userId: uid });
        if (!result) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return { success: true };
    }
};
exports.BudgetService = BudgetService;
exports.BudgetService = BudgetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(budget_schema_1.Budget.name)),
    __param(1, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], BudgetService);
//# sourceMappingURL=budget.service.js.map