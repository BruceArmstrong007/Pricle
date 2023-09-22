import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiExceptionFilter,
  CurrentUser,
  CurrentUserType,
  RequestValidator,
} from '@app/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Profile } from './dto/uploadProfile.request';

@Controller('upload')
@UseGuards(JwtAuthGuard)
@UseFilters(new ApiExceptionFilter())
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Put('profile')
  @UseInterceptors(FileInterceptor('profile'))
  async uploadFile(
    @Body() body: Profile,
    @CurrentUser() user: CurrentUserType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 15 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: true,
      }),
    )
    profile: Express.Multer.File,
  ): Promise<object> {
    const validation = await RequestValidator(Profile, body);
    if (validation) throw new BadRequestException(validation);
    return await this.uploadService.profileUpload(
      user?.userID,
      profile,
      body?.prevFilename,
    );
  }
}
