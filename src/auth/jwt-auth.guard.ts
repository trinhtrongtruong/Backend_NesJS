// middle check xem có sử dụng jwt.strategy.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
      }    
      canActivate(context: ExecutionContext) { // lấy value dự vào key, return true => JwtAuthGuard run next
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [ 
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        return super.canActivate(context);//check jwt
      }
    
      handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw err || new UnauthorizedException("Token không hợp lệ");
        }
        return user;
      }
}
