import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies && req.cookies['access_token']) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };
    super({
      // TODO: change to false for prod
      ignoreExpiration: true,
      // TODO: throw an error and refuse to start up if config.has(...) is not true
      // TODO: wrap config with configService? probably the nestjs way
      secretOrKey: config.get('jwtSecret'),
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: { email: string }) {
    // TODO: check if the user exists in our db
    if (!payload.email)
      throw new UnauthorizedException('Please log in to continue');

    return {
      email: payload.email,
    };
  }
}
