import { RestoreEmailPasswordAccessTemplate } from './restore-email-password-access.template';

describe(RestoreEmailPasswordAccessTemplate, () => {
  it('exists', () => {
    expect(RestoreEmailPasswordAccessTemplate).toBeTruthy();
  });

  it('generates email html and inserts values', () => {
    const html = new RestoreEmailPasswordAccessTemplate().generateHtml({ restoreToken: 'RESTORE_TOKEN' });
    expect(typeof html).toEqual('string');
    expect(html).toMatch('RESTORE_TOKEN');
  });
});
