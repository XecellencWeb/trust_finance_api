import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CryptoDepositsStatus {
  pending = 'Pending',
  confirmed = 'Confirmed',
  failed = 'Failed'
}

export type CryptoDepositsDocument = CryptoDeposits &
  Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class CryptoDeposits {

    @Prop({required:true})
    userId:Types.ObjectId

    @Prop({required:true})
    amountInCrypto: number

    @Prop({required:true})
    amountInUSD: number

    @Prop({required:true})
    cryptoWalletName: string

    @Prop({required:true})
    cryptoWalletSymbol: string


    @Prop({default:CryptoDepositsStatus.pending, enum: Object.values(CryptoDepositsStatus)})
    status: CryptoDepositsStatus


}

export const CryptoDepositsSchema = SchemaFactory.createForClass(CryptoDeposits)
