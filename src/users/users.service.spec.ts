import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CacheModule } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../services/auth/auth.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, CacheModule],
      providers: [UsersService, UsersResolver, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
