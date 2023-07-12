import { Module } from '@nestjs/common';
import { TokenService } from './Token.service';

@Module({
  providers: [TokenService],
})
export class TokenModule {}
