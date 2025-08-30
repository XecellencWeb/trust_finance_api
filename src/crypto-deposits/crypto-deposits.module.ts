import { Module } from '@nestjs/common';
import { CryptoDepositsService } from './crypto-deposits.service';
import { CryptoDepositsController } from './crypto-deposits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CryptoDeposits,
  CryptoDepositsSchema,
} from './schema/crypto-deposits.schema';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CryptoDeposits.name, schema: CryptoDepositsSchema },
    ]),
    WalletModule
  ],
  providers: [CryptoDepositsService],
  controllers: [CryptoDepositsController],
  exports: [CryptoDepositsService],
})
export class CryptoDepositsModule {}
