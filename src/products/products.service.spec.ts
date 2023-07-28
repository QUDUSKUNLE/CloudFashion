import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../common';
import { QueueService } from '../services/queue/queue.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let queue: QueueService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, QueueService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    queue = module.get<QueueService>(QueueService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
