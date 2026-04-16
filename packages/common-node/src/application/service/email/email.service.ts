import { injectable } from 'inversify';

export interface EmailTemplate {
  subject: string;
  generateHtml(data: object): string;
}

@injectable()
export abstract class EmailService {
  public abstract sendEmail(to: string[], subject: string, content: string): Promise<void>;
  public abstract sendEmailWithTemplate(to: string[], template: EmailTemplate, data: object): Promise<void>;
}
