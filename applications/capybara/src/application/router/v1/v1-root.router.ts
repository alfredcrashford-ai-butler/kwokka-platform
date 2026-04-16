import { inject, injectable, injectFromBase } from 'inversify';
import { Router } from '@kwokka/common-node';
import { DecorationV1Router } from './decoration';
import { ItemV1Router } from './item';
import { ProfileV1Router } from './profile';
import { ProfileDecorationsV1Router } from './profile-decorations';
import { TraitV1Router } from './trait';
import { ItemTradeV1Router } from './item-trade';

@injectable()
@injectFromBase()
export class V1RootRouter extends Router {
  public constructor(
    @inject(ProfileV1Router) private profileV1Router: ProfileV1Router,
    @inject(DecorationV1Router) private decorationV1Router: DecorationV1Router,
    @inject(ProfileDecorationsV1Router) private profileDecorationsV1Router: ProfileDecorationsV1Router,
    @inject(ItemV1Router) private itemV1Router: ItemV1Router,
    @inject(ItemTradeV1Router) private itemTradeV1Router: ItemTradeV1Router,
    @inject(TraitV1Router) private traitV1Router: TraitV1Router,
  ) {
    super();
    this.addRouter('/profiles', this.profileV1Router);
    this.addRouter('/decorations', this.decorationV1Router);
    this.addRouter('/profile-decorations', this.profileDecorationsV1Router);
    this.addRouter('/items', this.itemV1Router);
    this.addRouter('/item-trades', this.itemTradeV1Router);
    this.addRouter('/traits', this.traitV1Router);
  }
}
