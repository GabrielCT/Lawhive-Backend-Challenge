import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Posting, PostingDocument } from './posting.schema';
import {
  CreatePostingDto,
  GetPostingsDto,
  PayPostingDto,
} from './postings.types';

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

  async pay(payPostingDto: PayPostingDto): Promise<Posting> {
    const job = await this.postingModel.findById(payPostingDto._id).exec();

    if (!job) {
      throw new BadRequestException('job posting _id does not exist');
    }

    if (job.paidOn) {
      throw new BadRequestException('job has already been paid');
    }

    if (job.feeStructure === 'Fixed-Fee') {
      const amountPaid = job.feeAmount;
      return this.postingModel.findByIdAndUpdate(payPostingDto._id, {
        amountPaid: amountPaid,
        paidOn: new Date(),
        status: 'paid',
      });
    } else if (job.feeStructure === 'No-Win-No-Fee') {
      if (!payPostingDto.settlementAmount) {
        throw new BadRequestException(
          'No-Win-No-Fee jobs require settlementAmount in the payment submission',
        );
      }
      // ticket should have specified how to round this (whole number, round up, 2dp, etc), leaving as is for now
      // should also not really use floats..
      const amountPaid = job.feePercentage * job.settlementAmount;
      return this.postingModel.findByIdAndUpdate(payPostingDto._id, {
        amountPaid: amountPaid,
        paidOn: new Date(),
        status: 'paid',
        settlementAmount: payPostingDto.settlementAmount,
      });
    } else {
      // reachable when db has bad data
      // need to throw internal server error due to bad data
      throw new InternalServerErrorException('invalid job fee structure');
    }
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
