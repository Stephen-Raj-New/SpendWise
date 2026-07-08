import { Document, Types } from 'mongoose';
export declare class Budget extends Document {
    userId: Types.ObjectId;
    category: string;
    limit: number;
    spent: number;
    month: string;
}
export declare const BudgetSchema: import("mongoose").Schema<Budget, import("mongoose").Model<Budget, any, any, any, any, any, Budget>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Budget, Document<unknown, {}, Budget, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    limit?: import("mongoose").SchemaDefinitionProperty<number, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    month?: import("mongoose").SchemaDefinitionProperty<string, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    spent?: import("mongoose").SchemaDefinitionProperty<number, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Budget>;
