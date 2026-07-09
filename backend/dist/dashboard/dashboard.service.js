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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const income_schema_1 = require("../schemas/income.schema");
const expense_schema_1 = require("../schemas/expense.schema");
const budget_schema_1 = require("../schemas/budget.schema");
const category_schema_1 = require("../schemas/category.schema");
let DashboardService = class DashboardService {
    incomeModel;
    expenseModel;
    budgetModel;
    categoryModel;
    constructor(incomeModel, expenseModel, budgetModel, categoryModel) {
        this.incomeModel = incomeModel;
        this.expenseModel = expenseModel;
        this.budgetModel = budgetModel;
        this.categoryModel = categoryModel;
    }
    getMonthRange(query = {}) {
        if (typeof query === 'string')
            query = { range: query };
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
        return { $gte: start, $lte: end };
    }
    async getSummary(userId, query = {}) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const currentMonth = this.getMonthRange(query);
        const prevDate = new Date(currentMonth.$gte);
        prevDate.setMonth(prevDate.getMonth() - 1);
        const prevMonth = this.getMonthRange({ ...query, range: 'last-month' });
        const [currentIncome, currentExpense, prevIncome, prevExpense, budgets] = await Promise.all([
            this.incomeModel.aggregate([{ $match: { userId: uid, date: currentMonth, status: 'Confirmed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            this.expenseModel.aggregate([{ $match: { userId: uid, date: currentMonth } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            this.incomeModel.aggregate([{ $match: { userId: uid, date: prevMonth, status: 'Confirmed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            this.expenseModel.aggregate([{ $match: { userId: uid, date: prevMonth } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            this.budgetModel.find({ userId: uid, month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}` })
        ]);
        const income = currentIncome[0]?.total || 0;
        const expenses = currentExpense[0]?.total || 0;
        const totalBalance = income - expenses;
        const pIncome = prevIncome[0]?.total || 0;
        const pExpenses = prevExpense[0]?.total || 0;
        const pBalance = pIncome - pExpenses;
        let totalBalanceTrendPct = 0;
        if (pBalance > 0) {
            totalBalanceTrendPct = ((totalBalance - pBalance) / pBalance) * 100;
        }
        else if (totalBalance > 0) {
            totalBalanceTrendPct = 100;
        }
        const budgetGoal = budgets.reduce((acc, b) => acc + b.limit, 0);
        return {
            totalBalance,
            totalBalanceTrendPct,
            income,
            expenses,
            budgetGoal,
        };
    }
    async getIncomeVsExpense(userId, query = {}) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const endRange = this.getMonthRange(query);
        const endDate = new Date(endRange.$lte);
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(endDate);
            d.setMonth(d.getMonth() - i);
            const range = this.getMonthRange({ range: 'month', year: d.getFullYear(), month: d.getMonth() + 1 });
            const [inc, exp] = await Promise.all([
                this.incomeModel.aggregate([{ $match: { userId: uid, date: range, status: 'Confirmed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
                this.expenseModel.aggregate([{ $match: { userId: uid, date: range } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            ]);
            data.push({
                label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
                income: inc[0]?.total || 0,
                expense: exp[0]?.total || 0
            });
        }
        return data;
    }
    async getSpendingByCategory(userId, query = {}) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const range = this.getMonthRange(query);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
        const stats = await this.expenseModel.aggregate([
            { $match: { userId: uid, date: range } },
            { $group: { _id: '$category', amount: { $sum: '$amount' } } },
            { $sort: { amount: -1 } }
        ]);
        return stats.map((s, idx) => ({
            category: s._id,
            amount: s.amount,
            color: colors[idx % colors.length]
        }));
    }
    async getRecentTransactions(userId, page, limit, query = {}) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const dateRange = this.getMonthRange(query);
        const [incomes, expenses] = await Promise.all([
            this.incomeModel.find({ userId: uid, date: dateRange }).sort({ date: -1 }).limit(limit),
            this.expenseModel.find({ userId: uid, date: dateRange }).sort({ date: -1 }).limit(limit)
        ]);
        const mapped = [
            ...incomes.map(i => ({ id: i._id, merchant: i.source, category: i.category, date: i.date, amount: i.amount, type: 'income' })),
            ...expenses.map(e => ({ id: e._id, merchant: e.merchant, category: e.category, date: e.date, amount: -e.amount, type: 'expense' }))
        ];
        mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            data: mapped.slice(0, limit),
            currentPage: page,
            totalPages: 1,
            totalItems: mapped.length,
        };
    }
    async getBudgetProgress(userId, query = {}) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const range = this.getMonthRange(query);
        const monthTarget = new Date(range.$gte);
        const currentMonth = `${monthTarget.getFullYear()}-${String(monthTarget.getMonth() + 1).padStart(2, '0')}`;
        const budgets = await this.budgetModel.find({ userId: uid, month: currentMonth });
        if (budgets.length === 0)
            return [];
        const stats = await this.expenseModel.aggregate([
            { $match: { userId: uid, date: range } },
            { $group: { _id: '$category', amount: { $sum: '$amount' } } }
        ]);
        const expenseMap = new Map(stats.map(s => [s._id, s.amount]));
        return budgets.map(b => {
            const spent = expenseMap.get(b.category) || 0;
            const pct = (spent / b.limit) * 100;
            let status = 'success';
            if (pct > 90)
                status = 'danger';
            else if (pct > 75)
                status = 'warning';
            return {
                category: b.category,
                spent,
                limit: b.limit,
                status
            };
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(income_schema_1.Income.name)),
    __param(1, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __param(2, (0, mongoose_1.InjectModel)(budget_schema_1.Budget.name)),
    __param(3, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map