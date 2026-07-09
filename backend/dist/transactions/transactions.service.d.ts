import { Model, Types } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Expense } from '../schemas/expense.schema';
export declare class TransactionsService {
    private incomeModel;
    private expenseModel;
    constructor(incomeModel: Model<Income>, expenseModel: Model<Expense>);
    private getDateRange;
    findAll(userId: string, query: any): Promise<{
        data: {
            _id: Types.ObjectId;
            userId: Types.ObjectId;
            title: string;
            description: string;
            amount: number;
            category: string;
            date: Date;
            type: string;
            status: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    exportCsv(userId: string, query: any): Promise<string>;
}
