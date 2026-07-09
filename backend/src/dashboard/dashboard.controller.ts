import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub?: string | number;
    userId?: string;
    email?: string;
    role?: string;
  };
}

@Controller('user/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(@Req() req: RequestWithUser, @Query() query: any) {
    const userId = String(req.user?.sub || req.user?.userId || '');
    return this.dashboardService.getSummary(userId, query);
  }

  @Get('income-vs-expense')
  async getIncomeVsExpense(@Req() req: RequestWithUser, @Query() query: any) {
    const userId = String(req.user?.sub || req.user?.userId || '');
    return this.dashboardService.getIncomeVsExpense(userId, query);
  }

  @Get('spending-by-category')
  async getSpendingByCategory(@Req() req: RequestWithUser, @Query() query: any) {
    const userId = String(req.user?.sub || req.user?.userId || '');
    return this.dashboardService.getSpendingByCategory(userId, query);
  }

  @Get('recent-transactions')
  async getRecentTransactions(@Req() req: RequestWithUser, @Query('page') page = 1, @Query('limit') limit = 5, @Query() query: any) {
    const userId = String(req.user?.sub || req.user?.userId || '');
    return this.dashboardService.getRecentTransactions(userId, Number(page), Number(limit), query);
  }

  @Get('budget-progress')
  async getBudgetProgress(@Req() req: RequestWithUser, @Query() query: any) {
    const userId = String(req.user?.sub || req.user?.userId || '');
    return this.dashboardService.getBudgetProgress(userId, query);
  }
}
