import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true, default: 'INR' })
  preferredCurrency: string;

  @Prop({ required: true, default: 'UTC' })
  timeZone: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiresAt?: Date;

  @Prop()
  jobTitle?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({
    type: {
      defaultCurrency: { type: String, default: 'INR' },
      displayLanguage: { type: String, default: 'en' },
      emailNotifications: {
        weeklyExpenseSummary: { type: Boolean, default: true },
        budgetThresholdAlerts: { type: Boolean, default: true }
      }
    },
    default: () => ({
      defaultCurrency: 'INR',
      displayLanguage: 'en',
      emailNotifications: { weeklyExpenseSummary: true, budgetThresholdAlerts: true }
    })
  })
  preferences: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  twoFactorEnabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
