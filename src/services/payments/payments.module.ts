import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsModule } from '../../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { QueueModule } from '../queue/queue.module';
import { Payment, PaymentSchema } from './models/payment.schema';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    AuthModule,
    forwardRef(() => ProductsModule),
    QueueModule,
  ],
  providers: [PaymentsResolver, PaymentsService],
  exports: [PaymentsService, MongooseModule],
})
export class PaymentsModule {}
