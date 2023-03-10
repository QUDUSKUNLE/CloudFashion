import * as redis from 'cache-manager-redis-store';
import GraphQLJSON from 'graphql-type-json';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesGuard } from 'src/roles.guard';
import { DesignersModule } from './clients/designers/designers.module';
import { UsersModule } from './clients/users/users.module';
import { VendorsModule } from './clients/vendors/vendors.module';
import { InvoiceModule } from './services/invoice/invoice.module';
import { InvoiceService } from './services/invoice/invoice.service';
import { AuthModule } from './services/auth/auth.module';
import { ClothingModule } from './services/clothing/clothing.module';
import { OrdersModule } from './services/orders/orders.module';
import { PaymentsModule } from './services/payments/payments.module';
import { ProductsModule } from './services/products/products.module';
import { QueueModule } from './services/queue/queue.module';
import { RedisCacheModule } from './services/redis-cache/redis-cache.module';
import { ShipmentsModule } from './services/shipments/shipments.module';
import { StacksModule } from './services/stack/stack.module';
import { TerminalService } from './services/terminal/terminal.service';
import { YoutubeModule } from './services/youtube/youtube.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_UR'),
      }),
    }),
    CacheModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redis,
        host: configService.get<string>('REDIS_HOST'),
        username: configService.get<string>('REDSIS_USERNAME'),
        // password: configService.get<string>('REDIS_PASSWORD'),
        port: +configService.get<string>('REDIS_PORT'),
      }),
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: +configService.get<string>('REDIS_PORT'),
        },
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      resolvers: {
        JSON: GraphQLJSON,
      },
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req }) => ({ req }),
      debug: true,
      playground: true,
      autoSchemaFile: 'schema.gql',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: +configService.get<string>('THROTTLE_TTL'),
        limit: +configService.get<string>('THROTTLE_LIMIT'),
      }),
    }),
    VendorsModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    RedisCacheModule,
    PaymentsModule,
    ShipmentsModule,
    YoutubeModule,
    QueueModule,
    DesignersModule,
    ClothingModule,
    InvoiceModule,
    StacksModule,
  ],
  controllers: [],
  providers: [
    InvoiceService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    TerminalService,
  ],
  exports: [MongooseModule],
})
export class AppModule {}
