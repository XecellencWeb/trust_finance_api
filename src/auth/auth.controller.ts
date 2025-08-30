import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    async registerUser(
        @Body() createUserDto:CreateUserDto
    ){
      return this.authService.createNewUser(createUserDto)
    }

    @Post('login')
    async loginUser(
        @Body() loginUserDto: LoginUserDto
    ){
     return this.authService.loginUser(loginUserDto)
    }

}
