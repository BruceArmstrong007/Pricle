import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './database/schema/user.schema';
import { UserRepository } from './database/repository/user.repository';
import { ContactModule } from '../contact/contact.module';
import { UploadModule } from '../upload/upload.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => ContactModule),
    forwardRef(() => UploadModule),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
