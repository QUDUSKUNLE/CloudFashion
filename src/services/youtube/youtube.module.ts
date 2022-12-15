import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Module({
  providers: [
    {
      useFactory: () => {
        return new YoutubeService(
          process.env.CLOUDINARY_CLOUD_NAME,
          process.env.CLOUDINARY_API_SECRET,
          process.env.CLOUDINARY_API_KEY,
        );
      },
      provide: YoutubeService,
    },
  ],
  exports: [YoutubeService],
})
export class YoutubeModule {}
