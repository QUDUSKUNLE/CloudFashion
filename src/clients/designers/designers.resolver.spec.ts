import { Test, TestingModule } from '@nestjs/testing';
import { DesignersResolver } from './designers.resolver';
import { DesignersService } from './designers.service';

describe('DesignersResolver', () => {
  let resolver: DesignersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignersResolver, DesignersService],
    }).compile();

    resolver = module.get<DesignersResolver>(DesignersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
