import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger';
import { Message, MessageMetadata, MessageService, SubscribeConfig, Subscription } from './message.service';

@injectable()
export abstract class MessageConsumer {
  private _logger: LoggerService;
  protected subscription: Subscription;
  protected readonly logPrefix = `${this.constructor.name}:`;
  protected abstract readonly topic: string;
  protected abstract readonly subscribeConfig: SubscribeConfig;

  @inject(MessageService)
  protected messageService: MessageService;

  @inject(LoggerService)
  private loggerService: LoggerService;

  public teardown(): void {
    this.subscription?.unsubscribe();
  }

  public async setupSubscription() {
    this.subscription = await this.messageService.subscribe(
      this.topic,
      this.tryHandle.bind(this),
      this.subscribeConfig,
    );
  }

  protected abstract handle(message: Message, metadata: MessageMetadata): any | Promise<any>;

  private async tryHandle(message: Message, metadata: MessageMetadata): Promise<any> {
    try {
      this.logger.info(`Received message, topic: ${this.topic}, message: ${message.serialize()}`);
      await this.handle(message, metadata);
      this.logger.info(`Handled message, topic: ${this.topic}, message: ${message.serialize()}`);
    } catch (e: unknown) {
      this.logger.error(`Failed to handle message, topic: ${this.topic}, message: ${message.serialize()}, error: `, e);
    }
  }

  protected get logger(): LoggerService {
    if (!this._logger) {
      this._logger = this.loggerService.withPrefix(this.logPrefix);
    }
    return this._logger;
  }
}
