import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueJobs } from './queue.enums';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('halalmarket') private halalMarketQueue: Queue) {}

  QueueJobs(job: unknown, queueJob: QueueJobs) {
    this.halalMarketQueue.add(queueJob, job, {
      delay: 2000,
      lifo: true,
      attempts: 1,
      removeOnComplete: true,
    });
  }
}
