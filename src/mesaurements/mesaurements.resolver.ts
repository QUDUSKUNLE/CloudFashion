import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MesaurementsService } from './mesaurements.service';
import { Mesaurement } from './entities/mesaurement.entity';
import { CreateMesaurementInput } from './dto/create-mesaurement.input';
import { UpdateMesaurementInput } from './dto/update-mesaurement.input';

@Resolver(() => Mesaurement)
export class MesaurementsResolver {
  constructor(private readonly mesaurementsService: MesaurementsService) {}

  @Mutation(() => Mesaurement)
  createMesaurement(
    @Args('createMesaurementInput')
    createMesaurementInput: CreateMesaurementInput,
  ) {
    return this.mesaurementsService.create(createMesaurementInput);
  }

  @Query(() => [Mesaurement], { name: 'mesaurements' })
  findAll() {
    return this.mesaurementsService.findAll();
  }

  @Query(() => Mesaurement, { name: 'mesaurement' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mesaurementsService.findOne(id);
  }

  @Mutation(() => Mesaurement)
  updateMesaurement(
    @Args('updateMesaurementInput')
    updateMesaurementInput: UpdateMesaurementInput,
  ) {
    return this.mesaurementsService.update(
      updateMesaurementInput.id,
      updateMesaurementInput,
    );
  }

  @Mutation(() => Mesaurement)
  removeMesaurement(@Args('id', { type: () => Int }) id: number) {
    return this.mesaurementsService.remove(id);
  }
}
