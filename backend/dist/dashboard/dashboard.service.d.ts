import { Model } from 'mongoose';
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
    getSummary(userId: string, period?: string): Promise<{
        totalBalance: number;
        totalBalanceTrendPct: number;
        income: number;
        expenses: number;
        budgetGoal: number;
    }>;
    getIncomeVsExpense(userId: string): Promise<{
        label: string;
        income: number;
        expense: number;
    }[]>;
    getSpendingByCategory(userId: string): Promise<{
        category: string;
        amount: number;
        color: string;
    }[]>;
    getRecentTransactions(userId: string, page: number, limit: number): Promise<{
        data: {
            id: string;
            merchant: string;
            category: string;
            date: string;
            amount: number;
            type: string;
        }[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
    }>;
    getBudgetProgress(userId: string): Promise<{
        category: string;
        spent: number;
        limit: number;
        status: string;
    }[]>;
}
