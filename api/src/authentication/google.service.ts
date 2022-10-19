import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as config from 'config';

@Injectable()
export class GoogleService {
  constructor(private jwtService: JwtService) {}

  generateJwt(payload) {
    // TODO: throw an error and refuse to start up if config.has(...) is not true
    // TODO: wrap config with configService? probably the nestjs way
    return this.jwtService.sign(payload, {
      secret: config.get('jwtSecret'),
    });
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    // TODO: check if the user exists in our db
    // if they do, generate Jwt
    // if they don't, register them in the db first

    return this.generateJwt({
      email: user.email,
    });
  }

  googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
