import { injectable, injectFromBase } from 'inversify';
import type { ProfileEntity } from '@kwokka/entities';
import { ObjectUtil } from '@kwokka/utils';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { ProfileApiAdapter } from './profile.api-adapter';

@injectable()
@injectFromBase()
export class ProfileApi extends CrudApi<ProfileEntity, Dto<ProfileEntity>> {
  protected override readonly baseUrl = '/capybara/v1/profiles';
  protected override readonly adapter = new ProfileApiAdapter();

  public async getOwnProfile(): Promise<ProfileEntity> {
    const result = await this.http.get<Dto<ProfileEntity>>(`${this.baseUrl}/my`);
    if (!result.data) {
      return null;
    }

    return this.adapter.deserialize(result.data);
  }

  public async getByAccountId(accountId: string): Promise<ProfileEntity> {
    const result = await this.http.get<Dto<ProfileEntity>>(`${this.baseUrl}/account/${accountId}`);
    if (!result.data) {
      return null;
    }

    return this.adapter.deserialize(result.data);
  }

  public async updateOwnProfile(profile: Partial<ProfileEntity>): Promise<ProfileEntity> {
    const result = await this.http.patch<Dto<ProfileEntity>>(
      `${this.baseUrl}/my`,
      ObjectUtil.take(profile, ['locale', 'name']),
    );
    return this.adapter.deserialize(result.data);
  }
}
