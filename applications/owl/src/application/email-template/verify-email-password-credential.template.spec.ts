import { VerifyEmailPasswordCredentialTemplate } from './verify-email-password-credential.template';

describe(VerifyEmailPasswordCredentialTemplate, () => {
  it('exists', () => {
    expect(VerifyEmailPasswordCredentialTemplate).toBeTruthy();
  });

  it('generates email html and inserts values', () => {
    const html = new VerifyEmailPasswordCredentialTemplate().generateHtml({
      verifyToken: 'VERIFY_TOKEN',
      credentialId: 'CREDENTIAL_ID',
    });
    expect(typeof html).toEqual('string');
    expect(html).toMatch('VERIFY_TOKEN');
    expect(html).toMatch('CREDENTIAL_ID');
  });
});
