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
}

export const UserSchema = SchemaFactory.createForClass(User);
