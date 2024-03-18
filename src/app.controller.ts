import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService // config .env
    ) {}

  @Get()
  @Render("home")
  handleHomePage() {
    //port from .env
    console.log(">>> Check Port:",this.configService.get<string>("PORT"))
    const message = this.appService.getHello();
    return {message: message};
  }
}
