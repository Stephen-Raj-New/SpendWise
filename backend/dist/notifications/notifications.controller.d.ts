import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/notification.schema").Notification & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        unreadCount: number;
    }>;
    getGroupedNotifications(req: any): Promise<{
        data: Record<string, any[]>;
        unreadCount: number;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
    markAsRead(req: any, id: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteNotification(req: any, id: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
