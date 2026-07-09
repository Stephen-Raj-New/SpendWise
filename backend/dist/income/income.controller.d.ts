import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import type { Response } from 'express';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    findAll(req: any, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../schemas/income.schema").Income, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/income.schema").Income & Required<{
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
        topSource: {
            name: string;
            percentage: number;
        };
    }>;
    getSourceDistribution(req: any, query: any): Promise<{
        source: any;
        amount: any;
        percentage: number;
    }[]>;
    exportCsv(req: any, query: any, res: Response): Promise<void>;
    create(req: any, createIncomeDto: CreateIncomeDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/income.schema").Income, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/income.schema").Income & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: any, id: string, updateIncomeDto: UpdateIncomeDto): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/income.schema").Income, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/income.schema").Income & Required<{
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
