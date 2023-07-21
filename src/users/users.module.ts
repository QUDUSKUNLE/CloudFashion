import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../services/auth/auth.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UsersResolver, UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
