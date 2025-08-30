import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ){}



    async createNewUser(createUserDto:CreateUserDto){
        const user = await this.userService.create(createUserDto)

        const token = this.jwtService.sign({
            userId: user._id
        })

        return {token}
    }


    async loginUser(loginUserDto:LoginUserDto){
        const user = await this.userService.loginUser(loginUserDto)

        const token =  this.jwtService.sign({
            userId: user._id
        })

        return {token}
    }
}
