import type { CacheFileMeta } from './cache-file-meta';

export enum CacheWorkerIncomingMessage {
  CacheFiles = 'cache_files',
  ClearCache = 'clear_cache',
  GetCachedFileHash = 'get_cached_file_hash',
}

export enum CacheWorkerOutgoingMessage {
  CachingStarted = 'caching_started',
  CachingProgressed = 'caching_progressed',
  CachingDone = 'caching_done',
  CachingError = 'caching_error',
  CacheDeleted = 'cache_deleted',
  GetCachedFileHashResponse = 'get_cached_file_hash_response',
  GetCachedFileHashError = 'get_cached_file_hash_error',
  Log = 'log',
}

export interface CacheWorkerMessage<T = CacheWorkerIncomingMessage | CacheWorkerOutgoingMessage> {
  type: T;
  cacheName: string;
  payload: any;
}

export type CachingProcessPayload = { processId: string; files: CacheFileMeta[] };
