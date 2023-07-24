import * as express from 'express';
import { ConflictException, Injectable } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Role } from '../common/interface';
import { FetchArgs } from '../common/address.input';
import { Customer, Customers } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { GraphRequest, Roles } from '../user.decorator';
import { CreateCustomerInput } from './dto/create-customer.input';

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

  @Roles(Role.DESIGNER)
  @Query(() => [Customers])
  async FetchCustomers(
    @Args() fetchCustomersArgs: FetchArgs,
    @GraphRequest() req: express.Request,
  ) {
    return await this.customersService.FindAll(fetchCustomersArgs, req);
  }
}
