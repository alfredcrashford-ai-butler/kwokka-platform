import { injectable } from 'inversify';
import NodeCache from 'node-cache';

const CACHE_EXPIRY_IN_SECONDS = 120; // 2m

@injectable()
export class CacheService {
  private cache: NodeCache;

  public constructor() {
    this.cache = new NodeCache({ stdTTL: CACHE_EXPIRY_IN_SECONDS, useClones: false });
  }

  public set<T>(prefix: string, key: string, value: T) {
    const cacheKey = `${prefix}${key}`;
    this.cache.set<T>(cacheKey, value);
  }

  public get<T>(prefix: string, key: string): T {
    const cacheKey = `${prefix}${key}`;
    const value = this.cache.get<T>(cacheKey);
    return value;
  }

  public delete(prefix: string, key: string): void {
    const cacheKey = `${prefix}${key}`;
    this.cache.del(cacheKey);
  }
}
