import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductsModule } from '../../products/products.module';
import { YoutubeModule } from '../youtube/youtube.module';
import { HalalMarketConsumer } from './queue.consumer';
import { QueueService } from './queue.service';

@Module({
  imports: [
    YoutubeModule,
    forwardRef(() => ProductsModule),
    BullModule.registerQueue({ name: 'halalmarket' }),
  ],
  providers: [QueueService, HalalMarketConsumer, PrismaService],
  exports: [QueueService, HalalMarketConsumer],
})
export class QueueModule {}
