import { Model, Types } from 'mongoose';
import { Expense } from '../schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ExpensesService {
    private expenseModel;
    private notificationsService;
    constructor(expenseModel: Model<Expense>, notificationsService: NotificationsService);
    private getDateRange;
    findAll(userId: string, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, Expense, {}, import("mongoose").DefaultSchemaOptions> & Expense & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSummary(userId: string, query: any): Promise<{
        monthlyTotal: any;
        monthlyTotalTrendPct: number;
        avgPerTransaction: number;
        topCategory: {
            name: string;
            percentage: number;
        };
    }>;
    getCategoryDistribution(userId: string, query: any): Promise<{
        category: any;
        amount: any;
        percentage: number;
    }[]>;
    create(userId: string, createExpenseDto: CreateExpenseDto): Promise<import("mongoose").Document<unknown, {}, Expense, {}, import("mongoose").DefaultSchemaOptions> & Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<(import("mongoose").Document<unknown, {}, Expense, {}, import("mongoose").DefaultSchemaOptions> & Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    exportCsv(userId: string, query: any): Promise<string>;
}
