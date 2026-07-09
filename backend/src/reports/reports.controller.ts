import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  async getSummaryReport(@Request() req: any, @Query() query: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.reportsService.getSummaryReport(String(userId), query);
  }
}
