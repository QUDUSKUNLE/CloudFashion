import { Test, TestingModule } from '@nestjs/testing';
import { ClothingResolver } from './clothing.resolver';
import { ClothingService } from './clothing.service';

describe('ClothingResolver', () => {
  let resolver: ClothingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClothingResolver, ClothingService],
    }).compile();

    resolver = module.get<ClothingResolver>(ClothingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
