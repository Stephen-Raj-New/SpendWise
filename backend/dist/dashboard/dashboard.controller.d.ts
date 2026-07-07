import { DashboardService } from './dashboard.service';
import { Request } from 'express';
interface RequestWithUser extends Request {
    user: {
        sub?: string | number;
        userId?: string;
        email?: string;
        role?: string;
    };
}
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(req: RequestWithUser, period?: string): Promise<{
        totalBalance: number;
        totalBalanceTrendPct: number;
        income: number;
        expenses: number;
        budgetGoal: number;
    }>;
    getIncomeVsExpense(req: RequestWithUser): Promise<{
        label: string;
        income: number;
        expense: number;
    }[]>;
    getSpendingByCategory(req: RequestWithUser): Promise<{
        category: string;
        amount: number;
        color: string;
    }[]>;
    getRecentTransactions(req: RequestWithUser, page?: number, limit?: number): Promise<{
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
    getBudgetProgress(req: RequestWithUser): Promise<{
        category: string;
        spent: number;
        limit: number;
        status: string;
    }[]>;
}
export {};
