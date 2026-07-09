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
let BudgetService = class BudgetService {
    budgetModel;
    expenseModel;
    constructor(budgetModel, expenseModel) {
        this.budgetModel = budgetModel;
        this.expenseModel = expenseModel;
    }
    async getBudgets(userId, month) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const budgets = await this.budgetModel.find({ userId: uid, month });
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
    async setBudget(userId, dto) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const budget = await this.budgetModel.findOneAndUpdate({ userId: uid, category: dto.category, month: dto.month }, { $set: { limit: dto.limit } }, { new: true, upsert: true });
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
        mongoose_2.Model])
], BudgetService);
//# sourceMappingURL=budget.service.js.map