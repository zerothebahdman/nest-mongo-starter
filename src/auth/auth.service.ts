import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token-service/Token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}
  async create<T, K>(createAuthDto: T, model: Model<K>) {
    return await model.create(createAuthDto);
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async hashPassword(password: string) {
    const encryptedPassword = await bcrypt.hash(password, 14);
    return encryptedPassword;
  }

  async comparePassword(password: string, hashedPassword: string) {
    const isPasswordCorrect = await bcrypt.compare(hashedPassword, password);
    return isPasswordCorrect;
  }

  async login(loginPayload: { [key: string]: string }) {
    const token = await this.tokenService.generateToken(
      loginPayload.id,
      `${loginPayload.firstName} ${loginPayload.lastName}`,
    );

    return token;
  }

  async regenerateAccessToken<T>(
    refreshToken: string,
    model: Model<T, any>,
  ): Promise<string> {
    const decodeToken = await this.tokenService.verifyToken(refreshToken);
    const { sub }: string | JwtPayload = decodeToken;
    const data = await model.findById(sub);

    if (!data) throw new Error(`Oops!, data with id ${sub} does not exist`);

    const { accessToken } = await this.tokenService.generateToken(
      data.id,
      data.email,
    );

    return accessToken;
  }
}
