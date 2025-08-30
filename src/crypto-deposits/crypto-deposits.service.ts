import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  CryptoDeposits,
  CryptoDepositsStatus,
} from './schema/crypto-deposits.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCryptoDepositDto } from './dto/crypto-deposits.dto';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class CryptoDepositsService {
  constructor(
    @InjectModel(CryptoDeposits.name)
    private readonly cryptoDepositsModel: Model<CryptoDeposits>,
    private readonly walletService: WalletService,
  ) {}

  makeCryptoDeposits(createCryptoDepositDto: CreateCryptoDepositDto) {
    if (createCryptoDepositDto.amountInUSD < 0) {
      throw new BadRequestException('Invalid amount entered');
    }
    return this.cryptoDepositsModel.create(createCryptoDepositDto);
  }

  async updateCryptoDeposits(
    depositId: Types.ObjectId,
    status: CryptoDepositsStatus,
  ) {
    const deposit = await this.cryptoDepositsModel.findByIdAndUpdate(
      depositId,
      { status },
    );

    if (!deposit)
      throw new NotFoundException('No deposits with this Id found.');

    if (
      status === CryptoDepositsStatus.confirmed &&
      deposit.status !== CryptoDepositsStatus.confirmed
    ) {
      await this.walletService.updateWallet({
        amount: deposit.amountInUSD,
        userId: deposit.userId,
        transactionDescription: 'Funded account by funding bitcoin wallet.',
        depositId
      });
    }

    return 'Wallet updated Successfully';
  }

  async getLatestDeposits() {
    return this.cryptoDepositsModel.find().sort({ createdAt: -1 }).limit(50);
  }
}
