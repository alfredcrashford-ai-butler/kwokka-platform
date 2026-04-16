import { inject, injectable } from 'inversify';
import { UuidUtil } from '@kwokka/utils';
import {
  BroadcastResult,
  Message,
  MessageMetadata,
  MessageService,
  SubscribeConfig,
  Subscriber,
  Subscription,
} from './message.service';
import { IHeaders, Kafka, KafkaConfig, Producer } from 'kafkajs';
import { LoggerService } from '../logger';
import { ConfigService } from '../config';
import { EnvVarName } from '../../../util';

interface KafkaHeaders extends IHeaders {
  publisher: string;
  traceAccountId: string;
  timestamp: string;
  messageId: string;
}

@injectable()
export class KafkaMessageService extends MessageService {
  private _logger: LoggerService;
  private kafka: Kafka;
  private producer: Producer;
  private producerPromise: Promise<void>;
  private readonly kafkaClientId: string;
  private readonly kafkaBrokers: string[];
  private readonly kafkaLogLevel: number;

  public constructor(
    @inject(LoggerService) private loggerService: LoggerService,
    @inject(ConfigService) private configService: ConfigService,
  ) {
    super();
    this.kafkaClientId = this.configService.get(EnvVarName.KafkaClientId);
    this.kafkaBrokers = [
      this.configService.get(EnvVarName.KafkaBroker1),
      this.configService.get(EnvVarName.KafkaBroker2),
      this.configService.get(EnvVarName.KafkaBroker3),
    ];
    this.kafkaLogLevel = +this.configService.get(EnvVarName.KafkaLogLevel);
    this.setupKafka();
    this.producerPromise = this.setupProducer();
  }

  public async subscribe(topic: string, subscriber: Subscriber, config: SubscribeConfig): Promise<Subscription> {
    const consumerConfig = { groupId: config.groupId, allowAutoTopicCreation: true };
    const consumer = this.kafka.consumer(consumerConfig);
    this.logger.info('Kafka consumer is created, groupId:', config.groupId);

    await consumer.connect();
    this.logger.info('Kafka consumer is connected, groupId:', config.groupId);

    await consumer.subscribe({ topics: [topic], fromBeginning: config.fromBeginning || true });
    this.logger.info('Kafka consumer is subscribed to the topic:', topic, ', groupId:', config.groupId);

    await consumer.run({
      eachMessage: async ({ message }) => {
        const deserializedMessage = Message.deserialize(message.value.toString());
        const metadata = this.mapHeadersToMetadata(message.headers as KafkaHeaders);
        await subscriber(deserializedMessage, metadata);
      },
    });

    return {
      async unsubscribe(): Promise<void> {
        await consumer.disconnect();
      },
    };
  }

  public async broadcast(topic: string, message: Message, metadata: MessageMetadata): Promise<BroadcastResult> {
    if (this.producerPromise) {
      await this.producerPromise;
    }
    const headers = this.mapMetadataToHeaders(metadata);
    const serializedMessage = { key: message.event, value: message.serialize(), timestamp: headers.timestamp, headers };
    const messages = [serializedMessage];

    await this.producer.send({ topic, messages });

    return { messageId: headers.messageId };
  }

  private setupKafka(): void {
    const config: KafkaConfig = {
      clientId: this.kafkaClientId,
      brokers: this.kafkaBrokers,
      logLevel: this.kafkaLogLevel,
      logCreator: () => {
        return ({ namespace, level, log }) => {
          const logMethod = level === 4 ? 'info' : level === 2 ? 'warn' : level === 1 ? 'error' : 'debug';
          this.logger[logMethod](`[${namespace}]`, log.message, `(groupId: ${log.groupId})`);
        };
      },
    };
    this.kafka = new Kafka(config);
    this.logger.info('Kafka is set up, config:', config);
  }

  private async setupProducer(): Promise<void> {
    const config = { allowAutoTopicCreation: true };
    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.logger.info('Producer is connected, config:', config);
    this.producerPromise = null;
  }

  private mapMetadataToHeaders(metadata: MessageMetadata): KafkaHeaders {
    return {
      publisher: metadata.publisher,
      traceAccountId: metadata.trace.accountId,
      timestamp: (metadata.timestamp || Date.now()).toString(),
      messageId: metadata.messageId || UuidUtil.generateNoSpecialSymbols(),
    };
  }

  private mapHeadersToMetadata(headers: KafkaHeaders): MessageMetadata {
    return {
      publisher: headers.publisher.toString(),
      trace: {
        accountId: headers.traceAccountId.toString(),
      },
      timestamp: Number.parseInt(headers.timestamp.toString()),
      messageId: headers.messageId.toString(),
    };
  }

  private get logger(): LoggerService {
    if (!this._logger) {
      this._logger = this.loggerService.withPrefix('#KafkaMessageService: ');
    }
    return this._logger;
  }
}
