import { forwardRef, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import {
  WalletTransactions,
  WalletTransactionsSchema,
} from './schema/transactions.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletTransactions.name, schema: WalletTransactionsSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
