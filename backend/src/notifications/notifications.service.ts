import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async getNotifications(userId: string) {
    const uid = new Types.ObjectId(userId);
    return this.notificationModel.find({ userId: uid }).sort({ createdAt: -1 }).limit(50);
  }

  async markAsRead(userId: string, id: string) {
    const uid = new Types.ObjectId(userId);
    return this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: uid },
      { $set: { read: true } },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    const uid = new Types.ObjectId(userId);
    await this.notificationModel.updateMany({ userId: uid, read: false }, { $set: { read: true } });
    return { success: true };
  }

  // Called internally by other services (e.g. BudgetService when budget exceeded)
  async createNotification(userId: string, title: string, message: string, type: string) {
    const uid = new Types.ObjectId(userId);
    const notification = new this.notificationModel({ userId: uid, title, message, type });
    return notification.save();
  }
}
