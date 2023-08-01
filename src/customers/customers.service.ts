import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as express from 'express';
import { FetchArguments, PrismaService } from '../common';
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
        data: createCustomerInput.CreateCustomers.reduce(
          (accumulator, customer) => {
            customer['DesignerIDs'] = [DesignerID];
            accumulator.push(customer);
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

  async FindAll(fetchArgs: FetchArguments) {
    return await this.prismaService.customers.findMany({
      skip: fetchArgs.Skip,
      take: fetchArgs.Take,
    });
  }
}
