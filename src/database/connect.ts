import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
export default class Database {
  constructor(private readonly configService: ConfigService) {}
  public async connectDb() {
    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(
        this.configService.get<string>('MONGO_DATABASE_URL'),
      );
      Logger.log(
        `${this.configService.get<string>(
          'APP_NAME',
        )} 🚀 Connected to Database Successfully`,
      );
    } catch (error) {
      Logger.error(
        `${this.configService.get<string>(
          'APP_NAME',
        )} ❌ Failed to Connect to Database`,
      );
      Logger.error(error);
    }
  }
}
