import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Contact extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  sender: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  receiver: Types.ObjectId;

  @Prop({
    required: true,
  })
  status: ContactStatus;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);

export type ContactStatus =
  | 'SENT'
  | 'RECEIVED'
  | 'ACCEPTED'
  | 'FRIENDS'
  | 'BLOCKED';
