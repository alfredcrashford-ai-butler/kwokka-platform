import { injectable } from 'inversify';
import { UuidUtil } from '@kwokka/utils';

export type NotificationType = 'error' | 'info' | 'success';

export interface NotificationParams {
  text: string;
  type: NotificationType;
}

export type NotificationSubscriber = (NotificationParams) => any;

@injectable()
export class NotificationService {
  private subscriptionMap: { [id: string]: NotificationSubscriber } = {};

  public show(params: NotificationParams): boolean {
    const subscribers = Object.values(this.subscriptionMap);

    if (!subscribers.length) {
      throw new Error('There are no consumers for NotificationService');
    }

    subscribers.forEach((subscriber) => subscriber(params));

    return true;
  }

  public showErrors(errors: Error[]): boolean {
    errors.forEach((el: any) =>
      this.show({
        text: el.code ? `error.${el.code}` : el.message,
        type: 'error',
      }),
    );

    return true;
  }

  public subscribe(subscriber: NotificationSubscriber): Function {
    const id = UuidUtil.generate();
    this.subscriptionMap[id] = subscriber;
    return () => {
      delete this.subscriptionMap[id];
    };
  }

  public clearConsumersMap(): boolean {
    this.subscriptionMap = {};
    return true;
  }
}
