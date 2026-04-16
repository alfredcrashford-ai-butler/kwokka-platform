import { StringUtil } from '@kwokka/utils';
import { EmailTemplate } from '@kwokka/common-node';

export class VerifyEmailPasswordCredentialTemplate implements EmailTemplate {
  public readonly subject = 'Kwokka | Verification';

  public generateHtml(data: object): string {
    return StringUtil.format(this.template, data);
  }

  private get template(): string {
    return `
      <h1>✅ Verify your email ✅</h1>
      <br/>
      <p>
        Hey there 👋
        <br/>
        This E-Mail address was added as a login credential on the Kwokka platform. Please follow
        <a href="https://app.kwokka.co/verify?vt={{verifyToken}}&cid={{credentialId}}">this link</a> to verify it.
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
