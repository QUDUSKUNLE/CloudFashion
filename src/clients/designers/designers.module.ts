// import * as NaijaStates from 'naija-state-local-government';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Designer, DesignerSchema } from './models/designers.schema';
import { AuthModule } from 'src/services/auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RedisCacheModule } from '../../services/redis-cache/redis-cache.module';
import { DesignersResolver } from './designers.resolver';
import { DesignersService } from './designers.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RedisCacheModule,
    MongooseModule.forFeature([
      { name: Designer.name, schema: DesignerSchema },
    ]),
  ],
  providers: [DesignersResolver, DesignersService],
  exports: [DesignersService, MongooseModule],
})
export class DesignersModule {}
