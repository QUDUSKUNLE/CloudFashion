import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as express from 'express';
import { Role } from '../../common/interface';
import { GraphRequest, Roles } from '../../common/user.decorator';
import { FindPaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { Payment } from './models/payment.schema';
import { PaymentsService } from './payments.service';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(Role.USER)
  @Query(() => [Payment], { name: 'GetPayments' })
  findAll(@GraphRequest() req: express.Request) {
    return this.paymentsService.findAll(req);
  }

  @Roles(Role.USER)
  @Query(() => Payment, { name: 'GetPayment' })
  findOne(
    @Args('findPaymentInput', { type: () => FindPaymentInput })
    findPaymentInput: FindPaymentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.paymentsService.findOne(findPaymentInput.PaymentID, req);
  }

  @Roles(Role.USER)
  @Mutation(() => Payment, { name: 'UpdatePayment' })
  updatePayment(
    @Args('updatePaymentInput', { type: () => UpdatePaymentInput })
    updatePaymentInput: UpdatePaymentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.paymentsService.update(updatePaymentInput, req);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Payment, { name: 'DeletePayment' })
  removePayment(
    @Args('findPaymentInput', { type: () => FindPaymentInput })
    findPaymentInput: FindPaymentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.paymentsService.remove(findPaymentInput.PaymentID, req);
  }
}
