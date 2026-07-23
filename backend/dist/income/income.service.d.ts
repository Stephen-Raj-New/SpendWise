import { Model, Types } from 'mongoose';
import { Income } from '../schemas/income.schema';
import { Category } from '../schemas/category.schema';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class IncomeService {
    private incomeModel;
    private categoryModel;
    private notificationsService;
    constructor(incomeModel: Model<Income>, categoryModel: Model<Category>, notificationsService: NotificationsService);
    private getDateRange;
    findAll(userId: string, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, Income, {}, import("mongoose").DefaultSchemaOptions> & Income & Required<{
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
        topSource: {
            name: string;
            percentage: number;
        };
    }>;
    getSourceDistribution(userId: string, query: any): Promise<{
        source: any;
        amount: any;
        percentage: number;
    }[]>;
    create(userId: string, createIncomeDto: CreateIncomeDto): Promise<import("mongoose").Document<unknown, {}, Income, {}, import("mongoose").DefaultSchemaOptions> & Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(userId: string, id: string, updateIncomeDto: UpdateIncomeDto): Promise<(import("mongoose").Document<unknown, {}, Income, {}, import("mongoose").DefaultSchemaOptions> & Income & Required<{
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
