import { RegisterUserDto } from './../users/dto/create-user.dto';
import { Controller, Get, Post, Render, UseGuards, Body, Res, Req} from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';


@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ResponseMessage("User Login")
    handleLogin(
      @Req() req, 
      @Res({ passthrough: true }) response: Response){
      return this.authService.login(req.user, response);
    }

    
    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto){
      return this.authService.register(registerUserDto);
    }

    @Get('/account')
    @ResponseMessage("Get User information")
    handleAccount(@User() user: IUser){
      return { user };
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage("Get User by refresh token")
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response){
      const refreshToken = request.cookies["refresh_token"];
      return this.authService.processNewToken(refreshToken, response);
    }
}
