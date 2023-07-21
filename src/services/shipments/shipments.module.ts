import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './models/shipments.schema';
import { ShipmentsResolver } from './shipments.resolver';
import { ShipmentsService } from './shipments.service';

import { OrdersModule } from '../orders/orders.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    forwardRef(() => OrdersModule),
    QueueModule,
  ],
  providers: [ShipmentsResolver, ShipmentsService],
  exports: [ShipmentsService, MongooseModule],
})
export class ShipmentsModule {}
