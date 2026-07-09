import { BudgetService } from './budget.service';
import { SetBudgetDto } from './dto/set-budget.dto';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    getBudgets(req: any, query: any): Promise<{
        _id: any;
        userId: any;
        category: any;
        limit: any;
        month: any;
        spent: any;
    }[]>;
    setBudget(req: any, setBudgetDto: SetBudgetDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/budget.schema").Budget, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/budget.schema").Budget & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteBudget(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
