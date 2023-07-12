import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import config from '../../config/default';

@Injectable()
export class FileService {
  private cloudinaryConfig = cloudinary.config({
    cloud_name: config().cloudinary.cloudName,
    api_key: config().cloudinary.apiKey,
    api_secret: config().cloudinary.apiSecret,
  });

  async uploadFile(base64File: string, folder = 'uploads', public_id?: string) {
    try {
      this.cloudinaryConfig;
      const response = await cloudinary.uploader.upload(base64File, {
        public_id,
        folder,
        resource_type: 'auto',
        chunk_size: 3000,
      });
      Logger.log(response);
      return response;
    } catch (err: any) {
      Logger.error(err);
      throw new BadRequestException(err);
    }
  }

  async deleteFile(public_id: string) {
    try {
      //   await this.config();
      const response = await cloudinary.uploader.destroy(public_id);
      return response;
    } catch (err: any) {
      Logger.error(err);
      throw new Error(err.message);
    }
  }
}
