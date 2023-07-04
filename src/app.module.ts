import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { Test3Module } from './test3/test3.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [TestModule, Test3Module, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
