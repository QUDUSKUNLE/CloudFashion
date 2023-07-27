import * as express from 'express';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { FetchArgs } from '../common/address.input';
import {
  CreateCustomerInput,
  CustomerEntity,
} from './dto/create-customer.input';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}
  async Create(
    createCustomerInput: CreateCustomerInput,
    req: express.Request,
  ): Promise<{ Count: number }> {
    try {
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
        throw new UnauthorizedException(
          'Unauthorized to perform this operation',
        );
      }
      const result = await this.prismaService.customers.createMany({
        data: createCustomerInput.CreateCustomers.reduce<CustomerEntity[]>(
          (accumulator, customer) => {
            customer['DesignerID'] = [DesignerID];
            accumulator.push(<CustomerEntity>customer);
            return accumulator;
          },
          [],
        ),
      });
      return { Count: result.count };
    } catch (e) {
      throw e;
    }
  }

  async FindAll(fetchCustomersArgs: FetchArgs, req: express.Request) {
    const designer = await this.prismaService.designers.findUnique({
      where: { UserID: req.sub.UserID },
    });
    return designer
      ? await this.prismaService.customers.findMany({
          skip: fetchCustomersArgs.Skip,
          take: fetchCustomersArgs.Take,
          where: { DesignerID: { hasSome: [designer.DesignerID] } },
        })
      : [];
  }
}
