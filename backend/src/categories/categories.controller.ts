import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('user/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(@Request() req: any, @Query('type') type?: string) {
    const userId = req.user?.sub || req.user?.userId;
    return this.categoriesService.getCategories(String(userId), type);
  }

  @Post()
  async createCategory(@Request() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    const userId = req.user?.sub || req.user?.userId;
    return this.categoriesService.createCategory(String(userId), createCategoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.sub || req.user?.userId;
    return this.categoriesService.deleteCategory(String(userId), id);
  }
}
