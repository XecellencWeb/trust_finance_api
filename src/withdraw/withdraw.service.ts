import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Withdraw,
  WithdrawDocument,
  WithdrawStatus,
} from './schemas/withdraw.schema';
import { CreateWithdrawDto } from './dtos/withdraw.dto';

@Injectable()
export class WithdrawService {
  constructor(
    @InjectModel(Withdraw.name) private withdrawModel: Model<WithdrawDocument>,
  ) {}

  async create(
    createWithdrawDto: CreateWithdrawDto & { userId: Types.ObjectId },
  ): Promise<Withdraw> {
    const withdraw = new this.withdrawModel(createWithdrawDto);
    return withdraw.save();
  }

  async findAll(): Promise<Withdraw[]> {
    return this.withdrawModel.find().exec();
  }

  async findUserWithdraws(userId: Types.ObjectId): Promise<Withdraw[]> {
    return this.withdrawModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .exec();
  }

  async findOne(id: string): Promise<Withdraw> {
    const withdraw = await this.withdrawModel.findById(id).exec();
    if (!withdraw) throw new NotFoundException('Withdraw request not found');
    return withdraw;
  }

  async updateStatus(id: string, status: WithdrawStatus): Promise<Withdraw> {
    const withdraw = await this.withdrawModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!withdraw) throw new NotFoundException('Withdraw request not found');
    return withdraw;
  }

  async remove(id: string): Promise<void> {
    const result = await this.withdrawModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Withdraw request not found');
  }
}
