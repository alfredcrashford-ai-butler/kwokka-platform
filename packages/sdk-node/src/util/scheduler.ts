import Schedule, { Job } from 'node-schedule';
import { UuidUtil } from '@kwokka/utils';

export class Scheduler {
  private readonly jobs: Record<string, Job> = {};

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

  public cancelAll(): void {
    Object.keys(this.jobs).forEach((uuid) => this.cancel(uuid));
  }
}
