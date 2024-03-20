import { Controller, Get, Post, Render, UseGuards, Request} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService, // config .env
    private authService: AuthService
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("/login")
    handleLogin(@Request() req){
      return this.authService.login(req.user)
    }

    
    // @UseGuards(JwtAuthGuard)
    @Public() // không xác thực jwt
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }

    @UseGuards(JwtAuthGuard) // xác thực jwt
    @Get('profile1')
    getProfile1(@Request() req) {
      return req.user;
    }
}
