import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './schema/wallet.schema';
import { Model, Types } from 'mongoose';
import { WalletTransactions } from './schema/transactions.schema';
import { FormatterUtil } from 'utils/formater';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
    @InjectModel(WalletTransactions.name)
    private readonly walletTransactionsModel: Model<WalletTransactions>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.updateAllNullUsersWallets();
  }

  private async updateAllNullUsersWallets() {
    const allWallets = await this.walletModel.find();

    for (const wallet of allWallets) {
      await this.userService.updateWalletOnUser(wallet.userId, wallet._id);
    }
  }

  private async createWalletTransaction({
    walletId,
    transactionDescription,
    amount,
    isDebit,
    depositId,
  }: {
    walletId: Types.ObjectId;
    transactionDescription: string;
    amount: number;
    isDebit: boolean;
    depositId?: Types.ObjectId;
  }) {
    await this.walletTransactionsModel.create({
      walletId,
      transactionDescription,
      amount: Math.abs(amount),
      isDebit,
      depositId,
    });
  }

  private async transactionAlreadyExist(depositId: Types.ObjectId) {
    return this.walletTransactionsModel.exists({ depositId });
  }

  async createUserWallet(userId: Types.ObjectId) {
    return this.walletModel.create({
      userId,
    });
  }

  async getUserWallet(userId: Types.ObjectId) {
    const wallet = await this.walletModel.findOne({ userId });

    if (!wallet) {
      return this.createUserWallet(userId);
    }

    return wallet;
  }

  async getWalletTransactions(
    walletId: Types.ObjectId,
    {
      page = 1,
      limit = 5,
    }: {
      page?: number;
      limit?: number;
    } = {},
  ) {
    const txts = await this.walletTransactionsModel
      .find({ walletId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.walletTransactionsModel.countDocuments({
      walletId,
    });

    return { txts, total };
  }

  async updateWallet({
    amount,
    userId,
    transactionDescription,
    depositId,
  }: {
    amount: number;
    transactionDescription: string;
    userId: Types.ObjectId;
    depositId?: Types.ObjectId;
  }) {
    if (depositId) {
      if (await this.transactionAlreadyExist(depositId))
        throw new BadRequestException(
          'A transaction for this deposit already exist.',
        );
    }
    const wallet = await this.walletModel.findOne({ userId });

    if (!wallet) {
      throw new NotFoundException('No wallet found for user.');
    }

    if (amount + wallet.balance < 0) {
      throw new BadRequestException(
        `You have insufficient balance to withdraw ${FormatterUtil.formatCurrency(amount)} from wallet.`,
      );
    }

    await wallet.updateOne({
      $inc: {
        balance: amount,
      },
    });

    const isDebit = amount < 0;

    await this.createWalletTransaction({
      amount,
      isDebit,
      transactionDescription,
      walletId: wallet._id,
      depositId,
    });
  }
}
