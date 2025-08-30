import {
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';
import { AccountStatus } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Get('search')
  async searchUsers(@Query('search') search: string) {
    return this.userService.searchUsers(search);
  }

  @UseGuards(AdminJwtGuard)
  @Get('all')
  async getAllUsers(
    @Query('search') search: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Req() req: any,
  ) {
    return this.userService.findAll({
      search,
      page,
      limit,
      userId: req.user._id,
    });
  }

  @UseGuards(AdminJwtGuard)
  @Patch('update-account/:userId/:status')
  async updateAccountStatus(
    @Param('userId') userId: string,
    @Param('status', new ParseEnumPipe(AccountStatus))
    accountStatus: AccountStatus,
  ) {
    return this.userService.updateUserAccountStatus(userId, accountStatus);
  }

  @UseGuards(AdminJwtGuard)
  @Delete('delete-account/:userId')
  async deleteAccount(@Param('userId') userId: string) {
    return this.userService.deleteById(userId);
  }
}
