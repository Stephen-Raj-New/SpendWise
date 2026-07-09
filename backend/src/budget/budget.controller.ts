import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetBudgetDto } from './dto/set-budget.dto';

@Controller('user/budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async getBudgets(@Request() req: any, @Query('month') month: string) {
    const currentMonth = month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const userId = req.user?.sub || req.user?.userId;
    return this.budgetService.getBudgets(String(userId), currentMonth);
  }

  @Post()
  async setBudget(@Request() req: any, @Body() setBudgetDto: SetBudgetDto) {
    const userId = req.user?.sub || req.user?.userId;
    return this.budgetService.setBudget(String(userId), setBudgetDto);
  }

  @Delete(':id')
  async deleteBudget(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.sub || req.user?.userId;
    return this.budgetService.deleteBudget(String(userId), id);
  }
}
