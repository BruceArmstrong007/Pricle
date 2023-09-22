import { Module, forwardRef } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { FirebaseModule } from '@app/common';
import { UserModule } from '../user/user.module';
import { UploadRepository } from './Storage/upload.repository';

@Module({
  controllers: [UploadController],
  imports: [FirebaseModule, forwardRef(() => UserModule)],
  providers: [UploadService, UploadRepository],
  exports: [UploadService, UploadRepository],
})
export class UploadModule {}
