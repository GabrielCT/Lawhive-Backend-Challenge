import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../authentication/jwt.authguard';
import { PostingsService } from './postings.service';
import { CreatePostingDto, GetPostingsDto } from './postings.types';
import { Posting } from './posting.schema';

@Controller('postings')
export class PostingsController {
  constructor(private postingsService: PostingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body() createPostingDto: CreatePostingDto,
  ): Promise<Posting> {
    // req.user.email should be populated due to the JwtAuthGuard, but a
    // TODO: would be to add a specific check for that in the guard
    return this.postingsService.create(createPostingDto, req.user.email);
  }

  @Get('count')
  async count(): Promise<number> {
    return this.postingsService.count();
  }

  @Get()
  async find(@Body() getPostingsDto: GetPostingsDto): Promise<Posting[]> {
    return this.postingsService.find(getPostingsDto);
  }
}
