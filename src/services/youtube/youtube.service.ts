import * as cloudinary from 'cloudinary';
import { Injectable } from '@nestjs/common';

@Injectable()
export class YoutubeService {
  private readonly cloudName: string;
  private readonly cloudApiSecret: string;
  private readonly cloudApiKey: string;

  constructor(cloudName: string, cloudAPISECRET: string, cloudAPIKEY: string) {
    this.cloudName = cloudName;
    this.cloudApiKey = cloudAPIKEY;
    this.cloudApiSecret = cloudAPISECRET;
  }

  private cloudinaryService() {
    cloudinary.v2.config({
      cloud_name: this.cloudName,
      api_secret: this.cloudApiSecret,
      api_key: this.cloudApiKey,
      secure: true,
    });
    return cloudinary;
  }

  async uploadToCloud(file: string): Promise<cloudinary.UploadApiResponse> {
    try {
      return await this.cloudinaryService().v2.uploader.upload(file, {
        resource_type: 'video',
        eager: [
          { width: 100, height: 100, crop: 'pad', audio_codec: 'none' },
          {
            width: 160,
            height: 100,
            crop: 'crop',
            gravity: 'south',
            audio_codec: 'none',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  async destroyUploadToCloud(file: string): Promise<unknown> {
    try {
      return await this.cloudinaryService().v2.uploader.destroy(file, {
        resource_type: 'video',
      });
    } catch (error) {
      throw error;
    }
  }
}
