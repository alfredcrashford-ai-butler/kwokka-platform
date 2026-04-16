import type { KwokkaSdkJsConfig } from '../config';
import { Dto, HttpUtil } from '../util';
import { TokenPair } from '../util/interface';

const ANON_ACCOUNT_ID_KEY = '[kwokka-auth][anon-account-id]';

export class AuthAPI {
  private readonly baseUrl: string;

  public constructor(private readonly config: KwokkaSdkJsConfig) {
    this.baseUrl = `${this.config.endpoint}/owl`;
  }

  public async signUpAnon(): Promise<string> {
    const url = `${this.baseUrl}/v1/onboarding/sign-up/anon`;
    const response = await HttpUtil.post<{ data: Dto<{ accountId: string }> }>(url);
    const accountId = response?.data?.accountId;
    if (accountId) {
      localStorage.setItem(ANON_ACCOUNT_ID_KEY, accountId);
    }

    return accountId;
  }

  public async signInAnon(id: string): Promise<TokenPair> {
    const url = `${this.baseUrl}/v1/onboarding/sign-in/anon`;
    const response = await HttpUtil.post<{ data: Dto<TokenPair> }>(url, { id });
    return response.data;
  }

  public get anonAccountId(): string {
    return localStorage.getItem(ANON_ACCOUNT_ID_KEY);
  }
}
