
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt"
import { UserDocument } from "src/user/schema/user.schema";
import { UserService } from "src/user/user.service";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private readonly userService: UserService){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET ?? ''
    })
  }

  async validate(payload:{userId:string}):Promise<UserDocument>  {
    
    const user =  this.userService.findById(payload.userId)
    if(!user){
        throw new UnauthorizedException("You are not authorized to view this route.")
    }

    return user
  }
}