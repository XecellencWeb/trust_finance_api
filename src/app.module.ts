import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { BankingSystemModule } from './banking-system/banking-system.module';
import { AdminConfigurationModule } from './admin-configuration/admin-configuration.module';
import { CryptoDepositsModule } from './crypto-deposits/crypto-deposits.module';

@Module({

  imports: [
    ConfigModule.forRoot({isGlobal:true}), 
    MongooseModule.forRoot(process.env.DB_URL ?? ''), 
    AuthModule, UserModule, WalletModule, 
    BankingSystemModule, AdminConfigurationModule, 
    CryptoDepositsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
