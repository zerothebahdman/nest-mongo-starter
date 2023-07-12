import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ACCOUNT_STATUS } from 'config/constant';
import { isAccountAlreadyExist } from 'src/validators/account-exists.validator';

export class CreateAuthDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  firstName: string;
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  lastName: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  @MaxLength(40)
  middleName: string;
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  @Validate(isAccountAlreadyExist)
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  //   portfolio: PORTFOLIO;
  @IsNotEmpty()
  @IsString()
  residentialAddress: string;
  //   gender: GENDER;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  phoneNumber: string;
  @IsString()
  avatar: string;
  @IsString()
  dob: Date;
  @IsString()
  @IsOptional()
  inviteCode: string;

  @IsOptional()
  @IsEnum(Object.values(ACCOUNT_STATUS))
  accountStatus: {
    status: ACCOUNT_STATUS;
    reason?: string;
  };

  verificationToken: string;
  verificationTokenExpiry: Date;
}

export class ForgetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  email: string;
}

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class VerifyAuthDto {
  @IsString()
  @MinLength(6)
  @MinLength(6)
  token: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  refreshToken: string;
}

export class ResendOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  confirmPassword: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MinLength(6)
  token: string;
}
