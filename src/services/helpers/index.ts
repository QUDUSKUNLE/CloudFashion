import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderInput } from '../orders/dto/create-order.input';

@Injectable()
export class HelperService {
  constructor(private readonly prismaService: PrismaService) {}
  async orderValidations(createOrderInput: CreateOrderInput) {
    const ProductIDs = createOrderInput.OrderDetails.reduce<
      { ProductID: string }[]
    >((acc, prev) => {
      acc.push({ ProductID: prev.ProductID });
      return acc;
    }, []);
    const Products = await this.prismaService.products.findMany({
      where: { OR: ProductIDs },
    });
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
