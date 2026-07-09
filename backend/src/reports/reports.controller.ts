import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  async getSummaryReport(@Request() req: any, @Query('year') year: string) {
    const reportYear = year ? parseInt(year, 10) : new Date().getFullYear();
    const userId = req.user?.sub || req.user?.userId;
    return this.reportsService.getSummaryReport(String(userId), reportYear);
  }
}
