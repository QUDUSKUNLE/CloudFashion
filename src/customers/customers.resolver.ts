import * as express from 'express';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Role } from '../common/interface';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { GraphRequest, Roles } from '../user.decorator';
import { CreateCustomerInput } from './dto/create-customer.input';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Roles(Role.DESIGNER)
  @Mutation(() => Customer)
  async createCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
    @GraphRequest() req: express.Request,
  ): Promise<Customer> {
    return await this.customersService.create(createCustomerInput, req);
  }
}
