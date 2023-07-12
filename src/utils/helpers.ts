import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class HelperClass {
  generateRandomString(length = 32, type = 'alpha-num'): string {
    let result = '';
    let characters = '';
    switch (type) {
      case 'alpha':
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        break;
      case 'alpha-num':
        characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        break;
      case 'num':
        characters = '0123456789';
        break;
      case 'upper':
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'lower':
        characters = 'abcdefghijklmnopqrstuvwxyz';
        break;
      case 'lower-num':
        characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        break;
      case 'upper-num':
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        break;
      default:
        characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        break;
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async hashString(stringToHash: string): Promise<string> {
    const hash = createHash('sha256').update(stringToHash).digest('hex');
    return hash;
  }
}
