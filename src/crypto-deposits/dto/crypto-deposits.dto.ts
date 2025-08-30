import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsString,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCryptoDepositDto {
  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  amountInCrypto: number;

  @IsNumber()
  @IsNotEmpty()
  amountInUSD: number;

  @IsString()
  @IsNotEmpty()
  cryptoWalletName: string;

  @IsString()
  @IsNotEmpty()
  cryptoWalletSymbol: string;
}
