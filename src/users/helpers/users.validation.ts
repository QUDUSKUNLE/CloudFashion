import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaService } from '../../common';

@ValidatorConstraint({ name: 'ConfirmPassword', async: false })
@Injectable()
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const result = confirmPassword
      ? confirmPassword === args.object['Password']
      : false;
    if (result) return true;
    throw new BadRequestException('Password and ConfirmPassword must match!');
  }
}

@ValidatorConstraint({ name: 'Email', async: false })
@Injectable()
export class EmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(Email: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.prisma.users.findFirst({ where: { Email } });
    if (user) throw new ConflictException(`${args.property} already exists!`);
    return true;
  }
}
