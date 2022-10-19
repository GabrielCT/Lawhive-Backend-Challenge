import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as config from 'config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GoogleController } from './authentication/google.controller';
import { GoogleService } from './authentication/google.service';
import { GoogleStrategy } from './authentication/google.strategy';
import { JwtAuthGuard } from './authentication/jwt.authguard';
import { JwtStrategy } from './authentication/jwt.strategy';

import { PostingSchema } from './postings/posting.schema';
import { PostingsController } from './postings/postings.controller';
import { PostingsService } from './postings/postings.service';

// TODO: split app.module into app.module + authentication.module + postings.module

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Posting', schema: PostingSchema }],
      'postings',
    ),
    // TODO: throw an error and refuse to start up if config.has(...) is not true
    // TODO: wrap config with configService? probably the nestjs way
    MongooseModule.forRoot(config.get('mongodb'), {
      connectionName: 'postings',
      dbName: 'postings',
    }),
  ],
  controllers: [AppController, GoogleController, PostingsController],
  providers: [
    AppService,
    GoogleService,
    PostingsService,
    GoogleStrategy,
    JwtService,
    JwtAuthGuard,
    JwtStrategy,
  ],
})
export class AppModule {}
