import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class BankingSystemService {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  //transfer money
  async transferMoney({
    amount,
    fromUserId,
    toUserId,
    notes = '',
  }: {
    amount: number;
    fromUserId: Types.ObjectId;
    toUserId: Types.ObjectId;
    notes: string;
  }) {
    const fromUser = await this.userService.findById(fromUserId.toString());
    const toUser = await this.userService.findById(toUserId.toString());

    if (!fromUser || !toUser) {
      throw new NotFoundException(
        'Transfer must be made only between two users in the platform.',
      );
    }

    await this.walletService.updateWallet({
      amount: -1 * amount,
      userId: fromUserId,
      transactionDescription: `Made transfer to ${toUser.firstName} with notes ${notes}`,
    });

    await this.walletService.updateWallet({
      amount,
      userId: toUserId,
      transactionDescription: `Transfer from ${fromUser.firstName} with notes ${notes}`,
    });

    return 'Transfer Successfull';
  }
}
