import * as express from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    createCustomerInput: CreateCustomerInput,
    req: express.Request,
  ): Promise<{ Count: number }> {
    try {
      if (createCustomerInput.CreateCustomers.length === 0) {
        throw new BadRequestException('Customer Name can not be empty');
      }
      const result = await this.prismaService.customers.createMany({
        data: createCustomerInput.CreateCustomers,
      });
      return { Count: result.count };
    } catch (error) {
      throw error;
    }
  }
}
