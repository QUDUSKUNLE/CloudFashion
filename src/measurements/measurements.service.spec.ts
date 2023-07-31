import { Test, TestingModule } from '@nestjs/testing';
import { MesaurementsService } from './mesaurements.service';

describe('MesaurementsService', () => {
  let service: MesaurementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MesaurementsService],
    }).compile();

    service = module.get<MesaurementsService>(MesaurementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
