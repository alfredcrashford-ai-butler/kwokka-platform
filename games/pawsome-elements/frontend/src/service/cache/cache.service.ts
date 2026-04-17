import { inject, injectable } from 'inversify';
import { UuidUtil } from '@kwokka/utils';
import Worker from './cache-worker?worker';
import { CacheWorkerIncomingMessage, CacheWorkerOutgoingMessage, type CacheWorkerMessage } from './cache-message';
import { LoggerService } from '../logger';
import { CacheProcess } from './cache-process';
import type { CacheFileMeta } from './cache-file-meta';

type CacheHashOperationHandle = { path: string; resolve?: (hash: string) => any; reject?: (e: any) => any };

@injectable()
export class CacheService {
  private cachedKeys: string[] = [];
  private worker: Worker;
  private processes: Record<string, CacheProcess> = {};
  private cacheHashOperations: Record<string, CacheHashOperationHandle> = {};

  public constructor(@inject(LoggerService) private logger: LoggerService) {
    this.logger = this.logger.withPrefix('#CacheService:');
  }

  public open(): void {
    this.close();
    this.worker = new Worker();
    this.worker.onmessage = (e: MessageEvent<CacheWorkerMessage<CacheWorkerOutgoingMessage>>) => this.onMessage(e.data);
  }

  public close(): void {
    this.worker?.terminate();
  }

  public get isCacheSupported(): boolean {
    return !!window.caches;
  }

  public cacheFiles(cacheName: string, files: CacheFileMeta[]): CacheProcess {
    const process = new CacheProcess(files);
    this.processes[process.id] = process;
    if (!this.isCacheSupported) {
      this.cachedKeys = files.map((el) => el.path);
    }

    this.postMessage({
      type: CacheWorkerIncomingMessage.CacheFiles,
      cacheName,
      payload: { processId: process.id, files },
    });

    return process;
  }

  public async clearAll(): Promise<void> {
    if (!this.isCacheSupported) {
      return;
    }

    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  public clearCache(cacheName: string, keys: string[]): void {
    this.postMessage({
      type: CacheWorkerIncomingMessage.ClearCache,
      cacheName,
      payload: { keys },
    });
  }

  public async getCacheKeys(cacheName: string): Promise<string[]> {
    if (!this.isCacheSupported) {
      return this.cachedKeys;
    }

    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    return keys.map((el) => new URL(el.url).pathname);
  }

  public async getCacheHash(cacheName: string, path: string): Promise<string> {
    const opId = UuidUtil.generate();
    const handle: CacheHashOperationHandle = { path };
    this.cacheHashOperations[opId] = handle;
    return new Promise((resolve, reject) => {
      handle.resolve = resolve;
      handle.reject = reject;
      this.postMessage({ type: CacheWorkerIncomingMessage.GetCachedFileHash, cacheName, payload: { key: path, opId } });
    });
  }

  private postMessage(message: CacheWorkerMessage<CacheWorkerIncomingMessage>): void {
    this.worker.postMessage(message);
  }

  private onMessage(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    this.logger.debug(`Got message with type "${message.type}".`);
    if (message.type === CacheWorkerOutgoingMessage.CachingStarted) {
      this.onCachingStarted(message);
    } else if (message.type === CacheWorkerOutgoingMessage.CachingProgressed) {
      this.onCachingProgressed(message);
    } else if (message.type === CacheWorkerOutgoingMessage.CachingDone) {
      this.onCachingDone(message);
    } else if (message.type === CacheWorkerOutgoingMessage.CachingError) {
      this.onCachingError(message);
    } else if (message.type === CacheWorkerOutgoingMessage.CacheDeleted) {
      this.onCacheDeleted(message);
    } else if (message.type === CacheWorkerOutgoingMessage.GetCachedFileHashResponse) {
      this.onCachedFileHashResponse(message);
    } else if (message.type === CacheWorkerOutgoingMessage.GetCachedFileHashError) {
      this.onCachedFileHashError(message);
    } else if (message.type === CacheWorkerOutgoingMessage.Log) {
      this.onLog(message);
    } else {
      this.logger.warn(`Message handler does not exist for message with type "${message.type}".`);
    }
  }

  private onCachingStarted(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const processId = message.payload.processId;
    const process = this.processes[processId];
    const count = process.fileCount;
    const size = process.displayFileSize;
    this.logger.debug(`Caching started, processId: ${processId}, files: ${count}, size: ${size}.`);
  }

  private onCachingProgressed(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const processId = message.payload.processId;
    const process = this.processes[processId];
    process.setFileCached(message.payload.path);
    const count = process.displayProgressFileCount;
    const size = process.displayProgressFileSize;
    const progress = process.displayProgress;
    this.logger.debug(`Caching progressed (${progress}), processId: ${processId}, files: ${count}, size: ${size}.`);
  }

  private onCachingDone(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const processId = message.payload.processId;
    const process = this.processes[processId];
    const count = process.fileCount;
    const size = process.displayFileSize;
    this.logger.debug(`Caching done, processId: ${processId}, files: ${count}, size: ${size}.`);
    delete this.processes[processId];
  }

  private onCachingError(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const processId = message.payload.processId;
    const process = this.processes[processId];
    process.setError(message.payload.error);
    this.logger.error(`Caching error, processId: ${processId}, error:`, message.payload.error);
    delete this.processes[processId];
  }

  private onCacheDeleted(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const cacheName = message.cacheName;
    const keys = message.payload.keys;
    this.logger.debug(`Caches deleted, cacheName: ${cacheName}, keys: ${keys}.`);
  }

  private onCachedFileHashResponse(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const handle = this.cacheHashOperations[message.payload.opId];
    this.logger.log('getCacheHash finished, path:', handle.path);
    handle.resolve(message.payload.hash);
  }

  private onCachedFileHashError(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const handle = this.cacheHashOperations[message.payload.opId];
    handle.reject(message.payload.error);
  }

  private onLog(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
    const logger = this.logger.withPrefix('#CacheWorker: ');
    logger.debug(...message.payload.args);
  }
}
