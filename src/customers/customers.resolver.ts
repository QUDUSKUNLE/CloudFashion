import * as express from 'express';
import { ConflictException, Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { Customer, Customers } from './entities/customer.entity';
import { FetchArgs, Role, GraphRequest, Roles } from '../common';

@Resolver(() => Customer)
@Injectable()
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Roles(Role.DESIGNER)
  @Mutation(() => Customer)
  async CreateCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
    @GraphRequest() req: express.Request,
  ): Promise<Customer> {
    try {
      return await this.customersService.Create(createCustomerInput, req);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Customer`s already exist.');
      }
      throw e;
    }
  }

  @Roles(Role.ADMIN)
  @Query(() => [Customers])
  async FetchCustomers(@Args() fetchCustomersArgs: FetchArgs) {
    return await this.customersService.FindAll(fetchCustomersArgs);
  }
}
