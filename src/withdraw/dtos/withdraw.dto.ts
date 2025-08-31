import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateWithdrawDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  accountHolder: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  routingNumber: string;

  @IsString()
  @IsIn(['checking', 'savings', 'business'])
  accountType: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
