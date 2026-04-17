import { inject, injectable } from 'inversify';
import { CacheProcess, CacheService, type CacheFileMeta } from '../cache';
import { ConfigService } from '../config';

export interface ResourcesToCacheInfo {
  files: CacheFileMeta[];
  size: number;
  count: number;
}

@injectable()
export class ResourceCacheService {
  private filesMeta: CacheFileMeta[] = JSON.parse(import.meta.env.VITE_APP_RESOURCES_META || '[]');

  public get cacheName(): string {
    return this.configService.frontendConfig.resourcesCacheName;
  }

  public constructor(
    @inject(CacheService) private cacheService: CacheService,
    @inject(ConfigService) private configService: ConfigService,
  ) {}

  public open(): void {
    this.cacheService.open();
  }

  public close(): void {
    this.cacheService.close();
  }

  public async getResourcesToCacheInfo(): Promise<ResourcesToCacheInfo> {
    if (!this.cacheService.isCacheSupported) {
      return { files: [], size: 0, count: 0 };
    }

    const files = await this.getFilesToCache();
    const size = files.map((el) => el.size).reduce((sum, size) => sum + size, 0);
    const count = files.length;
    return { files, size, count };
  }

  public async clearUnusedResourcesCache(): Promise<void> {
    if (!this.cacheService.isCacheSupported) {
      return;
    }

    const cachedKeys = await this.cacheService.getCacheKeys(this.cacheName);
    const resourcesKeys = this.filesMeta.map((el) => el.path);
    const danglingKeys = cachedKeys.filter((key) => !resourcesKeys.includes(key));
    this.cacheService.clearCache(this.cacheName, danglingKeys);
  }

  public async cacheResources(): Promise<CacheProcess> {
    const files = await this.getFilesToCache();
    return this.cacheService.cacheFiles(this.cacheName, files);
  }

  public async requestPersistentStorage(): Promise<boolean> {
    if (navigator.storage && navigator.storage.persist) {
      return await navigator.storage.persist();
    }
  }

  private async getFilesToCache(): Promise<CacheFileMeta[]> {
    const cachedKeys = await this.cacheService.getCacheKeys(this.cacheName);
    const keyHashes: Record<string, string> = {};
    await Promise.all(
      cachedKeys.map(async (key) => (keyHashes[key] = await this.cacheService.getCacheHash(this.cacheName, key))),
    );
    return this.filesMeta.filter((el) => !cachedKeys.includes(el.path) || keyHashes[el.path] !== el.hash);
  }
}
