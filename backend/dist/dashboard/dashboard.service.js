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
    async getSummary(userId, period) {
        return {
            totalBalance: 12500,
            totalBalanceTrendPct: 4.5,
            income: 8200,
            expenses: 3450,
            budgetGoal: 5000,
        };
    }
    async getIncomeVsExpense(userId) {
        return [
            { label: 'Week 1', income: 2000, expense: 800 },
            { label: 'Week 2', income: 2200, expense: 1200 },
            { label: 'Week 3', income: 1500, expense: 900 },
            { label: 'Week 4', income: 2500, expense: 550 },
        ];
    }
    async getSpendingByCategory(userId) {
        return [
            { category: 'Housing', amount: 1500, color: '#3b82f6' },
            { category: 'Food', amount: 600, color: '#10b981' },
            { category: 'Transport', amount: 300, color: '#f59e0b' },
            { category: 'Entertainment', amount: 450, color: '#ef4444' },
            { category: 'Utilities', amount: 600, color: '#8b5cf6' },
        ];
    }
    async getRecentTransactions(userId, page, limit) {
        return {
            data: [
                { id: '1', merchant: 'Whole Foods', category: 'Food', date: '2026-07-06T12:00:00Z', amount: -120.50, type: 'expense' },
                { id: '2', merchant: 'Salary', category: 'Income', date: '2026-07-05T09:00:00Z', amount: 4500.00, type: 'income' },
                { id: '3', merchant: 'Uber', category: 'Transport', date: '2026-07-04T18:30:00Z', amount: -24.00, type: 'expense' },
                { id: '4', merchant: 'Netflix', category: 'Entertainment', date: '2026-07-01T10:00:00Z', amount: -15.99, type: 'expense' },
                { id: '5', merchant: 'Electric Bill', category: 'Utilities', date: '2026-06-28T14:00:00Z', amount: -85.00, type: 'expense' },
            ],
            currentPage: page,
            totalPages: 1,
            totalItems: 5,
        };
    }
    async getBudgetProgress(userId) {
        return [
            { category: 'Housing', spent: 1500, limit: 1500, status: 'warning' },
            { category: 'Food', spent: 600, limit: 800, status: 'success' },
            { category: 'Entertainment', spent: 450, limit: 300, status: 'danger' },
            { category: 'Transport', spent: 300, limit: 400, status: 'success' },
        ];
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