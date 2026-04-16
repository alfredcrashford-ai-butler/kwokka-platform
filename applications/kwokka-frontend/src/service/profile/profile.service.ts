import { inject, injectable } from 'inversify';
import { DecorationEntity, ProfileDecorationsEntity, ProfileEntity } from '@kwokka/entities';
import { ProfileDecorationsApi } from '@/api/avatar/profile-decorations/profile-decorations.api';
import { ProfileApi } from '@/api/avatar/profile/profile.api';
import { ErrorCode } from '@/utils/error-code';
import { DecorationApi } from '@/api/avatar/decoration/decoration.api';

@injectable()
export class ProfileService {
  private _profile: ProfileEntity = null;
  private _profileDecorations: ProfileDecorationsEntity = null;
  private _decorations: DecorationEntity[] = [];

  public constructor(
    @inject(ProfileApi) private profileApi: ProfileApi,
    @inject(ProfileDecorationsApi) private profileDecorationsApi: ProfileDecorationsApi,
    @inject(DecorationApi) private decorationApi: DecorationApi,
  ) {}

  public get profile(): ProfileEntity {
    return this._profile;
  }

  public get profileDecorations(): ProfileDecorationsEntity {
    return this._profileDecorations;
  }

  public get decorations(): DecorationEntity[] {
    return this._decorations;
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

  public async fetchOwnProfile(): Promise<ProfileEntity> {
    try {
      const profile = await this.profileApi.getOwnProfile();
      this._profile = profile;
      return profile;
    } catch (e: any) {
      if (e?.code === ErrorCode.EntityNotFound) {
        return null;
      }

      throw e;
    }
  }

  public async fetchOwnProfileDecorations(): Promise<ProfileDecorationsEntity> {
    if (!this._profile) {
      this._profileDecorations = null;
      return null;
    }

    try {
      this._profileDecorations = await this.profileDecorationsApi.getProfileDecorationsByProfileId(this._profile.id);
    } catch (e: any) {
      if (e?.code === ErrorCode.EntityNotFound) {
        return null;
      }

      throw e;
    }

    if (this._profileDecorations) {
      let ids = Object.values(this._profileDecorations.decorations);
      ids = Array.from(new Set(ids));
      this._decorations = await Promise.all(ids.map((id) => this.decorationApi.getById(id)));
    }

    return this._profileDecorations;
  }
}
