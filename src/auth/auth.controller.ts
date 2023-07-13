import {
  Controller,
  Post,
  Body,
  UsePipes,
  Res,
  BadRequestException,
  ForbiddenException,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  ForgetPasswordDto,
  LoginAuthDto,
  RefreshTokenDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyAuthDto,
} from './dto/auth.dto';
import { ACCOUNT_STATUS } from 'config/constant';
import { HelperClass } from 'src/utils/helpers';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as httpStatus from 'http-status';
import User from 'src/database/models/user.model';
import { FileService } from '../file/file.service';
import { SingleErrorMessageValidationPipe } from 'src/utils/transform.exception';
import { UploadApiResponse } from 'cloudinary';
import UserService from 'src/user/user.service';
import EmailService from 'src/email/email.service';
import { CustomExceptionFilter } from 'src/utils/CustomException';
import { createUser } from './validation/auth.validator';
import { ValidatePipe } from 'src/utils/validation.pipe';

@UseFilters(new CustomExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly helperClass: HelperClass,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}
  @Post('/create')
  @UsePipes(new ValidatePipe<CreateAuthDto>(createUser))
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    createAuthDto.phoneNumber = createAuthDto.phoneNumber.startsWith('+234')
      ? createAuthDto.phoneNumber
      : `+234${createAuthDto.phoneNumber.replace(/^0+/, '')}`;
    const filter = {
      $or: [
        { phoneNumber: createAuthDto.phoneNumber },
        { email: createAuthDto.email },
      ],
    };
    const userExists = await this.userService.getOne<User>(
      User,
      filter as unknown as Record<string, unknown>,
    );
    if (userExists) {
      throw new BadRequestException(
        'Oops!, user with this email or phone number already exists',
      );
    }
    createAuthDto.accountStatus = {
      status: ACCOUNT_STATUS.PENDING,
      reason: 'Account created',
    };
    createAuthDto.password = await this.authService.hashPassword(
      createAuthDto.password,
    );
    const otpCode = this.helperClass.generateRandomString(6, 'num');
    createAuthDto.verificationToken = await this.helperClass.hashString(
      otpCode,
    );
    createAuthDto.verificationTokenExpiry = moment().add(10, 'minute').toDate();
    const { secure_url, public_id } = (await this.fileService.uploadFile(
      createAuthDto.avatar,
      'avatar',
      this.helperClass.generateRandomString(5, 'num'),
    )) as UploadApiResponse;
    Object.assign(createAuthDto, {
      avatar: { url: secure_url, publicId: public_id },
    });
    const user = await this.authService.create<CreateAuthDto, User>(
      createAuthDto,
      User,
    );

    if (this.configService.get('env') === 'production') {
      // await emailService._sendUserEmailVerificationEmail(
      //   `${hospitalStaff.firstName} ${hospitalStaff.lastName}`,
      //   hospitalStaff.email,
      //   otpCode,
      // );
      return res.status(httpStatus.OK).json({
        status: 'success',
        message: 'An email has been sent to your email address',
        user,
      });
    }
    res.status(httpStatus.CREATED).json({
      status: 'success',
      otpCode,
      user,
    });
  }

  @Post('/login')
  @UsePipes(new SingleErrorMessageValidationPipe())
  async login(@Body() loginDto: LoginAuthDto, @Res() res: Response) {
    loginDto.phoneNumber = loginDto.phoneNumber.startsWith('+234')
      ? loginDto.phoneNumber
      : `+234${loginDto.phoneNumber.replace(/^0+/, '')}`;
    const user = await User.findOne({
      phoneNumber: loginDto.phoneNumber,
    }).select('+password');
    if (
      !user ||
      !(await this.authService.comparePassword(
        user.password,
        loginDto.password,
      ))
    )
      throw new BadRequestException('Invalid login credentials');
    if (user.accountStatus.status !== ACCOUNT_STATUS.ACTIVATED)
      throw new BadRequestException(
        'Oops!, Your account has not been activated',
      );
    const token = await this.authService.login({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
    });

    res.status(httpStatus.OK).json({
      status: 'success',
      token,
      user,
    });
  }

  @Post('/verify-email')
  @UsePipes(new SingleErrorMessageValidationPipe())
  async verifyEmail(@Body() verifyDto: VerifyAuthDto, @Res() res: Response) {
    const hashToken = await this.helperClass.hashString(verifyDto.token);
    const user = await this.userService.getUserDetail({
      // verifiedAt: false,
      verificationToken: hashToken,
    });

    if (!user) throw new BadRequestException(`Oops!, invalid otp`);
    if (user.verificationTokenExpiry < moment().utc().startOf('day').toDate())
      throw new Error(`Oops!, your token has expired`);

    const data: Pick<
      User,
      | 'verifiedAt'
      | 'verificationToken'
      | 'verificationTokenExpiry'
      | 'accountStatus'
    > = {
      verifiedAt: moment().utc().toDate(),
      verificationToken: null,
      verificationTokenExpiry: null,
      accountStatus: {
        status: ACCOUNT_STATUS.ACTIVATED,
        reason: `Account activated`,
      },
    };
    await this.userService.updateUserById(user.id, data);

    return res.status(httpStatus.OK).json({
      status: `success`,
      message: `Your email: ${user.email} has been verified`,
    });
  }

  @Post('/password-reset')
  @UsePipes(new SingleErrorMessageValidationPipe())
  async passwordReset(
    @Body() passwordReset: ForgetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const userExists: User = await this.userService.getUserDetail({
        email: passwordReset.email,
      });
      if (!userExists) throw new Error(`Oops! User does not exist`);

      const token = this.helperClass.generateRandomString(6, 'num');
      const hashedToken = await this.helperClass.hashString(token);

      const updateBody: Pick<
        User,
        'passwordResetToken' | 'passwordResetTokenExpiresAt'
      > = {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: moment().add(12, 'hours').utc().toDate(),
      };

      await this.userService.updateUserById(userExists.id, updateBody);

      await this.emailService._sendUserPasswordResetInstructionEmail(
        `${userExists.firstName} ${userExists.lastName}`,
        userExists.email,
        token,
      );

      return res.status(httpStatus.OK).json({
        status: `success`,
        message: `An email has been sent to your email address`,
      });
    } catch (err: unknown) {
      if (err instanceof BadRequestException || err instanceof Error) {
        return new BadRequestException(err.message);
      }
    }
  }

  @Post('/regenerate-access-token')
  @UsePipes(new SingleErrorMessageValidationPipe())
  async regenerateAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    try {
      const accessToken = await this.authService.regenerateAccessToken<User>(
        refreshTokenDto.refreshToken,
        User,
      );
      if (!accessToken || accessToken.trim() === '')
        throw new ForbiddenException(`Oops!, invalid refresh token`);
      return res.status(httpStatus.OK).json({ status: 'success', accessToken });
    } catch (err: unknown) {
      if (err instanceof BadRequestException || err instanceof Error)
        return new BadRequestException(err.message);
    }
  }

  @Post('/resend-otp')
  @UsePipes(new SingleErrorMessageValidationPipe())
  async resendOtp(@Body() resendOtpDto: ResendOtpDto, @Res() res: Response) {
    try {
      const _user = await this.userService.getUserDetail({
        email: resendOtpDto.email,
      });
      if (!_user) throw new BadRequestException(`Oops!, user does not exist`);
      if (_user.accountStatus.status === ACCOUNT_STATUS.ACTIVATED)
        throw new Error(`Oops!, email has already been verified`);

      const otp = this.helperClass.generateRandomString(6, 'num');
      const hashedToken = await this.helperClass.hashString(otp);

      await this.userService.updateUserById(_user.id, {
        verificationToken: hashedToken,
        verificationTokenExpiry: moment().add('30', 'minutes').utc().toDate(),
      });

      await this.emailService._sendUserEmailVerificationEmail(
        `${_user.firstName} ${_user.lastName}`,
        _user.email,
        otp,
      );
      return res.status(httpStatus.NO_CONTENT).send();
    } catch (err: unknown) {
      if (err instanceof BadRequestException || err instanceof Error)
        return new BadRequestException(err.message);
    }
  }

  @Post('/reset-password')
  @UsePipes(new SingleErrorMessageValidationPipe())
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const hashedToken = await this.helperClass.hashString(
        resetPasswordDto.token,
      );

      const user: User = await this.userService.getUserDetail({
        passwordResetToken: hashedToken,
      });

      if (!user) throw new BadRequestException(`Oops!, invalid token`);
      if (user.passwordResetTokenExpiresAt < moment().utc().toDate())
        throw new Error(`Oops!, your token has expired`);
      const hashedPassword = await this.authService.hashPassword(
        resetPasswordDto.password,
      );

      const updateBody: Pick<
        User,
        'password' | 'passwordResetToken' | 'passwordResetTokenExpiresAt'
      > = {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      };

      await this.userService.updateUserById(user.id, updateBody);

      res.status(httpStatus.OK).json({
        status: 'success',
        message: 'Password reset was successful',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return new BadRequestException(err.message);
      }
    }
  }
}
