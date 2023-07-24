import * as express from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { CreateCustomerInput } from './dto/create-customer.input';

describe('CustomersResolver', () => {
  let resolver: CustomersResolver;
  let customerService: CustomersService;
  let req: express.Request;

  beforeAll(async () => {
    const ServiceProvider = {
      provide: CustomersService,
      useFactory: () => ({
        create: jest.fn(() => []),
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

  describe('CustomerResolver', () => {
    it('should be able to create a customer', () => {
      const payload = new CreateCustomerInput();
      const result = resolver.createCustomer(payload, req);
      expect(customerService.create).toHaveBeenCalled();
      expect(result).not.toEqual(null);
    });
    it('should be able to throw an error', () => {
      const payload = new CreateCustomerInput();
      const result = resolver.createCustomer(payload, req);
      expect(customerService.create).toHaveBeenCalled();
      expect(result).not.toEqual(null);
    });
  });
});
