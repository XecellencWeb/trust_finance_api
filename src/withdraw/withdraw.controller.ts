import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseEnumPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dtos/withdraw.dto';
import { WithdrawStatus } from './schemas/withdraw.schema';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Types } from 'mongoose';

@UseGuards(JwtGuard)
@Controller('withdraws')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto, @Req() req: any) {
    return this.withdrawService.create({
      ...createWithdrawDto,
      userId: new Types.ObjectId(req.user._id),
    });
  }

  @Get()
  findAll() {
    return this.withdrawService.findAll();
  }

  @Get('for-user')
  findForUser(@Req() req: any) {
    return this.withdrawService.findUserWithdraws(
      new Types.ObjectId(req.user._id),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawService.findOne(id);
  }

  @Patch(':id/:status')
  updateStatus(
    @Param('id') id: string,
    @Param('status', new ParseEnumPipe(WithdrawStatus)) status: WithdrawStatus,
  ) {
    return this.withdrawService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawService.remove(id);
  }
}
