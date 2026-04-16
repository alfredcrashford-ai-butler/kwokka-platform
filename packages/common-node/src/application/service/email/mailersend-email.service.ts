import { inject, injectable } from 'inversify';
import { ConfigService } from '../config';
import { HttpService } from '../http';
import { EmailService, EmailTemplate } from './email.service';
import { EnvVarName } from '../../../util';

@injectable()
export class MailersendEmailService extends EmailService {
  private readonly from = Object.freeze({ email: 'noreply@kwokka.co', name: 'Kwokka' });
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.mailersend.com/v1/email';

  public constructor(
    @inject(HttpService) private httpService: HttpService,
    @inject(ConfigService) private configService: ConfigService,
  ) {
    super();
    this.apiKey = this.configService.get(EnvVarName.MailersendApiKey);
  }

  public async sendEmail(to: string[], subject: string, content: string): Promise<void> {
    await this.httpService.post(this.apiUrl, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: {
        from: this.from,
        to: to.map((email) => ({ email })),
        subject,
        html: content,
      },
    });
  }

  public async sendEmailWithTemplate(to: string[], template: EmailTemplate, data: object): Promise<void> {
    await this.httpService.post(this.apiUrl, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: {
        from: this.from,
        to: to.map((email) => ({ email })),
        subject: template.subject,
        html: template.generateHtml(data),
      },
    });
  }
}
