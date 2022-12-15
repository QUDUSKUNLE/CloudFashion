import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/clients/users/users.module';
import { AuthService } from './auth.service';
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
    UsersModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
