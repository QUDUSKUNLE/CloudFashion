import * as cache from 'cache-manager';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: cache.Cache) {}

  async set(key: string, data: unknown): Promise<void> {
    await this.cacheManager.set(
      `${process.env.PROJECT_IDENTITY}${key}`,
      JSON.stringify(data),
      604800,
    );
  }

  async get(key: string): Promise<string> {
    return await this.cacheManager.get(`${process.env.PROJECT_IDENTITY}${key}`);
  }

  async delete(key): Promise<void> {
    await this.cacheManager.del(`${process.env.PROJECT_IDENTITY}${key}`);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }
}
