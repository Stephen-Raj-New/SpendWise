import { Document, Types } from 'mongoose';
export declare class Income extends Document {
    userId: Types.ObjectId;
    source: string;
    description: string;
    category: string;
    amount: number;
    currency: string;
    date: Date;
    status: string;
}
export declare const IncomeSchema: import("mongoose").Schema<Income, import("mongoose").Model<Income, any, any, any, any, any, Income>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Income, Document<unknown, {}, Income, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Income, Document<unknown, {}, Income, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Income & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Income>;
