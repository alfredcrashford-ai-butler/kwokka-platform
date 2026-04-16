import { injectable } from 'inversify';

export type DuplexMessageListener<T> = (res: DuplexIncomingMessage<T>) => void;

export interface DuplexIncomingMessage<T> {
  type: 'error' | 'message';
  data?: {
    type: 'game';
    data: T;
  };
  message?: string;
  meta: {
    timestamp: number;
  };
}

export interface DuplexOutgoingMessage {
  actionId: string;
  actionData: any;
}

export interface DuplexConnection<T = any> {
  isOpened(): boolean;
  addMessageListener(listener: (res: DuplexIncomingMessage<T>) => void): void;
  setCloseListener(listener: () => void): void;
  send(req: DuplexOutgoingMessage): void;
  close(): void;
}

@injectable()
export abstract class DuplexManagerService<T> {
  public abstract initConnection(token: string): Promise<DuplexConnection<T>>;
}
