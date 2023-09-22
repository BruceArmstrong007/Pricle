import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Token extends Document {
  @Prop({
    required: true,
  })
  token: string;

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  email: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
