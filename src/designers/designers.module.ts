import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../services/auth/auth.module';
import { DesignersService } from './designers.service';
import { PrismaService } from '../prisma/prisma.service';
import { DesignersResolver } from './designers.resolver';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [DesignersResolver, DesignersService, PrismaService],
  exports: [DesignersService],
})
export class DesignersModule {}
