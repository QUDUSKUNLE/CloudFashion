import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordValidator', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    return confirmPassword
      ? confirmPassword === args.object['Password']
      : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Password and ConfirmPassword must match!`;
  }
}
