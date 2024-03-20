import { Controller, Get, Post, Render, UseGuards, Request} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService, // config .env
    private authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    handleLogin(@Request() req){
      return this.authService.login(req.user)
    }

}
