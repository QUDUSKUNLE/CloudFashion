import { Test, TestingModule } from '@nestjs/testing';
import { MesaurementsResolver } from './mesaurements.resolver';
import { MesaurementsService } from './mesaurements.service';

describe('MesaurementsResolver', () => {
  let resolver: MesaurementsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MesaurementsResolver, MesaurementsService],
    }).compile();

    resolver = module.get<MesaurementsResolver>(MesaurementsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
