import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @Inject(forwardRef(() => NotificationsGateway)) private notificationsGateway: NotificationsGateway
  ) {}

  async getNotifications(userId: string, query: any) {
    const uid = new Types.ObjectId(userId);
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { userId: uid };
    if (query.type) filter.type = query.type;
    if (query.isRead !== undefined) filter.isRead = query.isRead === 'true';

    const [data, total, unreadCount] = await Promise.all([
      this.notificationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.notificationModel.countDocuments(filter),
      this.notificationModel.countDocuments({ userId: uid, isRead: false }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount
    };
  }

  async getGroupedNotifications(userId: string) {
    const uid = new Types.ObjectId(userId);
    
    // Default limit per group
    const limitPerGroup = 5;
    
    // We can do an aggregation pipeline to group by type and get top N per type
    // Or just run 4 small queries since the types are fixed and few.
    const types = ['budget_alert', 'bill_reminder', 'income_received', 'expense_added', 'system_update'];
    const grouped: Record<string, any[]> = {};
    
    await Promise.all(types.map(async (type) => {
      const docs = await this.notificationModel
        .find({ userId: uid, type })
        .sort({ createdAt: -1 })
        .limit(limitPerGroup);
      grouped[type] = docs;
    }));
    
    const unreadCount = await this.notificationModel.countDocuments({ userId: uid, isRead: false });

    return {
      data: grouped,
      unreadCount
    };
  }

  async markAsRead(userId: string, id: string) {
    const uid = new Types.ObjectId(userId);
    return this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: uid },
      { $set: { isRead: true } },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    const uid = new Types.ObjectId(userId);
    await this.notificationModel.updateMany({ userId: uid, isRead: false }, { $set: { isRead: true } });
    return { success: true };
  }
  
  async deleteNotification(userId: string, id: string) {
    const uid = new Types.ObjectId(userId);
    return this.notificationModel.findOneAndDelete({ _id: new Types.ObjectId(id), userId: uid });
  }

  // Called internally by other services (e.g. IncomeService)
  async createNotification(userId: string, payload: { type: string; title: string; message: string; meta?: any; actions?: any[] }) {
    const uid = new Types.ObjectId(userId);
    const notification = new this.notificationModel({ 
      userId: uid, 
      ...payload
    });
    const saved = await notification.save();
    
    // Emit real-time update
    this.notificationsGateway.sendNotificationToUser(userId, saved);
    
    return saved;
  }

  // Stub for recurring bill reminders
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkUpcomingBills() {
    console.log('Running scheduled check for upcoming bills...');
    // In the future:
    // 1. Fetch recurring expenses due in the next 3 days
    // 2. For each, call this.createNotification(userId, { type: 'bill_reminder', ... })
  }
}
