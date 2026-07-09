import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Budget, BudgetSchema } from '../schemas/budget.schema';
import { Expense, ExpenseSchema } from '../schemas/expense.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Budget.name, schema: BudgetSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    AuthModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
