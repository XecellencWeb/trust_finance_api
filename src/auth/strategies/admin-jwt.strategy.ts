import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? '',
    });
  }

  async validate(payload: { userId: string }): Promise<UserDocument> {
    const user = await this.userService.findById(payload.userId);
    if (!user)
      throw new UnauthorizedException(
        'You are not authorized to view this route.',
      );

    if (!user.isAdmin)
      throw new UnauthorizedException('Only admins can access this route');

    return user;
  }
}
