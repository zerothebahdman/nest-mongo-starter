import { BadRequestException } from '@nestjs/common';
import User from 'src/database/models/user.model';

export class isAccountAlreadyExist {
  //   constructor() {}

  async validate(value: string): Promise<boolean> {
    const user = await User.findOne({ email: value });
    if (user) {
      throw new BadRequestException('Account already exists');
    }
    return true;
  }
  defaultMessage?(): string {
    return 'Account already exists';
  }
}
