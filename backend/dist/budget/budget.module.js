"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const budget_controller_1 = require("./budget.controller");
const budget_service_1 = require("./budget.service");
const budget_schema_1 = require("../schemas/budget.schema");
const expense_schema_1 = require("../schemas/expense.schema");
const auth_module_1 = require("../auth/auth.module");
let BudgetModule = class BudgetModule {
};
exports.BudgetModule = BudgetModule;
exports.BudgetModule = BudgetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: budget_schema_1.Budget.name, schema: budget_schema_1.BudgetSchema },
                { name: expense_schema_1.Expense.name, schema: expense_schema_1.ExpenseSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [budget_controller_1.BudgetController],
        providers: [budget_service_1.BudgetService],
        exports: [budget_service_1.BudgetService],
    })
], BudgetModule);
//# sourceMappingURL=budget.module.js.map