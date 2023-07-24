import * as express from 'express';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateCustomerInput,
  CreateCustomer,
} from './dto/create-customer.input';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    createCustomerInput: CreateCustomerInput,
    req: express.Request,
  ): Promise<{ Count: number }> {
    if (createCustomerInput.CreateCustomers.length === 0) {
      throw new BadRequestException('Customer Name can not be empty');
    }
    const { DesignerID } = await this.prismaService.designers.findUnique({
      where: { UserID: req.sub.UserID },
      select: {
        DesignerID: true,
      },
    });
    if (!DesignerID) {
      throw new UnauthorizedException('Unauthorized to perform this operation');
    }
    const result = await this.prismaService.customers.createMany({
      data: createCustomerInput.CreateCustomers.reduce<CreateCustomer[]>(
        (accumulator, customer) => {
          customer['DesignerID'] = DesignerID;
          accumulator.push(customer);
          return accumulator;
        },
        [],
      ),
    });
    return { Count: result.count };
  }
}
