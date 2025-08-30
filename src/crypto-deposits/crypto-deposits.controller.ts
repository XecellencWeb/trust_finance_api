import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CryptoDepositsService } from './crypto-deposits.service';
import { CreateCryptoDepositDto } from './dto/crypto-deposits.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserDocument } from 'src/user/schema/user.schema';
import { Request } from 'express';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { CryptoDepositsStatus } from './schema/crypto-deposits.schema';
import { Types } from 'mongoose';
import { CheckSuspended } from 'src/custom-decorators/check-suspension';

@Controller('crypto-deposits')
export class CryptoDepositsController {
  constructor(private readonly cryptoDepositsService: CryptoDepositsService) {}

  @UseGuards(AdminJwtGuard)
  @Get('latest')
  async getLatestDeposits() {
    return this.cryptoDepositsService.getLatestDeposits();
  }

  @UseGuards(JwtGuard)
  @CheckSuspended()
  @Post()
  async makeCryptoDeposits(
    @Body() createCryptoDepositDto: CreateCryptoDepositDto,
    @Req() req: Request,
  ) {
    return this.cryptoDepositsService.makeCryptoDeposits({
      ...createCryptoDepositDto,
      userId: (req.user as UserDocument)._id,
    });
  }

  @UseGuards(AdminJwtGuard)
  @Patch('update-status/:depositId')
  async updateStatus(
    @Param('depositId') depositId: string,
    @Body('status', new ParseEnumPipe(CryptoDepositsStatus))
    status: CryptoDepositsStatus,
  ) {
    return this.cryptoDepositsService.updateCryptoDeposits(
      new Types.ObjectId(depositId),
      status,
    );
  }
}
