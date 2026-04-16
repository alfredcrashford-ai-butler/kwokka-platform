import {
  LoggerService,
  CacheService,
  ScheduleService,
  HttpService,
  AxiosHttpService,
  MessageService,
  KafkaMessageService,
  WinstonLoggerService,
  MailersendEmailService,
  EmailService,
  ValidationMiddleware,
  ErrorTrackerService,
  SentryErrorTrackerService,
  DevErrorTrackerService,
  HttpServer,
  AuthMiddleware,
  AccessRightMiddleware,
  ConfigService,
  TokenService,
} from '../application';
import { InjectableUnit } from './ioc-container';
import { Module } from './module';

export class CommonModule extends Module {
  public get components(): InjectableUnit[] {
    return [
      // middlewares
      ValidationMiddleware,
      AuthMiddleware,
      AccessRightMiddleware,

      // servers
      HttpServer,

      // services
      CacheService,
      ScheduleService,
      ConfigService,
      TokenService,
      { identifier: MessageService, implementer: KafkaMessageService },
      { identifier: LoggerService, implementer: WinstonLoggerService },
      { identifier: HttpService, implementer: AxiosHttpService },
      { identifier: EmailService, implementer: MailersendEmailService },
      {
        identifier: ErrorTrackerService,
        implementer: process.env.NODE_ENV === 'production' ? SentryErrorTrackerService : DevErrorTrackerService,
      },
    ];
  }
}
