import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import config from 'config/default';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      stack = exception.stack;
    }

    // Customize the response
    if (config().env === 'production') {
      response.status(status).json({
        status: status.toString().startsWith('4') ? 'error' : 'fail',
        statusCode: status,
        message,
      });
    } else {
      response.status(status).json({
        status: status.toString().startsWith('4') ? 'error' : 'fail',
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        stack,
      });
    }
  }
}
