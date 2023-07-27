import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as mongoose from 'mongoose';

@ValidatorConstraint({ name: 'PasswordValidator', async: false })
export class CustomerIDValidator implements ValidatorConstraintInterface {
  validate(CustomerID: string, args: ValidationArguments) {
    return CustomerID
      ? mongoose.Types.ObjectId.isValid(args.object['CustomerID'])
      : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `CustomerID is not valid!.`;
  }
}
