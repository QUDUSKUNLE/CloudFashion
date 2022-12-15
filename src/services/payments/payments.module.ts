import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/services/auth/auth.module';
import { ProductsModule } from 'src/services/products/products.module';
import { QueueModule } from 'src/services/queue/queue.module';
import { Payment, PaymentSchema } from './models/payment.schema';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    AuthModule,
    ProductsModule,
    QueueModule,
  ],
  providers: [PaymentsResolver, PaymentsService],
  exports: [PaymentsService, MongooseModule],
})
export class PaymentsModule {}
