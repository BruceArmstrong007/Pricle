import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  FirebaseStorage,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

@Injectable()
export class UploadRepository {
  protected readonly logger = new Logger(UploadRepository.name);

  constructor(
    @Inject('FIREBASE_STORAGE')
    private readonly firebaseStorage: FirebaseStorage,
  ) {}

  async uploadProfile(
    fileName: string,
    file: Express.Multer.File,
  ): Promise<string | undefined> {
    const fileData = file.buffer;
    const storageRef = ref(this.firebaseStorage, 'user/' + fileName);
    const metadata = {
      contentType: file.mimetype,
    };
    await uploadBytes(storageRef, fileData, metadata);
    return await getDownloadURL(storageRef);
  }

  deleteProfile(fileName: string) {
    const fileRef = ref(this.firebaseStorage, 'user/' + fileName);
    deleteObject(fileRef).catch(() => {});
  }
}
