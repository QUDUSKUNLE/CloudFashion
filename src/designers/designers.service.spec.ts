import { Test, TestingModule } from '@nestjs/testing';
import { DesignersService } from './designers.service';
import { PrismaService } from '../prisma/prisma.service';
import { DesignersResolver } from './designers.resolver';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../services/auth/auth.module';
import { RedisCacheModule } from '../services/redis-cache/redis-cache.module';

describe('DesignersService', () => {
  let service: DesignersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule, RedisCacheModule],
      providers: [DesignersService, DesignersResolver, PrismaService],
    }).compile();

    service = module.get<DesignersService>(DesignersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
