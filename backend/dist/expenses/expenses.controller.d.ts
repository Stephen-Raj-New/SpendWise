import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import type { Response } from 'express';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(req: any, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../schemas/expense.schema").Expense, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/expense.schema").Expense & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    getSummary(req: any, query: any): Promise<{
        monthlyTotal: any;
        monthlyTotalTrendPct: number;
        avgPerTransaction: number;
        topCategory: {
            name: string;
            percentage: number;
        };
    }>;
    getCategoryDistribution(req: any, query: any): Promise<{
        category: any;
        amount: any;
        percentage: number;
    }[]>;
    exportCsv(req: any, query: any, res: Response): Promise<void>;
    create(req: any, createExpenseDto: CreateExpenseDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/expense.schema").Expense, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/expense.schema").Expense & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: any, id: string, updateExpenseDto: UpdateExpenseDto): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/expense.schema").Expense, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/expense.schema").Expense & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
