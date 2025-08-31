import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum WithdrawStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export type WithdrawDocument = Withdraw & Document;

@Schema({ timestamps: true })
export class Withdraw {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  accountHolder: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  routingNumber: string;

  @Prop({ required: true, enum: ['checking', 'savings', 'business'] })
  accountType: string;

  @Prop()
  notes?: string;

  @Prop({ default: WithdrawStatus.pending, enum: WithdrawStatus })
  status: WithdrawStatus;
}

export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);
