import { Model } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Expense } from '../schemas/expense.schema';
export declare class ReportsService {
    private incomeModel;
    private expenseModel;
    constructor(incomeModel: Model<Income>, expenseModel: Model<Expense>);
    private getMonthRange;
    getSummaryReport(userId: string, query: any): Promise<{
        monthlyData: {
            label: string;
            income: any;
            expense: any;
        }[];
        categoryBreakdown: {
            category: any;
            total: any;
        }[];
    }>;
}
