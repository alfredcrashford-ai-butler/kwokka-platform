import { injectable } from 'inversify';

export interface Trace {
  accountId: string;
  // spanNo: number;
  // lamportValue: number;
  // traceId: string;
}

export class Message<T = any> {
  public constructor(
    public readonly event: string,
    public readonly payload: T,
  ) {}

  public serialize(): string {
    return JSON.stringify({ event: this.event, payload: this.payload });
  }

  public static deserialize(data: string): Message {
    const message = JSON.parse(data);
    return new Message(message.event, message.payload);
  }
}

export type Subscriber = (payload: Message, metadata: MessageMetadata) => any | Promise<any>;

export interface Subscription {
  unsubscribe(): Promise<void>;
}

export interface SubscribeConfig {
  fromBeginning?: boolean;
  groupId: string;
}

export interface MessageMetadata {
  publisher: string;
  trace: Trace;
  timestamp?: number;
  messageId?: string;
}

export interface BroadcastResult {
  messageId: string;
}

@injectable()
export abstract class MessageService {
  public abstract subscribe(topic: string, subscriber: Subscriber, config: SubscribeConfig): Promise<Subscription>;
  public abstract broadcast(topic: string, message: Message, metadata: MessageMetadata): Promise<BroadcastResult>;
}
