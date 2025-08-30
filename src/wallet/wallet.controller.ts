import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { UserDocument } from 'src/user/schema/user.schema';
import { Types } from 'mongoose';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUserWallet(@Req() req: Request) {
    return this.walletService.getUserWallet((req.user as UserDocument)!._id);
  }

  @UseGuards(JwtGuard)
  @Get('transactions/:walletId')
  async getUserWalletTransactions(
    @Param('walletId') walletId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.walletService.getWalletTransactions(
      new Types.ObjectId(walletId),
      { page, limit },
    );
  }
}
