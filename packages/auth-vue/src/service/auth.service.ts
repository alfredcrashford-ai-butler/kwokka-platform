import { type CredentialEntity, CredentialFactory } from '@kwokka/entities';
import { HttpService } from './http.service';

export interface OwlResponse<T> {
  data: T;
  meta: { timestamp: number };
}

export class AuthService {
  private http: HttpService;

  public constructor(private baseUrl: string = 'http://localhost:8081/owl') {
    this.http = new HttpService();
  }

  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  public async signUpAnon(): Promise<OwlResponse<{ accountId: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-up/anon`;
    const response = await this.http.post<OwlResponse<{ accountId: string }>>(url);
    return response;
  }

  public async signUpEmail(
    email: string,
    password: string,
    captcha: string,
  ): Promise<OwlResponse<{ accountId: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-up/email?captcha=${captcha}`;
    const response = await this.http.post<OwlResponse<{ accountId: string }>>(url, { email, password });
    return response;
  }

  public async signUpGoogleOauth2(accessToken: string, captcha: string): Promise<OwlResponse<{ accountId: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-up/google-oauth2?captcha=${captcha}`;
    const response = await this.http.post<OwlResponse<{ accountId: string }>>(url, { accessToken });
    return response;
  }

  public async signInGoogleOauth2(accessToken: string): Promise<OwlResponse<{ access: string; refresh: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-in/google-oauth2`;
    const response = await this.http.post<OwlResponse<{ access: string; refresh: string }>>(url, { accessToken });
    return response;
  }

  public async signUpDiscordOauth2(accessToken: string, captcha: string): Promise<OwlResponse<{ accountId: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-up/discord-oauth2?captcha=${captcha}`;
    const response = await this.http.post<OwlResponse<{ accountId: string }>>(url, { accessToken });
    return response;
  }

  public async signInDiscordOauth2(accessToken: string): Promise<OwlResponse<{ access: string; refresh: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-in/discord-oauth2`;
    const response = await this.http.post<OwlResponse<{ access: string; refresh: string }>>(url, { accessToken });
    return response;
  }

  public async signInAnon(accountId: string): Promise<OwlResponse<{ access: string; refresh: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-in/anon`;
    const response = await this.http.post<OwlResponse<{ access: string; refresh: string }>>(url, { id: accountId });
    return response;
  }

  public async signInEmail(email: string, password: string): Promise<OwlResponse<{ access: string; refresh: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/sign-in/email`;
    const response = await this.http.post<OwlResponse<{ access: string; refresh: string }>>(url, { email, password });
    return response;
  }

  public async restoreEmail(email: string, captcha: string): Promise<OwlResponse<void>> {
    const url = `${this.baseUrl}/v1/onboarding/restore/email?captcha=${captcha}`;
    const response = await this.http.post<OwlResponse<void>>(url, { email });
    return response;
  }

  public async completeRestoreEmail(token: string, password: string): Promise<OwlResponse<{ accountId: string }>> {
    const url = `${this.baseUrl}/v1/onboarding/complete-restore/email`;
    const response = await this.http.post<OwlResponse<{ accountId: string }>>(url, { token, password });
    return response;
  }

  public async addCredential(
    credential: CredentialEntity,
    accessToken: string,
    accountId?: string,
    oauthToken?: string,
  ): Promise<CredentialEntity> {
    const serialized: any = this.serializeCredential(credential, accountId);
    const url = this.getAddCredentialUrl(accountId, oauthToken);
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await this.http.post<OwlResponse<any>>(url, serialized, headers);
    const deserialized = this.deserializeCredential(response.data);
    return deserialized;
  }

  private serializeCredential(credential: CredentialEntity, accountId: string): any {
    const serialized: any = { type: credential.type };

    if (credential.identifier) {
      serialized.identifier = credential.identifier;
    }

    if (credential.data) {
      serialized.data = credential.data;
    }

    if (accountId) {
      serialized.accountId = accountId;
    }

    return serialized
  }

  private getAddCredentialUrl(accountId?: string, oauthToken?: string): string {
    let url = `${this.baseUrl}/v1/credentials`;
    if (!accountId) {
      url = `${url}/my`;
    }
    if (oauthToken) {
      url = `${url}?oauthToken=${oauthToken}`
    }
    return url
  }

  private deserializeCredential(dto: any): CredentialEntity {
    return CredentialFactory.get({
      id: dto.id,
      accountId: dto.accountId,
      identifier: dto.identifier,
      data: dto.data,
      type: dto.type,
      isVerified: dto.isVerified,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }
}
