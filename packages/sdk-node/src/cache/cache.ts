import NodeCache from 'node-cache';

export class Cache {
  private cache: NodeCache;
  private ttlMs = 120000;

  public constructor() {
    this.cache = new NodeCache({ useClones: false });
  }

  public set<T>(key: string, value: T) {
    this.cache.set<T>(key, value, this.ttlMs / 1000);
  }

  public get<T>(key: string): T {
    const value = this.cache.get<T>(key);
    return value;
  }

  public delete(key: string): void {
    this.cache.del(key);
  }

  public setTtl(ttlMs: number): void {
    this.ttlMs = ttlMs;
  }
}
