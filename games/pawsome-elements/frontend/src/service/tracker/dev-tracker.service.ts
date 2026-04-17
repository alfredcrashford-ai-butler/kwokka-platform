import { inject, injectable } from 'inversify';
import { TrackerService } from './tracker.service';
import { DebugTrackerWorker, TrackerWorker } from './worker';

@injectable()
export class DevTrackerService extends TrackerService {
  public override readonly workers: TrackerWorker[];

  public constructor(@inject(DebugTrackerWorker) private debugTrackerWorker: DebugTrackerWorker) {
    super();
    this.workers = [this.debugTrackerWorker];
  }
}
