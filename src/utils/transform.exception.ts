import { ValidationPipe, BadRequestException } from '@nestjs/common';

export class SingleErrorMessageValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const errorMessage = Object.values(errors[0].constraints)[0];
        return new BadRequestException(errorMessage);
      },
    });
  }
}
