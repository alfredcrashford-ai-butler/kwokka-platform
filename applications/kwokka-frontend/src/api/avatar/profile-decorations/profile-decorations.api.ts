import { injectable, injectFromBase } from 'inversify';
import type { ProfileDecorationsEntity } from '@kwokka/entities';
import { CrudApi } from '@/api/crud-api';
import type { Dto } from '@/api/dto';
import { ProfileDecorationsApiAdapter } from './profile-decorations.api-adapter';

@injectable()
@injectFromBase()
export class ProfileDecorationsApi extends CrudApi<ProfileDecorationsEntity, Dto<ProfileDecorationsEntity>> {
  protected override readonly baseUrl = '/capybara/v1/profile-decorations';
  protected override readonly adapter = new ProfileDecorationsApiAdapter();

  public async getProfileDecorationsByProfileId(profileId: string): Promise<ProfileDecorationsEntity> {
    const result = await this.http.get<Dto<ProfileDecorationsEntity>>(`${this.baseUrl}/profile/${profileId}`);
    return this.adapter.deserialize(result.data);
  }
}
