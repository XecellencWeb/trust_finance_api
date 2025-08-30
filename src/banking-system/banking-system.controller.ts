import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BankingSystemService } from './banking-system.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { Types } from 'mongoose';
import { UserDocument } from 'src/user/schema/user.schema';
import { CheckSuspended } from 'src/custom-decorators/check-suspension';

@Controller('banking-system')
export class BankingSystemController {
  constructor(private readonly bankingSystemService: BankingSystemService) {}

  @UseGuards(JwtGuard)
  @CheckSuspended()
  @Post('transfer')
  async makeTransfer(
    @Req() req: Request,
    @Body() transferData: { toUserId: string; amount: number; note: string },
  ) {
    return this.bankingSystemService.transferMoney({
      amount: transferData.amount,
      fromUserId: (req.user as UserDocument)._id,
      notes: transferData.note,
      toUserId: new Types.ObjectId(transferData.toUserId),
    });
  }
}
