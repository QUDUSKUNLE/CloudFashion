import * as express from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { FetchArgs } from '../common';

describe('CustomersResolver', () => {
  let resolver: CustomersResolver;
  let customerService: CustomersService;
  let req: express.Request;

  beforeAll(async () => {
    const ServiceProvider = {
      provide: CustomersService,
      useFactory: () => ({
        Create: jest.fn(() => []),
        FindAll: jest.fn(() => []),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersResolver, CustomersService, ServiceProvider],
    }).compile();

    resolver = module.get<CustomersResolver>(CustomersResolver);
    customerService = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('CreateCustomer', () => {
    it('should be able to create a customer', () => {
      const payload = new CreateCustomerInput();
      const result = resolver.CreateCustomer(payload, req);
      expect(customerService.Create).toHaveBeenCalled();
      expect(result).not.toEqual(null);
    });
    it('should be able to throw an error code P2002', async () => {
      customerService.Create = jest
        .fn()
        .mockRejectedValue({ code: 'P2002', message: 'error' });
      const payload = new CreateCustomerInput();
      return await resolver
        .CreateCustomer(payload, req)
        .catch((e) => expect(e?.message).toEqual('Customer`s already exist.'));
    });
    it('should be able to throw an error', async () => {
      customerService.Create = jest.fn().mockRejectedValue(new Error('error'));
      const payload = new CreateCustomerInput();
      return await resolver
        .CreateCustomer(payload, req)
        .catch((e) => expect(e?.message).toEqual('error'));
    });
  });
  describe('FetchCustomers', () => {
    it('should be able to fetch customers', () => {
      const fetch = new FetchArgs();
      const result = resolver.FetchCustomers(fetch);
      expect(customerService.FindAll).toHaveBeenCalled();
      expect(result).not.toEqual(null);
    });
  });
});
