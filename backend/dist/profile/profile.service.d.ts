import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
export declare class ProfileService {
    private userModel;
    constructor(userModel: Model<User>);
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProfile(userId: string, updateDto: any): Promise<import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<{
        avatarUrl: string | undefined;
    }>;
    removeAvatar(userId: string): Promise<{
        success: boolean;
    }>;
    updatePreferences(userId: string, updateDto: any): Promise<Record<string, any> | undefined>;
    updatePassword(userId: string, updateDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    toggle2fa(userId: string, enabled: boolean): Promise<{
        twoFactorEnabled: boolean | undefined;
    }>;
    deactivateAccount(userId: string, password: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
