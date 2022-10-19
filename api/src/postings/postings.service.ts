import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Posting, PostingDocument } from './posting.schema';
import { CreatePostingDto, GetPostingsDto } from './postings.types';

@Injectable()
export class PostingsService {
  constructor(
    @InjectModel(Posting.name) private postingModel: Model<PostingDocument>,
  ) {}

  async create(
    createPostingDto: CreatePostingDto,
    posterEmail: string,
  ): Promise<Posting> {
    const createdPosting = new this.postingModel({
      ...createPostingDto,
      created: new Date(),
      posterEmail,
      status: 'unpaid',
    });
    return createdPosting.save();
  }

  async count(): Promise<number> {
    return this.postingModel.count();
  }

  async find(getPostingsDto: GetPostingsDto): Promise<Posting[]> {
    const findFilter: { clientEmail?: string; posterEmail?: string } = {};
    if (getPostingsDto.clientEmail) {
      findFilter.clientEmail = getPostingsDto.clientEmail;
    }
    if (getPostingsDto.posterEmail) {
      findFilter.posterEmail = getPostingsDto.posterEmail;
    }

    return this.postingModel
      .find(findFilter)
      .sort({ [getPostingsDto.sortBy]: getPostingsDto.sortOrder })
      .skip(getPostingsDto.offset)
      .limit(getPostingsDto.limit)
      .exec();
  }
}
