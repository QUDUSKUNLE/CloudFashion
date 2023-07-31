import { Module } from '@nestjs/common';

import { UsersModule, AuthModule } from '../modules';
import { DesignersResolver } from './designers.resolver';
import { DesignersService } from './designers.service';
import { PrismaService } from '../common';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [DesignersResolver, DesignersService, PrismaService],
  exports: [DesignersService],
})
export class DesignersModule {}
