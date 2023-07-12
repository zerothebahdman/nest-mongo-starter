import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/default';
import Database from './database/connect';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { TokenModule } from './token-service/Token.module';
import { TokenService } from './token-service/Token.service';
import { UserModule } from './user/user.module';
import { SendchampService } from './sendchamp/sendchamp.service';
import UserService from './user/user.service';
import EmailService from './email/email.service';
new Database(new ConfigService()).connectDb();
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    FileModule,
    UserModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FileService,
    TokenService,
    UserService,
    SendchampService,
    EmailService,
  ],
})
export class AppModule {}
