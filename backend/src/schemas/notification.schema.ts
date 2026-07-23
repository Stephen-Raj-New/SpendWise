import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['budget_alert', 'bill_reminder', 'income_received', 'expense_added', 'system_update'] })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  meta: Record<string, any>;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({
    type: [{
      label: { type: String, required: true },
      actionType: { type: String, required: true },
      payload: { type: MongooseSchema.Types.Mixed, required: true }
    }],
    default: []
  })
  actions: Array<{ label: string; actionType: string; payload: any }>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
