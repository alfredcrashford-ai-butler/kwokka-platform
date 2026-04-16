import { DecorationEntity, DecorationEntityType, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
import { ObjectUtil } from '@kwokka/utils';
import { HttpService } from './http.service';

export interface CapybaraResponse<T> {
  data: T;
  meta: { timestamp: number };
}

enum ErrorCode {
  EntityNotFound = 'ENTITY_NOT_FOUND',
}

export class AvatarService {
  private http: HttpService;
  private accessToken: string;

  public constructor(private baseUrl: string = 'http://localhost:8081/capybara') {
    this.http = new HttpService();
  }

  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public async createOwnProfile(name: string, locale: string): Promise<ProfileEntity> {
    const result = await this.http.post<CapybaraResponse<ProfileEntity>>(
      `${this.baseUrl}/v1/profiles/my`,
      { name, locale },
      this.authHeaders,
    );
    return this.deserializeProfile(result.data);
  }

  public async updateProfile(profile: ProfileEntity): Promise<ProfileEntity> {
    const result = await this.http.patch<CapybaraResponse<ProfileEntity>>(
      `${this.baseUrl}/v1/profiles/${profile.id}`,
      ObjectUtil.take(profile, ['name']),
      this.authHeaders,
    );

    return this.deserializeProfile(result.data);
  }

  public async updateOwnProfile(profile: ProfileEntity): Promise<ProfileEntity> {
    const result = await this.http.patch<CapybaraResponse<ProfileEntity>>(
      `${this.baseUrl}/v1/profiles/my`,
      ObjectUtil.take(profile, ['name']),
      this.authHeaders,
    );

    return this.deserializeProfile(result.data);
  }

  public async updateOwnProfileDecorations(
    profileDecorations: ProfileDecorationsEntity,
  ): Promise<ProfileDecorationsEntity> {
    const result = await this.http.patch<CapybaraResponse<ProfileDecorationsEntity>>(
      `${this.baseUrl}/v1/profile-decorations/my`,
      ObjectUtil.take(profileDecorations, ['decorations']),
      this.authHeaders,
    );

    return this.deserializeProfileDecorations(result.data);
  }

  public async updateProfileDecorations(
    profileDecorations: ProfileDecorationsEntity,
  ): Promise<ProfileDecorationsEntity> {
    const result = await this.http.patch<CapybaraResponse<ProfileDecorationsEntity>>(
      `${this.baseUrl}/v1/profile-decorations/${profileDecorations.id}`,
      ObjectUtil.take(profileDecorations, ['decorations']),
      this.authHeaders,
    );

    return this.deserializeProfileDecorations(result.data);
  }

  public async getProfileByAccountId(accountId?: string): Promise<ProfileEntity> {
    if (!accountId) {
      return this.getOwnProfile();
    }

    try {
      const result = await this.http.get<CapybaraResponse<ProfileEntity>>(
        `${this.baseUrl}/v1/profiles/account/${accountId}`,
        this.authHeaders,
      );

      if (!result.data) {
        return null;
      }

      return this.deserializeProfile(result.data);
    } catch (e: any) {
      if (e?.code === ErrorCode.EntityNotFound) {
        return null;
      }

      throw e;
    }
  }

  public async getOwnProfile(): Promise<ProfileEntity> {
    try {
      const result = await this.http.get<CapybaraResponse<ProfileEntity>>(
        `${this.baseUrl}/v1/profiles/my`,
        this.authHeaders,
      );
      return this.deserializeProfile(result.data);
    } catch (e: any) {
      if (e?.code === ErrorCode.EntityNotFound) {
        return null;
      }

      throw e;
    }
  }

  public async createOwnProfileDecorations(decorations: {
    [id in DecorationEntityType]?: string;
  }): Promise<ProfileDecorationsEntity> {
    const result = await this.http.post<CapybaraResponse<ProfileDecorationsEntity>>(
      `${this.baseUrl}/v1/profile-decorations/my`,
      { decorations },
      this.authHeaders,
    );
    return this.deserializeProfileDecorations(result.data);
  }

  public async getDecorationsByIds(ids: string[]): Promise<DecorationEntity[]> {
    return await Promise.all(ids.map((id) => this.getDecorationById(id)));
  }

  public async getDecorationById(id: string): Promise<DecorationEntity> {
    const url = `${this.baseUrl}/v1/decorations/${id}`;
    const response = await this.http.get<CapybaraResponse<DecorationEntity>>(url, this.authHeaders);
    return this.deserializeDecoration(response?.data);
  }

  public async getDecorationByKey(key: string): Promise<DecorationEntity> {
    const url = `${this.baseUrl}/v1/decorations/key/${key}`;
    const response = await this.http.get<CapybaraResponse<DecorationEntity>>(url, this.authHeaders);
    return this.deserializeDecoration(response.data);
  }

  public async getProfileDecorationsByProfileId(profileId: string): Promise<ProfileDecorationsEntity> {
    try {
      const result = await this.http.get<CapybaraResponse<ProfileDecorationsEntity>>(
        `${this.baseUrl}/v1/profile-decorations/profile/${profileId}`,
        this.authHeaders,
      );
      return this.deserializeProfileDecorations(result.data);
    } catch (e: any) {
      if (e?.code === ErrorCode.EntityNotFound) {
        return null;
      }

      throw e;
    }
  }

  public async listAvailableDecorations(): Promise<DecorationEntity[]> {
    const result = await this.http.get<CapybaraResponse<DecorationEntity[]>>(
      `${this.baseUrl}/v1/decorations/available`,
      this.authHeaders,
    );
    return this.deserializeDecorationsList(result.data);
  }

  private get authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  private deserializeProfile(dto: any): ProfileEntity {
    if (!dto) {
      return null;
    }

    return new ProfileEntity({
      id: dto.id,
      accountId: dto.accountId,
      name: dto.name,
      locale: dto.locale,
      createdAt: dto.createdAt && new Date(dto.createdAt),
      updatedAt: dto.updatedAt && new Date(dto.updatedAt),
      deletedAt: dto.deletedAt && new Date(dto.deletedAt),
    });
  }

  private deserializeDecorationsList(dtos: any[]): DecorationEntity[] {
    return dtos.map((dto) => this.deserializeDecoration(dto));
  }

  private deserializeDecoration(dto: any): DecorationEntity {
    if (!dto) {
      return null;
    }

    return new DecorationEntity({
      id: dto.id,
      applicationAccountId: dto.applicationAccountId,
      key: dto.key,
      type: dto.type,
      createdAt: dto.createdAt && new Date(dto.createdAt),
      updatedAt: dto.updatedAt && new Date(dto.updatedAt),
      deletedAt: dto.deletedAt && new Date(dto.deletedAt),
    });
  }

  private deserializeProfileDecorations(dto: any): ProfileDecorationsEntity {
    if (!dto) {
      return null;
    }

    return new ProfileDecorationsEntity({
      id: dto.id,
      profileId: dto.profileId,
      decorations: dto.decorations,
      createdAt: dto.createdAt && new Date(dto.createdAt),
      updatedAt: dto.updatedAt && new Date(dto.updatedAt),
      deletedAt: dto.deletedAt && new Date(dto.deletedAt),
    });
  }
}
