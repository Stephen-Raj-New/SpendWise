import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/settings.schema").Settings, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/settings.schema").Settings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateSettings(req: any, updateDto: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/settings.schema").Settings, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/settings.schema").Settings & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    backupNow(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            timestamp: string;
            user: (import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema").User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }) | null;
            settings: (import("mongoose").Document<unknown, {}, import("../schemas/settings.schema").Settings, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/settings.schema").Settings & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }) | null;
        };
    }>;
    revokeSessions(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
