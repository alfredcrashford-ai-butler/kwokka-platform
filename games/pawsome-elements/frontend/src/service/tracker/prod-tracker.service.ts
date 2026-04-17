import { inject, injectable } from 'inversify';
import { TrackerService } from './tracker.service';
import { GaTrackerWorker, RybbitTrackerWorker, TrackerWorker } from './worker';

@injectable()
export class ProdTrackerService extends TrackerService {
  public override readonly workers: TrackerWorker[];

  public constructor(
    @inject(GaTrackerWorker) private gaTrackerWorker: GaTrackerWorker,
    @inject(RybbitTrackerWorker) private rybbitTrackerWorker: RybbitTrackerWorker,
  ) {
    super();
    this.workers = [this.gaTrackerWorker, this.rybbitTrackerWorker];
  }
}
