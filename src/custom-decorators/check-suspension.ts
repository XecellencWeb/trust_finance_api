import {
  applyDecorators,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { AccountStatus } from 'src/user/schema/user.schema';

class SuspensionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.user?.accountStatus == AccountStatus.suspended) {
      throw new BadRequestException(
        `Hi, your account has been suspended kindly contact support for more informations.`,
      );
    }

    return true;
  }
}

export function CheckSuspended() {
  return applyDecorators(UseGuards(SuspensionGuard));
}
