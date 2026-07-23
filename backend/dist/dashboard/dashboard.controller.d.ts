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
    getSummary(req: RequestWithUser, query: any): Promise<{
        totalBalance: number;
        totalBalanceTrendPct: number;
        income: any;
        expenses: any;
        budgetGoal: number;
        overallAvailableBalance: number;
    }>;
    getIncomeVsExpense(req: RequestWithUser, query: any): Promise<{
        label: string;
        income: any;
        expense: any;
    }[]>;
    getSpendingByCategory(req: RequestWithUser, query: any): Promise<{
        category: any;
        amount: any;
        color: string;
    }[]>;
    getRecentTransactions(req: RequestWithUser, page: number | undefined, limit: number | undefined, query: any): Promise<{
        data: {
            id: import("mongoose").Types.ObjectId;
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
    getBudgetProgress(req: RequestWithUser, query: any): Promise<{
        category: string;
        spent: any;
        limit: number;
        status: string;
    }[]>;
}
export {};
