import Schedule, { Job } from 'node-schedule';
import { UuidUtil } from '@kwokka/utils';

export class Scheduler {
  private timeouts: { [id in string]: NodeJS.Timeout } = {};
  private readonly cronjobs: { [id in string]: Job } = {};

  public set(timeoutFn: () => any, timeoutTime: number, id: string): void {
    this.clear(id);
    const timeout = setTimeout(() => {
      delete this.timeouts[id];
      timeoutFn();
    }, timeoutTime);
    this.timeouts[id] = timeout;
  }

  public clear(id: string): void {
    const timeout = this.timeouts[id];
    if (timeout) {
      delete this.timeouts[id];
      clearTimeout(timeout);
    }
  }

  public setCron(crontab: string, fn: () => void): string {
    const job = Schedule.scheduleJob(crontab, fn);
    const uuid = UuidUtil.generate();
    this.cronjobs[uuid] = job;
    return uuid;
  }

  public clearCron(uuid: string): void {
    const job = this.cronjobs[uuid];
    if (job) {
      delete this.cronjobs[uuid];
      job.cancel();
    }
  }
}
