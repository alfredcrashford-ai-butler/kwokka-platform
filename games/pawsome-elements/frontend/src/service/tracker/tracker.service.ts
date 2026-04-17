import { injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import type { TrackingCategory, TrackingEvent } from './tracking-config';
import type { TrackerWorker } from './worker';

@injectable()
export abstract class TrackerService {
  public abstract get workers(): TrackerWorker[];

  public setup(): void {
    this.workers.forEach((worker) => worker.setup());
  }

  public event(category: TrackingCategory, name: TrackingEvent, params?: object): void {
    this.workers.forEach((worker) => worker.event(category, name, params));
  }

  public pageView(page: string, location: string): void {
    this.workers.forEach((worker) => worker.pageView(page, location));
  }

  public setUser(user: ProfileEntity): void {
    this.workers.forEach((worker) => worker.setUser(user));
  }
}
