import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../common';
import { AuthModule, UsersModule, QueueModule } from '../modules';
import { MockData, MODULE } from '../mock/mock.data';
import { QueueService } from '../services/queue/queue.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let queue: QueueService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule, QueueModule],
      providers: [ProductsService, QueueService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    queue = module.get<QueueService>(QueueService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('FindAll', () => {
    it('should return array of products', async () => {
      prisma.products.findMany = jest
        .fn()
        .mockReturnValue(MockData.SERVICES[MODULE.PRODUCT].FindAllMockResponse);
      await service.FindAll(MockData.SERVICES[MODULE.PRODUCT].FindAll);
      expect(prisma.products.findMany).toHaveBeenCalled();
    });
  });
});
