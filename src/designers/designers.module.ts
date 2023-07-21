import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../services/auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheModule } from '../services/redis-cache/redis-cache.module';
import { DesignersResolver } from './designers.resolver';
import { DesignersService } from './designers.service';
import { Designer, DesignerSchema } from './models/designers.schema';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RedisCacheModule,
    MongooseModule.forFeature([
      { name: Designer.name, schema: DesignerSchema },
    ]),
  ],
  providers: [DesignersResolver, DesignersService, PrismaService],
  exports: [DesignersService, MongooseModule],
})
export class DesignersModule {}
