import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, versionKey: false, timestamps: true })
export class Profile extends Document {
  @Prop({
    required: true,
    default: '',
  })
  filename: string;

  @Prop({
    required: true,
    default: '',
  })
  url: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 25,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ maxlength: 50 })
  name: string;

  @Prop({
    maxlength: 500,
  })
  bio: string;

  @Prop({ type: ProfileSchema })
  profile: Profile;

  @Prop({ default: false })
  verified: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
