import { Model, Types } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Expense } from '../schemas/expense.schema';
import { Budget } from '../schemas/budget.schema';
import { Category } from '../schemas/category.schema';
export declare class DashboardService {
    private incomeModel;
    private expenseModel;
    private budgetModel;
    private categoryModel;
    constructor(incomeModel: Model<Income>, expenseModel: Model<Expense>, budgetModel: Model<Budget>, categoryModel: Model<Category>);
    private getMonthRange;
    getSummary(userId: string, query?: any): Promise<{
        totalBalance: number;
        totalBalanceTrendPct: number;
        income: any;
        expenses: any;
        budgetGoal: number;
        overallAvailableBalance: number;
    }>;
    getIncomeVsExpense(userId: string, query?: any): Promise<{
        label: string;
        income: any;
        expense: any;
    }[]>;
    getSpendingByCategory(userId: string, query?: any): Promise<{
        category: any;
        amount: any;
        color: string;
    }[]>;
    getRecentTransactions(userId: string, page: number, limit: number, query?: any): Promise<{
        data: {
            id: Types.ObjectId;
            merchant: string;
            category: string;
            date: Date;
            amount: number;
            type: string;
        }[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
    }>;
    getBudgetProgress(userId: string, query?: any): Promise<{
        category: string;
        spent: any;
        limit: number;
        status: string;
    }[]>;
}
