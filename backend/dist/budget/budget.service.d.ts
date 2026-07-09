import { Model, Types } from 'mongoose';
import { Budget } from '../schemas/budget.schema';
import { Expense } from '../schemas/expense.schema';
import { SetBudgetDto } from './dto/set-budget.dto';
export declare class BudgetService {
    private budgetModel;
    private expenseModel;
    constructor(budgetModel: Model<Budget>, expenseModel: Model<Expense>);
    getBudgets(userId: string, month: string): Promise<(Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
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
