import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/default';
import Database from './database/connect';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';
import { TokenModule } from './token-service/Token.module';
import { TokenService } from './token-service/Token.service';
import { UserModule } from './user/user.module';
import UserService from './user/user.service';
import EmailService from './email/email.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { EmailModule } from './email/email.module';
import { HelperClass } from './utils/helpers';
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
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    HelperClass,
    FileService,
    TokenService,
    UserService,
    EmailService,
    AuthService,
  ],
})
export class AppModule {}
