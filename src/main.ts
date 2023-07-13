import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const exitHandler = () => {
    if (app) {
      app.close().then(() => process.exit(1));
    } else {
      process.exit(1);
    }
  };
  const unexpectedErrorHandler = (error: any) => {
    Logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    Logger.log('SIGTERM received');
    app.close().then(() => {
      process.exit(0);
    });
  });
  await app.listen(configService.get<number>('port'), () => {
    Logger.log(
      `${configService.get<string>(
        'appName',
      )} 🚀 is running on port ${configService.get<number>('port')}`,
    );
  });
}
bootstrap();
