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
    return this.incomeService.findAll(req.user.id, query);
  }

  @Get('summary')
  getSummary(@Request() req: any, @Query('range') range: string = 'month') {
    return this.incomeService.getSummary(req.user.id, range);
  }

  @Get('source-distribution')
  getSourceDistribution(@Request() req: any, @Query('range') range: string = 'month') {
    return this.incomeService.getSourceDistribution(req.user.id, range);
  }

  @Get('export')
  async exportCsv(@Request() req: any, @Query() query: any, @Res() res: Response) {
    const csvData = await this.incomeService.exportCsv(req.user.id, query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=income-export.csv');
    res.status(200).send(csvData);
  }

  @Post()
  create(@Request() req: any, @Body() createIncomeDto: CreateIncomeDto) {
    return this.incomeService.create(req.user.id, createIncomeDto);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.update(req.user.id, id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.incomeService.remove(req.user.id, id);
  }
}
