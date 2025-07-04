import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) { }

  transform(value: any) {
    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      console.log("err--->",error.details);
      
      throw new BadRequestException(
        {
          status: false,
          message: `Validation failed: ${error.details.map(x => x.message).join(', ')}`
        }
      );
    }
    return value;
  }
}
