import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private notificationModel;
    private notificationsGateway;
    constructor(notificationModel: Model<Notification>, notificationsGateway: NotificationsGateway);
    getNotifications(userId: string, query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
            _id: Types.ObjectId;
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
    getGroupedNotifications(userId: string): Promise<{
        data: Record<string, any[]>;
        unreadCount: number;
    }>;
    markAsRead(userId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    deleteNotification(userId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createNotification(userId: string, payload: {
        type: string;
        title: string;
        message: string;
        meta?: any;
        actions?: any[];
    }): Promise<import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    checkUpcomingBills(): Promise<void>;
}
