import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

@Module({
  providers: [
    {
      provide: 'FIREBASE_STORAGE',
      useFactory: (config: ConfigService) => {
        const app = initializeApp({
          apiKey: config.get('FIREBASE_API_KEY'),
          projectId: config.get('FIREBASE_PROJECT_ID'),
          storageBucket: config.get('FIREBASE_STORAGE_BUCKET'),
        });
        return getStorage(app);
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    {
      provide: 'FIREBASE_STORAGE',
      useFactory: (config: ConfigService) => {
        const app = initializeApp({
          apiKey: config.get('FIREBASE_API_KEY'),
          projectId: config.get('FIREBASE_PROJECT_ID'),
          storageBucket: config.get('FIREBASE_STORAGE_BUCKET'),
        });
        return getStorage(app);
      },
      inject: [ConfigService],
    },
  ],
})
export class FirebaseModule {}
