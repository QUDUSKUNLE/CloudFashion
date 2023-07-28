import { Test, TestingModule } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { PrismaService } from '../common';
import { MODULE, MockData } from '../mock/mock.data';
import { CustomersService } from './customers.service';

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  const req = createRequest({
    method: 'POST',
    url: '/',
  });
  req.sub = MockData.SERVICES[MODULE.USER].USER;

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
      prisma.designers.findUnique = jest
        .fn()
        .mockReturnValue({ DesignerID: '1' });
      prisma.customers.createMany = jest.fn().mockReturnValue({ count: 1 });
      const { Count } = await service.Create(
        {
          ...MockData.SERVICES[MODULE.CUSTOMER].CREATE_CUSTOMER,
        },
        req,
      );
      expect(Count).toBeDefined();
    });
    it('should throw error when Customer name is not defined', () => {
      return service
        .Create(
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
    it('should throw error when Unauthorized to perform this operation', () => {
      prisma.designers.findUnique = jest
        .fn()
        .mockReturnValue({ DesignerID: null });
      return service
        .Create(
          {
            ...MockData.SERVICES[MODULE.CUSTOMER].CREATE_CUSTOMER,
          },
          req,
        )
        .catch((e) =>
          expect(e?.message).toEqual(
            MockData.SERVICES[MODULE.CUSTOMER].UNAUTHORIZED_MESSAGE,
          ),
        );
    });
  });
  describe('Find All', () => {
    it('should return array of customers', async () => {
      prisma.designers.findUnique = jest
        .fn()
        .mockReturnValue({ DesignerID: '1' });
      prisma.customers.findMany = jest
        .fn()
        .mockReturnValue(MockData.SERVICES[MODULE.CUSTOMER].FIND_ALL.RESULT);
      const result = await service.FindAll(
        MockData.SERVICES[MODULE.CUSTOMER].FIND_ALL.ARGS,
      );
      expect(prisma.customers.findMany).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });
});
