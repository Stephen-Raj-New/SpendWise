import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Income, IncomeSchema } from '../schemas/income.schema';
import { Expense, ExpenseSchema } from '../schemas/expense.schema';
import { Budget, BudgetSchema } from '../schemas/budget.schema';
import { Category, CategorySchema } from '../schemas/category.schema';

import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Income.name, schema: IncomeSchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
