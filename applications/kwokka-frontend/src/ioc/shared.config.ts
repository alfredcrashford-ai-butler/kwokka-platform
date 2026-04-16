import type { IocContainerConfig } from '@/ioc/ioc-container';

import { ErrorTrackerService } from '@/service/error-tracker/error-tracker.service';
import { ErrorTrackerServiceProvidedImpl } from '@/service/error-tracker/error-tracker-provided.service';
import { NotificationService } from '@/service/notification/notification.service';
import { PersistenceService } from '@/service/persistence/persistence.service';
import { PersistenceServiceLocalStorageImpl } from '@/service/persistence/persistence-local-storage.service';
import { ConfigService } from '@/service/config/config.service';
import { DuplexManagerService } from '@/service/duplex-manager/duplex-manager.service';
import { WebsocketDuplexManagerServiceImpl } from '@/service/duplex-manager/duplex-manager-websocket.service';
import { TranslationService } from '@/service/translation/translation.service';
import { VueTranslationServiceImpl } from '@/service/translation/translation-vue.service';
import { LoggerService } from '@/service/logger/logger.service';
import { LoggerServiceConsoleImpl } from '@/service/logger/logger-console.service';
import { OnboardingService } from '@/service/onboarding/onboarding.service';
import { OnboardingServiceImpl } from '@/service/onboarding/onboarding-impl.service';
import { AccessService } from '@/service/access/access.service';

import { AccessRightApi } from '@/api/auth/access-right/access-right.api';
import { AccessRoleApi } from '@/api/auth/access-role/access-role.api';
import { AccountRolesApi } from '@/api/auth/account-roles/account-roles.api';
import { AccountTypeRolesApi } from '@/api/auth/account-type-roles/account-type-roles.api';
import { AccountApi } from '@/api/auth/account/account.api';
import { CredentialApi } from '@/api/auth/credential/credential.api';
import { TokenApi } from '@/api/auth/token/token.api';
import { AuthenticatedGuard } from '@/guard/authenticated.guard';
import { UnauthenticatedGuard } from '@/guard/unauthenticated.guard';
import { AccessRightGuard } from '@/guard/access-right.guard';
import { ProfileGuard } from '@/guard/profile.guard';
import { HttpService } from '@/service/network/http.service';
import { AuthRequestInterceptor } from '@/service/network/auth.request-interceptor';
import { AuthResponseInterceptor } from '@/service/network/auth.response-interceptor';
import { ContentTypeRequestInterceptor } from '@/service/network/content-type.request-interceptor';
import { DecorationApi } from '@/api/avatar/decoration/decoration.api';
import { ItemApi } from '@/api/avatar/item/item.api';
import { ProfileDecorationsApi } from '@/api/avatar/profile-decorations/profile-decorations.api';
import { ProfileApi } from '@/api/avatar/profile/profile.api';
import { ProfileService } from '@/service/profile/profile.service';
import { GameInstanceApi } from '@/api/play/game-instance/game-instance.api';
import { LobbyApi } from '@/api/play/lobby/lobby.api';
import { GameApi } from '@/api/play/game/game.api';
import { TraitApi } from '@/api/avatar/trait/trait.api';
import { TraitInstanceApi } from '@/api/avatar/trait-instance/trait-instance.api';
import { ItemTradeApi } from '@/api/avatar/item-trade/item-trade.api';

export const IOC_CONTAINER_CONFIG_SHARED: IocContainerConfig = {
  units: [
    // routing
    AuthenticatedGuard,
    UnauthenticatedGuard,
    AccessRightGuard,
    ProfileGuard,

    // services
    HttpService,
    AuthRequestInterceptor,
    AuthResponseInterceptor,
    ContentTypeRequestInterceptor,
    NotificationService,
    ConfigService,
    AccessService,
    ProfileService,
    { identifier: PersistenceService, implementer: PersistenceServiceLocalStorageImpl },
    { identifier: ErrorTrackerService, implementer: ErrorTrackerServiceProvidedImpl },
    { identifier: DuplexManagerService, implementer: WebsocketDuplexManagerServiceImpl },
    { identifier: TranslationService, implementer: VueTranslationServiceImpl },
    { identifier: LoggerService, implementer: LoggerServiceConsoleImpl },
    { identifier: OnboardingService, implementer: OnboardingServiceImpl },

    // apis
    AccessRightApi,
    AccessRoleApi,
    AccountApi,
    AccountRolesApi,
    AccountTypeRolesApi,
    CredentialApi,
    TokenApi,
    ProfileDecorationsApi,
    ProfileApi,
    ItemApi,
    DecorationApi,
    GameApi,
    GameInstanceApi,
    LobbyApi,
    TraitApi,
    TraitInstanceApi,
    ItemTradeApi,
  ],
};
