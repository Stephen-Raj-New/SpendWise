import { Model, Types } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { Expense } from '../schemas/expense.schema';
import { SetBudgetDto } from './dto/set-budget.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class BudgetService {
    private budgetModel;
    private expenseModel;
    private notificationsService;
    constructor(budgetModel: Model<Budget>, expenseModel: Model<Expense>, notificationsService: NotificationsService);
    private getMonthRange;
    getBudgets(userId: string, query: any): Promise<{
        _id: any;
        userId: any;
        category: any;
        limit: any;
        month: any;
        spent: any;
    }[]>;
    setBudget(userId: string, dto: SetBudgetDto): Promise<import("mongoose").Document<unknown, {}, Budget, {}, import("mongoose").DefaultSchemaOptions> & Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteBudget(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
