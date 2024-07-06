import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { JwtPayload } from '../dto/JwtPayload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log('hello');
          let token = null;
          if (request && request.cookies) {
            console.log('hello2');
            console.log(request.cookies);
            token = request.cookies['Authorization'];
            console.log(token);
            if (token) {
              token = token.replace('Bearer ', '');
            }
          }
          return token;
        },
      ]),
      ignoerExpiration: false,
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser({ ...payload });
    console.log('hello');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
