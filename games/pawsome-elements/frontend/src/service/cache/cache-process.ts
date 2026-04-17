import { UuidUtil } from '@kwokka/utils';
import type { CacheFileMeta } from './cache-file-meta';
import { FileUtil } from '@/util';

export class CacheProcess {
  public readonly id: string = UuidUtil.generate();
  private _progress: number = 0;
  private _progressFileSize: number = 0;
  private _progressFileCount: number = 0;
  private progressHandler: (process: CacheProcess) => any;
  private doneHandler: (process: CacheProcess) => any;
  private errorHandler: (process: CacheProcess, error: any) => any;
  private readonly files: CacheFileMeta[] = [];
  private readonly fileProgressMap: Record<string, boolean> = {};

  public constructor(files: CacheFileMeta[]) {
    this.files = files || [];
    this.fileProgressMap = {};
    this.files.forEach((el) => (this.fileProgressMap[el.path] = false));
  }

  public get fileCount(): number {
    return this.files.length;
  }

  public get fileSize(): number {
    return this.files.map((el) => el.size).reduce((sum, size) => sum + size, 0);
  }

  public get progress(): number {
    return this._progress;
  }

  public get progressFileSize(): number {
    return this._progressFileSize;
  }

  public get progressFileCount(): number {
    return this._progressFileCount;
  }

  public get displayProgress(): string {
    return `${(this.progress * 100).toFixed(2)}%`;
  }

  public get displayProgressFileCount(): string {
    return `${this.progressFileCount}/${this.fileCount}`;
  }

  public get displayFileSize(): string {
    return FileUtil.getDisplayFileSize(this.fileSize);
  }

  public get displayProgressFileSize(): string {
    const displayProgress = FileUtil.getDisplayFileSize(this.progressFileSize);
    const displayTotalSize = FileUtil.getDisplayFileSize(this.fileSize);
    return `${displayProgress}/${displayTotalSize}`;
  }

  public setFileCached(path: string): void {
    if (!this.fileProgressMap[path]) {
      this.fileProgressMap[path] = true;
      this._progressFileSize += this.files.find((el) => el.path === path).size;
      this._progressFileCount += 1;
      this._progress = this._progressFileSize / this.fileSize;
      if (this._progressFileCount === this.fileCount) {
        this.doneHandler?.(this);
      } else {
        this.progressHandler?.(this);
      }
    }
  }

  public setError(error: any): void {
    this.errorHandler?.(this, error);
  }

  public setProgressHandler(handler: (process: CacheProcess) => any): void {
    this.progressHandler = handler;
  }

  public setDoneHandler(handler: (process: CacheProcess) => any): void {
    this.doneHandler = handler;
  }

  public setErrorHandler(handler: (process: CacheProcess, error: any) => any): void {
    this.errorHandler = handler;
  }
}
