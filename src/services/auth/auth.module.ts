import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../../users/users.module';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [
    RedisCacheModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
