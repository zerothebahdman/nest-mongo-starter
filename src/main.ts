import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'), () => {
    // console.log(
    //   `${configService.get<string>(
    //     'appName',
    //   )} 🚀 is running on port ${configService.get<number>('port')}`,
    // );
    Logger.log(
      `${configService.get<string>(
        'appName',
      )} 🚀 is running on port ${configService.get<number>('port')}`,
    );
  });
}
bootstrap();
