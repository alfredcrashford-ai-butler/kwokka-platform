import { StringUtil } from '@kwokka/utils';
import { EmailTemplate } from '@kwokka/common-node';

export class RestoreEmailPasswordAccessTemplate implements EmailTemplate {
  public readonly subject = 'Kwokka | Restore access';

  public generateHtml(data: object): string {
    return StringUtil.format(this.template, data);
  }

  private get template(): string {
    return `
      <h1>🗝️ Restore access 🗝️</h1>
      <br/>
      <p>
        Hey there 👋
        <br/>
        We are sorry about the problems you encountered while accessing the Kwokka platform. Please follow
        <a href="https://app.kwokka.co/auth?rt={{restoreToken}}">this link</a> to restore your access.
        <br/>
        <br/>
        If this wasn't you - please ignore this message 😎.
      </p>
      <br/>
      <p>
        Best wishes,
        <br/>
        Kwokka
      </p>
      <br/>
      <a href="https://app.kwokka.co" title="Kwokka">
        <img src="https://app.kwokka.co/assets/logo.png" width="200px"/>
      </a>
    `;
  }
}
