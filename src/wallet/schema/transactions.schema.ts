import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Wallet } from './wallet.schema';

@Schema({ timestamps: true })
export class WalletTransactions {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  isDebit: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: Wallet.name })
  walletId: Types.ObjectId;

  @Prop({ required: true })
  transactionDescription: string;

  @Prop({ type: Types.ObjectId })
  depositId: Types.ObjectId;
}

export const WalletTransactionsSchema =
  SchemaFactory.createForClass(WalletTransactions);
