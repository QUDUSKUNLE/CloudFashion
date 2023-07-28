import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthModule } from '../services/auth/auth.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UsersResolver, UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
