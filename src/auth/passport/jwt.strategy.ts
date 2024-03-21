//xử lý token , encode - decode => trả về thông tin user
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    super({ // Giải mã token băng cách decode Secret Key
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN"),
    });
  }

  async validate(payload: any) { // decode payload(user)
     return { 
        userId: payload.sub, 
        username: payload.username,
    };
  }
}