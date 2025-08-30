import { Module } from '@nestjs/common';
import { BankingSystemService } from './banking-system.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { UserModule } from 'src/user/user.module';
import { BankingSystemController } from './banking-system.controller';

@Module({
  imports:[WalletModule, UserModule],
  providers: [BankingSystemService],
  controllers: [BankingSystemController]
})
export class BankingSystemModule {}
