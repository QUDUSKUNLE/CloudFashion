import { Module } from '@nestjs/common';
import { StackService } from './stack.service';

@Module({
  providers: [StackService],
  exports: [StackService],
})
export class StacksModule {}
