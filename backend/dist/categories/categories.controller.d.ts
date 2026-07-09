import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategories(req: any, type?: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createCategory(req: any, createCategoryDto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteCategory(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
