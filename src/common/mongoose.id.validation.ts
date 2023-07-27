import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as mongoose from 'mongoose';

@ValidatorConstraint({ name: 'MongooseIDValidations', async: false })
export class MoongooseIDValidator implements ValidatorConstraintInterface {
  validate(ID: string, args: ValidationArguments) {
    return args.value ? mongoose.Types.ObjectId.isValid(args.value) : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid ID!.`;
  }
}
