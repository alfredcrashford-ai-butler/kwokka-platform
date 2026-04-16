import { injectable } from 'inversify';
import Schedule, { Job } from 'node-schedule';
import { UuidUtil } from '@kwokka/utils';

@injectable()
export class ScheduleService {
  private readonly jobs: { [id in string]: Job } = {};

  public schedule(crontab: string, fn: () => void): string {
    const job = Schedule.scheduleJob(crontab, fn);
    const uuid = UuidUtil.generate();
    this.jobs[uuid] = job;
    return uuid;
  }

  public cancel(uuid: string): void {
    const job = this.jobs[uuid];
    if (!job) {
      return;
    }
    job.cancel();
  }
}
