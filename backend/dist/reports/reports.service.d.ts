import { Model } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Expense } from '../schemas/expense.schema';
export declare class ReportsService {
    private incomeModel;
    private expenseModel;
    constructor(incomeModel: Model<Income>, expenseModel: Model<Expense>);
    getSummaryReport(userId: string, year: number): Promise<{
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
