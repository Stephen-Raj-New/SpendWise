import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, Request, Res } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('user/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.expensesService.findAll(String(userId), query);
  }

  @Get('summary')
  getSummary(@Request() req: any, @Query() query: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.expensesService.getSummary(String(userId), query);
  }

  @Get('category-distribution')
  getCategoryDistribution(@Request() req: any, @Query() query: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.expensesService.getCategoryDistribution(String(userId), query);
  }

  @Get('export')
  async exportCsv(@Request() req: any, @Query() query: any, @Res() res: Response) {
    const userId = req.user?.sub || req.user?.userId;
    const csvData = await this.expensesService.exportCsv(String(userId), query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses-export.csv');
    res.status(200).send(csvData);
  }

  @Post()
  create(@Request() req: any, @Body() createExpenseDto: CreateExpenseDto) {
    const userId = req.user?.sub || req.user?.userId;
    return this.expensesService.create(String(userId), createExpenseDto);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    const userId = req.user?.sub || req.user?.userId;
    return this.expensesService.update(String(userId), id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.sub || req.user?.userId;
    return this.expensesService.remove(String(userId), id);
  }
}
