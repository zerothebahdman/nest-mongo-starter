import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as jwt from 'jsonwebtoken';

let PRIVATE_KEY = '';
(async () => {
  try {
    PRIVATE_KEY = await readFile(
      join(__dirname, '../certs/private_key.pem'),
      'utf8',
    );
  } catch (err: any) {
    Logger.error(err.message);
  }
})();

let PUBLIC_KEY = '';
(async () => {
  try {
    PUBLIC_KEY = await readFile(
      join(__dirname, '../certs/public_key.pem'),
      'utf8',
    );
  } catch (err: any) {
    Logger.error(err.message);
  }
})();

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}
  private async _generateAccessToken(
    id: string | number,
    name: string,
  ): Promise<string> {
    const token = jwt.sign({ sub: id, name, type: 'access' }, PRIVATE_KEY, {
      algorithm: 'RS512',
      expiresIn: this.configService.get<string>('jwtAccessTokenExpiration'),
    });

    return token;
  }

  private async _generateRefreshToken(
    id: string | number,
    name: string,
  ): Promise<string> {
    const token = jwt.sign({ sub: id, name, type: 'refresh' }, PRIVATE_KEY, {
      algorithm: 'RS512',
      expiresIn: this.configService.get<string>('jwtAccessTokenExpiration'),
    });

    return token;
  }

  async generateToken(
    id: string | number,
    name: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this._generateAccessToken(id, name);
    const refreshToken = await this._generateRefreshToken(id, name);
    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<string | jwt.JwtPayload> {
    try {
      const _token = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS512'] });
      return _token;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
        throw new Error(`Oops! your token has expired or is invalid`);
      throw new Error(err.message);
    }
  }
}
