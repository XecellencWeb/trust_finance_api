import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ default: 0 })
  balance: number;

  @Prop({ required: true, ref: "User", type: Types.ObjectId })
  userId: Types.ObjectId;

  
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
