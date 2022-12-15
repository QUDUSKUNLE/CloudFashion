import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from 'src/services/products/products.module';
import { YoutubeModule } from 'src/services/youtube/youtube.module';
import { HalalMarketConsumer } from './queue.consumer';
import { QueueService } from './queue.service';

@Module({
  imports: [
    YoutubeModule,
    forwardRef(() => OrdersModule),
    forwardRef(() => ProductsModule),
    BullModule.registerQueue({ name: 'halalmarket' }),
  ],
  providers: [QueueService, HalalMarketConsumer],
  exports: [QueueService, HalalMarketConsumer],
})
export class QueueModule {}
