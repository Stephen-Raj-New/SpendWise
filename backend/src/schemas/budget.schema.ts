import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Budget extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  limit: number;

  @Prop({ default: 0 })
  spent: number;

  @Prop({ required: true })
  month: string; // e.g. "2026-07"
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
