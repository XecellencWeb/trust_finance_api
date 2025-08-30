import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AccountStatus, User, UserDocument } from './schema/user.schema';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, username, password, confirmPassword } = createUserDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check for existing user
    const userExists = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) {
      throw new BadRequestException(
        'User with this email or username already exists',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { confirmPassword: _, ...otherData } = createUserDto;

    const newUser = await this.userModel.create({
      ...otherData,
      password: hashedPassword,
    });

    //create the wallet on the background so it does not throw any error related to wallet
    const wallet = await this.walletService.createUserWallet(newUser._id);

    await this.updateWalletOnUser(newUser._id, wallet._id);

    return newUser;
  }

  async updateWalletOnUser(userId: Types.ObjectId, walletId: Types.ObjectId) {
    return this.userModel.updateOne(
      { _id: userId, wallet: null },
      { wallet: walletId },
    );
  }

  async searchUsers(search: string): Promise<UserDocument[]> {
    const filter = { $regex: search, $options: 'i' };

    return this.userModel.find({
      $or: [
        { firstName: filter },
        { lastName: filter },
        { username: filter }, // optional
      ],
    });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Password entered is incorrect.');
    }

    return user;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 10,
    userId,
  }: {
    search: string;
    page: number;
    limit: number;
    userId: string;
  }): Promise<{
    data: User[];
    page: number;
    limit: number;
    totalPage: number;
    total: number;
    hasPrev: boolean;
    hasNext: boolean;
  }> {
    const filter = { $regex: search, $options: 'i' };

    const filters: RootFilterQuery<User> = {
      _id: { $ne: userId },
      $or: [
        { firstName: filter },
        { lastName: filter },
        { username: filter }, // optional
      ],
    };

    const users = await this.userModel
      .find(filters)
      .populate('wallet')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.userModel.countDocuments(filters);

    const totalPage = Math.ceil(total / limit);

    return {
      data: users,
      total,
      page,
      limit,
      hasPrev: page > 1,
      hasNext: page < totalPage,
      totalPage,
    };
  }

  async updateUserAccountStatus(userId: string, status: AccountStatus) {
    return this.userModel.updateOne(
      { _id: userId },
      { accountStatus: status },
      { new: true },
    );
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException('User not found');
  }
}
