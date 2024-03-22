import { Controller, Get, Post, Render, UseGuards, Request} from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';


@Controller("auth")
export class AuthController {
  constructor(
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

    // @UseGuards(JwtAuthGuard) // xác thực jwt
    @Get('profile1')
    getProfile1(@Request() req) {
      return req.user;
    }
}
