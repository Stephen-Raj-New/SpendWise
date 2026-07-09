import { Model, Types } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<Category>);
    getCategories(userId: string, type?: string): Promise<(import("mongoose").Document<unknown, {}, Category, {}, import("mongoose").DefaultSchemaOptions> & Category & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createCategory(userId: string, dto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, Category, {}, import("mongoose").DefaultSchemaOptions> & Category & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteCategory(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
