import { inject, injectable } from 'inversify';
import { MessageService, Message, MessageMetadata } from './message.service';
import { LoggerService } from '../logger';

@injectable()
export abstract class MessageProducer {
  private _logger: LoggerService;
  protected readonly logPrefix = `${this.constructor.name}:`;

  @inject(MessageService)
  protected messageService: MessageService;

  @inject(LoggerService)
  private loggerService: LoggerService;

  protected async broadcast(topic: string, message: Message, metadata?: MessageMetadata): Promise<void> {
    try {
      this.logger.info(`Sending message to topic: ${topic}, message: ${message.serialize()}`);
      const { messageId } = await this.messageService.broadcast(topic, message, metadata);
      this.logger.info(`Sent message to topic: ${topic}, message: ${message.serialize()}, messageId: ${messageId}`);
    } catch (e: unknown) {
      this.logger.error(`Failed to send message to topic: ${topic}, message: ${message.serialize()}, error: `, e);
    }
  }

  private get logger(): LoggerService {
    if (!this._logger) {
      this._logger = this.loggerService.withPrefix(this.logPrefix);
    }
    return this._logger;
  }
}
