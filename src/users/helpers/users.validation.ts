import { BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'ConfirmPassword', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const result = confirmPassword
      ? confirmPassword === args.object['Password']
      : false;
    if (result) return true;
    throw new BadRequestException('Password and ConfirmPassword must match!');
  }
}
