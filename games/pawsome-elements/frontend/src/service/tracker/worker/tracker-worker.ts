import { injectable } from 'inversify';
import { ProfileEntity } from '@kwokka/entities';
import type { TrackingCategory, TrackingEvent } from '../tracking-config';

@injectable()
export abstract class TrackerWorker {
  public abstract setup(): void;
  public abstract event(category: TrackingCategory, name: TrackingEvent, params?: object): void;
  public abstract pageView(page: string, location: string): void;
  public abstract setUser(user: ProfileEntity): void;
}
