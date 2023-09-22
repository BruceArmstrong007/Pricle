import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UploadRepository } from './Storage/upload.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async profileUpload(
    userID: string,
    file: Express.Multer.File,
    prevFilename?: string,
  ): Promise<any> {
    try {
      const fileName = userID + '.' + file?.mimetype.split('/')[1];

      const link = await this.uploadRepository.uploadProfile(fileName, file);
      if (
        prevFilename &&
        prevFilename.split('.')[1] !== fileName.split('.')[1]
      ) {
        await this.uploadRepository.deleteProfile(prevFilename);
      }
      return await this.userService.uploadProfile(userID, {
        filename: fileName,
        url: link,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteProfile(fileName: string) {
    try {
      await this.uploadRepository.deleteProfile(fileName);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
