import { BudgetService } from './budget.service';
import { SetBudgetDto } from './dto/set-budget.dto';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    getBudgets(req: any, month: string): Promise<(import("../schemas/budget.schema").Budget & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
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
