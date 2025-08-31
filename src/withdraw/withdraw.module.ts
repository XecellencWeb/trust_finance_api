import { Module } from '@nestjs/common';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdraw, WithdrawSchema } from './schemas/withdraw.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Withdraw.name, schema: WithdrawSchema },
    ]),
  ],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
