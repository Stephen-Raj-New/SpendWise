import { TransactionsService } from './transactions.service';
import type { Response } from 'express';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(req: any, query: any): Promise<{
        data: {
            _id: import("mongoose").Types.ObjectId;
            userId: import("mongoose").Types.ObjectId;
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
    exportCsv(req: any, query: any, res: Response): Promise<void>;
}
