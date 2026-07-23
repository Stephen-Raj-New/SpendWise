import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProfile(req: any, updateDto: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    uploadAvatar(req: any, file: Express.Multer.File): Promise<{
        avatarUrl: string | undefined;
    }>;
    removeAvatar(req: any): Promise<{
        success: boolean;
    }>;
    updatePreferences(req: any, updateDto: any): Promise<Record<string, any> | undefined>;
    updatePassword(req: any, updateDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    toggle2fa(req: any, enabled: boolean): Promise<{
        twoFactorEnabled: boolean | undefined;
    }>;
    deactivateAccount(req: any, password: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
