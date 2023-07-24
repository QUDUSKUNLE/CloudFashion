import * as express from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockData, MODULE } from '../mock/mock.data';

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;
  let req: express.Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, PrismaService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Create method', () => {
    it('should create a new customer', async () => {
      prisma.customers.createMany = jest.fn().mockReturnValue({ count: 1 });
      const result = await service.create(
        {
          ...MockData.SERVICES[MODULE.CUSTOMER].CREATE_CUSTOMER,
        },
        req,
      );
      expect(result.Count).toBeDefined();
    });
    it('should throw error when Customer name is not defined', () => {
      return service
        .create(
          {
            ...MockData.SERVICES[MODULE.CUSTOMER].CreateEmpty,
          },
          req,
        )
        .catch((e) =>
          expect(e?.message).toEqual(
            MockData.SERVICES[MODULE.CUSTOMER].ERROR_MESSAGE,
          ),
        );
    });
  });
});
