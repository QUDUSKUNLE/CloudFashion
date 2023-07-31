import { Module } from '@nestjs/common';
import { MesaurementsService } from './mesaurements.service';
import { MesaurementsResolver } from './mesaurements.resolver';

@Module({
  providers: [MesaurementsResolver, MesaurementsService],
})
export class MesaurementsModule {}
