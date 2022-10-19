import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

import { PostingSchema } from './posting.schema';
import { PostingsController } from './postings.controller';
import { PostingsService } from './postings.service';

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
  controllers: [PostingsController],
  providers: [PostingsService],
})
export class PostingsModule {}
