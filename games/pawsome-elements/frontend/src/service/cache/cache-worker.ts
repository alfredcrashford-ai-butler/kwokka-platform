import { md5 } from 'hash-wasm';
import type { CacheFileMeta } from './cache-file-meta';
import { type CacheWorkerMessage, CacheWorkerIncomingMessage, CacheWorkerOutgoingMessage } from './cache-message';

function isCacheSupported(): boolean {
  return !!globalThis.caches;
}

function postCachingStartedMessage(cacheName: string, processId: string): void {
  postMessage({ type: CacheWorkerOutgoingMessage.CachingStarted, cacheName, payload: { processId } });
}

function postCachingProgressedMessage(cacheName: string, processId: string, path: string): void {
  postMessage({ type: CacheWorkerOutgoingMessage.CachingProgressed, cacheName, payload: { processId, path } });
}

function postCachingDoneMessage(cacheName: string, processId: string): void {
  postMessage({ type: CacheWorkerOutgoingMessage.CachingDone, cacheName, payload: { processId } });
}

function postGetCachedFileHashResponseMessage(cacheName: string, hash: string, opId: string): void {
  postMessage({ type: CacheWorkerOutgoingMessage.GetCachedFileHashResponse, cacheName, payload: { hash, opId } });
}

function postGetCachedFileHashErrorMessage(cacheName: string, error: any, opId: string): void {
  postMessage({ type: CacheWorkerOutgoingMessage.GetCachedFileHashError, cacheName, payload: { error, opId } });
}

function postCacheDeletedMessage(cacheName: string, keys: string[]): void {
  postMessage({ type: CacheWorkerOutgoingMessage.CacheDeleted, cacheName, payload: { keys } });
}

function postCachingErrorMessage(cacheName: string, error: any, processId: string): void {
  postMessage({ type: CacheWorkerOutgoingMessage.CachingError, cacheName, payload: { processId, error } });
}

function log(cacheName: string, ...args: any[]): void {
  postMessage({ type: CacheWorkerOutgoingMessage.Log, cacheName, payload: { args } });
}

function postMessage(message: CacheWorkerMessage<CacheWorkerOutgoingMessage>): void {
  self.postMessage(message);
}

async function cacheFiles(cacheName: string, payload: { processId: string; files: CacheFileMeta[] }): Promise<void> {
  let cache: Cache;
  try {
    postCachingStartedMessage(cacheName, payload.processId);
    if (isCacheSupported()) {
      cache = await caches.open(cacheName);
    }
    const promises = payload.files.map(async (file) => {
      if (isCacheSupported()) {
        await cache.delete(file.path);
        await cache.add(file.path);
      }
      postCachingProgressedMessage(cacheName, payload.processId, file.path);
    });

    await Promise.all(promises);

    postCachingDoneMessage(cacheName, payload.processId);
  } catch (e: any) {
    postCachingErrorMessage(cacheName, e, payload.processId);
  }
}

async function clearCache(cacheName: string, keys: string[]): Promise<void> {
  if (isCacheSupported()) {
    const cache = await caches.open(cacheName);
    await Promise.all(keys.map((key) => cache.delete(key)));
  }

  postCacheDeletedMessage(cacheName, keys);
}

async function getCachedFileHash(cacheName: string, key: string, opId: string): Promise<void> {
  try {
    if (!isCacheSupported()) {
      postGetCachedFileHashResponseMessage(cacheName, null, opId);
      return;
    }

    const cache = await caches.open(cacheName);
    const response = await cache.match(key);
    if (!response) {
      postGetCachedFileHashResponseMessage(cacheName, null, opId);
      return;
    }

    // Using blob instead of .bytes() because bytes can be unsupported in older browsers
    // Fixed in: https://mygameapp.atlassian.net/browse/KWOKKA-586
    const blob = await (response as any).blob();
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const hash = await md5(bytes);
    postGetCachedFileHashResponseMessage(cacheName, hash, opId);
  } catch (e: any) {
    postGetCachedFileHashErrorMessage(cacheName, e, opId);
  }
}

self.onmessage = function (e: MessageEvent<CacheWorkerMessage<CacheWorkerIncomingMessage>>) {
  if (e.data.type === CacheWorkerIncomingMessage.CacheFiles) {
    cacheFiles(e.data.cacheName, e.data.payload);
  } else if (e.data.type === CacheWorkerIncomingMessage.ClearCache) {
    clearCache(e.data.cacheName, e.data.payload.keys);
  } else if (e.data.type === CacheWorkerIncomingMessage.GetCachedFileHash) {
    getCachedFileHash(e.data.cacheName, e.data.payload.key, e.data.payload.opId);
  }
};
