import { Module } from '@nestjs/common';

import { AuthModule } from '../services/auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DesignersResolver } from './designers.resolver';
import { DesignersService } from './designers.service';
import { PrismaService } from '../common';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [DesignersResolver, DesignersService, PrismaService],
  exports: [DesignersService],
})
export class DesignersModule {}
