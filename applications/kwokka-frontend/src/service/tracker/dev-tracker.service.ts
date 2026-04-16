/* eslint-disable no-console */
import { inject, injectable } from 'inversify';
import { LoggerService } from '@/service/logger/logger.service';
import { UserEntity } from '@/entity/user.entity';
import { TrackerService } from './tracker.service';

const DEV_TRACKER_TOKEN = '[DevTrackerServiceImpl]';
const SETUP_MESSAGE =
  '[DevTrackerServiceImpl] development tracker has been successfully initialized. Verify this message does not appear in production';

@injectable()
export class DevTrackerServiceImpl extends TrackerService {
  public constructor(@inject(LoggerService) private logger: LoggerService) {
    super();
    this.print(SETUP_MESSAGE);
  }

  public event(category: string, name: string, params?: object) {
    this.print(`${DEV_TRACKER_TOKEN} category: ${category}, event: ${name}, params: ${JSON.stringify(params)}`);
  }

  public pageView(page: string, location: string) {
    this.print(`${DEV_TRACKER_TOKEN} pageView: ${page}, location: ${location}`);
  }

  public setUser(user: UserEntity) {
    this.print(`${DEV_TRACKER_TOKEN} setUser: ${user.id}`);
  }

  private print(str: string) {
    const styles = 'color: lightblue; background-color: black; display: inline-block; padding: 4px;';
    this.logger.log(`%c${str}`, styles);
  }
}
