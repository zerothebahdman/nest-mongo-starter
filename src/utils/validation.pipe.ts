import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class ValidatePipe<T> implements PipeTransform<T> {
  constructor(private readonly schema: Joi.ObjectSchema<T>) {}

  transform(value: T, metadata: ArgumentMetadata) {
    const { error } = Joi.prefs({ errors: { label: 'key' } }).validate(value);
    if (error) {
      const errMessage = error.details.map((err) => err.message).join(', ');
      throw new BadRequestException(errMessage);
    }
    return value;
  }
}
