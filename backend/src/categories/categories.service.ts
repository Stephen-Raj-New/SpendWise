import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getCategories(userId: string, type?: string) {
    const uid = new Types.ObjectId(userId);
    const filter: any = { userId: uid };
    if (type) {
      filter.type = type;
    }
    return this.categoryModel.find(filter).sort({ name: 1 });
  }

  async createCategory(userId: string, dto: CreateCategoryDto) {
    const uid = new Types.ObjectId(userId);
    const category = new this.categoryModel({ ...dto, userId: uid });
    return category.save();
  }

  async deleteCategory(userId: string, id: string) {
    const uid = new Types.ObjectId(userId);
    const result = await this.categoryModel.findOneAndDelete({ _id: new Types.ObjectId(id), userId: uid });
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return { success: true };
  }
}
