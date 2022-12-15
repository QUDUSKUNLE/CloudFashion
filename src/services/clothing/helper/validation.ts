import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customPickUpDateValidator', async: false })
export class CustomPickUpDateValidator implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    return date ? new Date(date) >= args.constraints[0] : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Expected ${args.property} ${args.value} should be greater than today\'s date!`;
  }
}

@ValidatorConstraint({ name: 'customDeliveryDateValidator', async: false })
export class CustomDeliveryDateValidator
  implements ValidatorConstraintInterface
{
  validate(date: Date, args: ValidationArguments) {
    return date ? new Date(date) >= args.constraints[0] : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Expected ${args.property} ${args.value} can\'t be less than 7 days from the Pick Up date!`;
  }
}
