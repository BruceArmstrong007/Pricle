import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// bad naming convension ;-; sender and receiver all usernames

@Schema({ versionKey: false, timestamps: true })
export class Contact extends Document {
  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 25,
  })
  sender: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 25,
  })
  receiver: string;

  @Prop({
    required: true,
    maxlength: 50,
  })
  status: ContactStatus;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);

export type ContactStatus = 'SENT' | 'ACCEPTED' | 'FRIENDS' | 'BLOCKED';
