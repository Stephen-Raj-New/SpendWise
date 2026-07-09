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
    return this.categoriesService.getCategories(req.user.userId, type);
  }

  @Post()
  async createCategory(@Request() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(req.user.userId, createCategoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Request() req: any, @Param('id') id: string) {
    return this.categoriesService.deleteCategory(req.user.userId, id);
  }
}
