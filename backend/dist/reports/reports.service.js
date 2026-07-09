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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const income_schema_1 = require("../schemas/income.schema");
const expense_schema_1 = require("../schemas/expense.schema");
let ReportsService = class ReportsService {
    incomeModel;
    expenseModel;
    constructor(incomeModel, expenseModel) {
        this.incomeModel = incomeModel;
        this.expenseModel = expenseModel;
    }
    getMonthRange(query = {}) {
        if (typeof query === 'string') {
            try {
                query = JSON.parse(query);
            }
            catch (e) {
                query = { range: 'year', year: new Date().getFullYear() };
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
        else {
            start = new Date(new Date().getFullYear(), 0, 1);
            end = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
        }
        return { start, end, rangeType: range || 'year', y: Number(year) || new Date().getFullYear(), m: month ? Number(month) : undefined, q: quarter ? Number(quarter) : undefined };
    }
    async getSummaryReport(userId, query) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const { start, end, rangeType, y, m, q } = this.getMonthRange(query);
        const [incomes, expenses] = await Promise.all([
            this.incomeModel.aggregate([
                { $match: { userId: uid, date: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: rangeType === 'month' ? { day: { $dayOfMonth: '$date' } } : { month: { $month: '$date' } },
                        total: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id.month': 1, '_id.day': 1 } }
            ]),
            this.expenseModel.aggregate([
                { $match: { userId: uid, date: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: rangeType === 'month' ? { day: { $dayOfMonth: '$date' } } : { month: { $month: '$date' } },
                        total: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id.month': 1, '_id.day': 1 } }
            ])
        ]);
        let monthlyData = [];
        if (rangeType === 'month') {
            const daysInMonth = new Date(y, m, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                const inc = incomes.find(inc => inc._id.day === i);
                const exp = expenses.find(exp => exp._id.day === i);
                monthlyData.push({
                    label: `${i}`,
                    income: inc ? inc.total : 0,
                    expense: exp ? exp.total : 0,
                });
            }
        }
        else if (rangeType === 'quarter') {
            const startMonth = (q - 1) * 3;
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let i = 0; i < 3; i++) {
                const monthNum = startMonth + i + 1;
                const inc = incomes.find(inc => inc._id.month === monthNum);
                const exp = expenses.find(exp => exp._id.month === monthNum);
                monthlyData.push({
                    label: months[startMonth + i],
                    income: inc ? inc.total : 0,
                    expense: exp ? exp.total : 0,
                });
            }
        }
        else {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            monthlyData = months.map((label, index) => {
                const monthNum = index + 1;
                const inc = incomes.find(i => i._id.month === monthNum);
                const exp = expenses.find(e => e._id.month === monthNum);
                return {
                    label,
                    income: inc ? inc.total : 0,
                    expense: exp ? exp.total : 0,
                };
            });
        }
        const categoryBreakdown = await this.expenseModel.aggregate([
            { $match: { userId: uid, date: { $gte: start, $lte: end } } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        return {
            monthlyData,
            categoryBreakdown: categoryBreakdown.map(c => ({ category: c._id, total: c.total }))
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(income_schema_1.Income.name)),
    __param(1, (0, mongoose_1.InjectModel)(expense_schema_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map