import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';

import { RolesGuard, PrismaService } from './common';
import { CustomersModule } from './customers/customers.module';
import { DesignersModule } from './designers/designers.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './services/auth/auth.module';
import { ClothingModule } from './services/clothing/clothing.module';
import { OrdersModule } from './services/orders/orders.module';
import { PaymentsModule } from './services/payments/payments.module';
import { QueueModule } from './services/queue/queue.module';
import { ShipmentsModule } from './services/shipments/shipments.module';
import { StacksModule } from './services/stack/stack.module';
import { YoutubeModule } from './services/youtube/youtube.module';
import { UsersModule } from './users/users.module';

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
    ProductsModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    PaymentsModule,
    ShipmentsModule,
    YoutubeModule,
    QueueModule,
    DesignersModule,
    ClothingModule,
    StacksModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PrismaService,
  ],
  exports: [MongooseModule],
})
export class AppModule {}
