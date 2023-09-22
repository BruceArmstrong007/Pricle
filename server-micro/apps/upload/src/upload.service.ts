import { Inject, Injectable } from '@nestjs/common';
import { UploadRepository } from './Storage/upload.repository';
import { RMQClientService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { tap } from 'rxjs/operators';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    @Inject(RMQClientService.UPLOAD_USER)
    private readonly userClient: ClientProxy,
  ) {}

  async profileUpload(
    prevFilename: string,
    username: string,
    file: Express.Multer.File,
    token: string,
  ): Promise<object> {
    try {
      const fileName = username + '.' + file?.originalname.split('.')[1];
      const link = await this.uploadRepository.uploadProfile(fileName, file);
      return this.userClient
        .send('uploadProfile', {
          data: { filename: fileName, url: link },
          Authentication: token,
        })
        .pipe(
          tap(() => {
            if (prevFilename.split('.')[1] !== fileName.split('.')[1]) {
              this.uploadRepository.deleteFile(prevFilename);
            }
          }),
        );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
