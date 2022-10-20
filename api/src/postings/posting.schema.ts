import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type PostingDocument = Posting & Document;

@Schema()
export class Posting {
  _id: ObjectId;
  @Prop({ required: false, type: Number })
  __v?: ObjectId; // not used anywhere, just needed for the e2e test to not show a fake type error

  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  clientEmail: string;
  @Prop({ required: true })
  posterEmail: string;

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true, enum: ['unpaid', 'paid'] })
  status: string;

  @Prop({ required: true, enum: ['Fixed-Fee', 'No-Win-No-Fee'] })
  feeStructure: string;

  @Prop({ required: false })
  feeAmount?: number;

  @Prop({ required: false })
  feePercentage?: number;

  @Prop({ required: false })
  amountPaid?: number;

  @Prop({ required: false })
  settlementAmount?: number;

  @Prop({ required: false })
  expectedSettlementAmount?: number;

  @Prop({ required: false })
  paidOn?: Date;
}

export const PostingSchema = SchemaFactory.createForClass(Posting);
