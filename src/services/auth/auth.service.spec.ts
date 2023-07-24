import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersModule } from '../../users/users.module';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, RedisCacheModule],
      providers: [AuthService, PrismaService],
      exports: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
