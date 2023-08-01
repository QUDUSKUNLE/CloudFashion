import {
  registerDecorator,
  ValidatorConstraint,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@ValidatorConstraint({ name: 'MongooseIDValidations', async: true })
@Injectable()
export class MoongooseIDValidator implements ValidatorConstraintInterface {
  validate(ID: string, args: ValidationArguments) {
    const result = mongoose.Types.ObjectId.isValid(ID);
    if (result) return true;
    throw new BadRequestException(`${args.property} is not a valid ID!`);
  }
}

export const ValidationConstructor =
  (
    validator: ValidatorConstraintInterface,
    validationOptions?: ValidationOptions,
  ) =>
  (object: any, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator,
    });

export const isObjectIDValid =
  (validationOptions?: ValidationOptions) =>
  (object: any, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MoongooseIDValidator,
    });

export const Parser = (data: unknown) => JSON.parse(JSON.stringify(data));
