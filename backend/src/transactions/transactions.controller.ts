import { Controller, Get, Query, UseGuards, Request, Res } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('user/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.transactionsService.findAll(String(userId), query);
  }

  @Get('export')
  async exportCsv(@Request() req: any, @Query() query: any, @Res() res: Response) {
    const userId = req.user?.sub || req.user?.userId;
    const csvData = await this.transactionsService.exportCsv(String(userId), query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions-export.csv');
    res.status(200).send(csvData);
  }
}
