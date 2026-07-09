import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Income extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  source: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ enum: ['Confirmed', 'Processing', 'Failed'], default: 'Confirmed' })
  status: string;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);
