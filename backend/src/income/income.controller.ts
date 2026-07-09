import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, Request, Res } from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('user/income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    const userId = req.user?.sub || req.user?.userId;
    return this.incomeService.findAll(String(userId), query);
  }

  @Get('summary')
  getSummary(@Request() req: any, @Query('range') range: string = 'month') {
    const userId = req.user?.sub || req.user?.userId;
    return this.incomeService.getSummary(String(userId), range);
  }

  @Get('source-distribution')
  getSourceDistribution(@Request() req: any, @Query('range') range: string = 'month') {
    const userId = req.user?.sub || req.user?.userId;
    return this.incomeService.getSourceDistribution(String(userId), range);
  }

  @Get('export')
  async exportCsv(@Request() req: any, @Query() query: any, @Res() res: Response) {
    const userId = req.user?.sub || req.user?.userId;
    const csvData = await this.incomeService.exportCsv(String(userId), query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=income-export.csv');
    res.status(200).send(csvData);
  }

  @Post()
  create(@Request() req: any, @Body() createIncomeDto: CreateIncomeDto) {
    const userId = req.user?.sub || req.user?.userId;
    return this.incomeService.create(String(userId), createIncomeDto);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    const userId = req.user?.sub || req.user?.userId;
    return this.incomeService.update(String(userId), id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.sub || req.user?.userId;
    return this.incomeService.remove(String(userId), id);
  }
}
