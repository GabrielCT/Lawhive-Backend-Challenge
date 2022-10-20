import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GoogleController } from './authentication/google.controller';
import { GoogleService } from './authentication/google.service';
import { GoogleStrategy } from './authentication/google.strategy';
import { JwtAuthGuard } from './authentication/jwt.authguard';
import { JwtStrategy } from './authentication/jwt.strategy';

import { PostingsModule } from './postings/postings.module';

// TODO: split app.module into app.module + authentication.module + postings.module

@Module({
  imports: [PostingsModule],
  controllers: [AppController, GoogleController],
  providers: [
    AppService,
    GoogleService,
    GoogleStrategy,
    JwtService,
    JwtAuthGuard,
    JwtStrategy,
  ],
})
export class AppModule {}
