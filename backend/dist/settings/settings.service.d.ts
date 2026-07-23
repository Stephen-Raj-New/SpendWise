import { Model, Types } from 'mongoose';
import { Settings } from '../schemas/settings.schema';
import { User } from '../schemas/user.schema';
export declare class SettingsService {
    private settingsModel;
    private userModel;
    constructor(settingsModel: Model<Settings>, userModel: Model<User>);
    getSettings(userId: string): Promise<import("mongoose").Document<unknown, {}, Settings, {}, import("mongoose").DefaultSchemaOptions> & Settings & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateSettings(userId: string, updateDto: any): Promise<import("mongoose").Document<unknown, {}, Settings, {}, import("mongoose").DefaultSchemaOptions> & Settings & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    backupNow(userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            timestamp: string;
            user: (import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }) | null;
            settings: (import("mongoose").Document<unknown, {}, Settings, {}, import("mongoose").DefaultSchemaOptions> & Settings & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }) | null;
        };
    }>;
    revokeSessions(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
