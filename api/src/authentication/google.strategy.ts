import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as config from 'config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      // TODO: throw an error and refuse to start up if config.has(...) is not true
      // TODO: wrap config with configService? probably the nestjs way
      clientID: config.get('googleAuth.GOOGLE_CLIENT_ID'),
      clientSecret: config.get('googleAuth.GOOGLE_SECRET'),
      callbackURL: config.get('googleAuth.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
