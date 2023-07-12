import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HelperClass } from 'src/utils/helpers';
import { FileService } from 'src/file/file.service';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token-service/Token.service';
import UserService from 'src/user/user.service';
import EmailService from 'src/email/email.service';

@Module({
  // imports: [UserRepository],
  controllers: [AuthController],
  providers: [
    AuthService,
    HelperClass,
    FileService,
    ConfigService,
    TokenService,
    UserService,
    EmailService,
  ],
})
export class AuthModule {}
