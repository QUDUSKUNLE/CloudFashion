import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';

import { ProductDocument } from '../../products/models/products.schema';
import { CreateOrderInput } from '../orders/dto/create-order.input';

@Injectable()
export class HelperService {
  async orderValidations(
    createOrderInput: CreateOrderInput,
    model: typeof Model,
  ) {
    const ProductIDs: string[] = createOrderInput.OrderDetails.reduce(
      (acc, prev) => {
        acc.push(prev.ProductID);
        return acc;
      },
      [],
    );
    const Products: ProductDocument[] = await model
      .find({
        ProductID: { $in: ProductIDs },
      })
      .select({ ProductID: 1 });
    if (Products.length > 0) {
      const NotFoundProducts = createOrderInput.OrderDetails.filter(
        (prev) =>
          !Products.find((product) => product.ProductID === prev.ProductID),
      );
      if (NotFoundProducts.length > 0)
        throw new UnprocessableEntityException(
          NotFoundProducts,
          `Product\'s details ${JSON.stringify(NotFoundProducts)} not found.`,
        );
      return await true;
    }
    throw new UnprocessableEntityException(
      createOrderInput.OrderDetails,
      `Product\'s details ${JSON.stringify(
        createOrderInput.OrderDetails,
      )} not found.`,
    );
  }
}
