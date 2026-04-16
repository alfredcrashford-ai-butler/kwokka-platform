import { DecorationEntity, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
import type { KwokkaSdkJsConfig } from '../config';
import { HttpUtil, type Dto } from '../util';
import { ErrorCode, KwokkaSdkJsError } from '../error';
import { AuthAPI } from '../auth';
import { AuthInternalAPI } from '../auth-internal';

export class ProfileAPI {
  private _profile: ProfileEntity = null;
  private _profileDecorations: ProfileDecorationsEntity = null;
  private _decorations: DecorationEntity[] = [];
  private readonly capybaraUrl: string;

  public constructor(
    private readonly config: KwokkaSdkJsConfig,
    private readonly authInternal: AuthInternalAPI,
  ) {
    this.capybaraUrl = `${this.config.endpoint}/capybara`;
  }

  public get myProfile(): ProfileEntity {
    return this._profile;
  }

  public get myProfileDecorations(): ProfileDecorationsEntity {
    return this._profileDecorations;
  }

  public get decorations(): DecorationEntity[] {
    return this._decorations;
  }

  public async getProfileByAccountId(accountId: string): Promise<ProfileEntity> {
    return await this.authInternal.withAuth(async () => {
      const url = `${this.capybaraUrl}/v1/profiles/account/${accountId}`;
      const response = await HttpUtil.get<{ data: Dto<ProfileEntity> }>(url, this.authInternal.authHeaders);
      return this.deserializeProfile(response.data);
    });
  }

  public async getOwnProfile(): Promise<ProfileEntity> {
    try {
      return await this.authInternal.withAuth(async () => {
        const url = `${this.capybaraUrl}/v1/profiles/my`;
        const response = await HttpUtil.get<{ data: Dto<ProfileEntity> }>(url, this.authInternal.authHeaders);
        const profile = this.deserializeProfile(response.data);
        this._profile = profile;
        return profile;
      });
    } catch (e: unknown) {
      if (e instanceof KwokkaSdkJsError && e.code === ErrorCode.EntityNotFound) {
        this.config.logger.debug('#ProfileClient.getOwnProfile(): Own profile not found, returning null');
        return null;
      }

      throw e;
    }
  }

  public async getOwnProfileDecorations(): Promise<ProfileDecorationsEntity> {
    if (!this._profile?.id) {
      return null;
    }

    try {
      return await this.authInternal.withAuth(async () => {
        const url = `${this.capybaraUrl}/v1/profile-decorations/profile/${this._profile.id}`;
        const response = await HttpUtil.get<{ data: Dto<ProfileDecorationsEntity> }>(url, this.authInternal.authHeaders);
        const profileDecorations = this.deserializeProfileDecorations(response.data);
        this._profileDecorations = profileDecorations;

        if (this._profileDecorations) {
          let ids = Object.values(this._profileDecorations.decorations);
          ids = Array.from(new Set(ids));
          this._decorations = await Promise.all(ids.map((id) => this.getDecorationById(id)));
        }

        return profileDecorations;
      });
    } catch (e: unknown) {
      if (e instanceof KwokkaSdkJsError && e.code === ErrorCode.EntityNotFound) {
        this.config.logger.debug(
          '#ProfileClient.getOwnProfileDecorations(): Own profile decorations not found, returning null',
        );
        return null;
      }

      throw e;
    }
  }

  public getDecorationById(id: string): Promise<DecorationEntity> {
    return this.authInternal.withAuth(async () => {
      const result = await HttpUtil.get<{ data: Dto<DecorationEntity> }>(
        `${this.capybaraUrl}/v1/decorations/${id}`,
        this.authInternal.authHeaders,
      );
      return this.deserializeDecoration(result.data);
    });
  }

  public setProfile(profile: ProfileEntity): void {
    this._profile = profile;
  }

  public setProfileDecorations(profileDecorations: ProfileDecorationsEntity): void {
    this._profileDecorations = profileDecorations;
  }

  public setDecorations(decorations: DecorationEntity[]): void {
    this._decorations = decorations;
  }

  private deserializeProfile(dto: Dto<ProfileEntity>): ProfileEntity {
    if (!dto) {
      return null;
    }

    return new ProfileEntity({
      id: dto.id,
      accountId: dto.accountId,
      name: dto.name,
      locale: dto.locale,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private deserializeProfileDecorations(dto: Dto<ProfileDecorationsEntity>): ProfileDecorationsEntity {
    if (!dto) {
      return null;
    }

    return new ProfileDecorationsEntity({
      id: dto.id,
      profileId: dto.profileId,
      decorations: dto.decorations,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }

  private deserializeDecoration(dto: Dto<DecorationEntity>): DecorationEntity {
    if (!dto) {
      return null;
    }

    return new DecorationEntity({
      id: dto.id,
      applicationAccountId: dto.applicationAccountId,
      key: dto.key,
      type: dto.type,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : undefined,
    });
  }
}
