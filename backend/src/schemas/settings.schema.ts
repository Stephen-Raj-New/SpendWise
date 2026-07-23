import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Settings extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({
    type: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      compactMode: { type: Boolean, default: false }
    },
    default: () => ({ theme: 'light', compactMode: false })
  })
  appearance: { theme: string; compactMode: boolean };

  @Prop({
    type: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    default: () => ({ email: true, push: true, sms: false })
  })
  notifications: { email: boolean; push: boolean; sms: boolean };

  @Prop({
    type: {
      profileVisibility: { type: String, enum: ['internal_only', 'private'], default: 'internal_only' },
      twoFactorEnabled: { type: Boolean, default: false }
    },
    default: () => ({ profileVisibility: 'internal_only', twoFactorEnabled: false })
  })
  privacy: { profileVisibility: string; twoFactorEnabled: boolean };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
