import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type PostingDocument = Posting & Document;

@Schema()
export class Posting {
  _id: ObjectId;

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
}

export const PostingSchema = SchemaFactory.createForClass(Posting);
