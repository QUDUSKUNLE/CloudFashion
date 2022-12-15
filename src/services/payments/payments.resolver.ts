import * as express from 'express';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from 'src/common/interface';
import { GraphRequest, Roles } from 'src/user.decorator';
import { FindPaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { Payment } from './models/payment.schema';
import { PaymentsService } from './payments.service';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(UserRole.USER)
  @Query(() => [Payment], { name: 'GetPayments' })
  findAll(@GraphRequest() req: express.Request) {
    return this.paymentsService.findAll(req);
  }

  @Roles(UserRole.USER)
  @Query(() => Payment, { name: 'GetAPayment' })
  findOne(
    @Args('findPaymentInput', { type: () => FindPaymentInput })
    findPaymentInput: FindPaymentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.paymentsService.findOne(findPaymentInput.PaymentID, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Payment, { name: 'UpdateAPayment' })
  updatePayment(
    @Args('updatePaymentInput', { type: () => UpdatePaymentInput })
    updatePaymentInput: UpdatePaymentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.paymentsService.update(updatePaymentInput, req);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Payment, { name: 'DeleteAPayment' })
  removePayment(
    @Args('findPaymentInput', { type: () => FindPaymentInput })
    findPaymentInput: FindPaymentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.paymentsService.remove(findPaymentInput.PaymentID, req);
  }
}
