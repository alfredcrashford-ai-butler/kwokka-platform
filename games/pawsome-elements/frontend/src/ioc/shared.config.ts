import type { IocContainerConfig } from '@/ioc/ioc-container';
import {
  AuthenticatedGuard,
  ProfileGuard,
  MenuMusicGuard,
  LoadingGuard,
  TargetUrlInjectorGuard,
  ActiveGameGuard,
} from '@/guard';
import {
  NotificationService,
  ConfigService,
  LoggerService,
  PersistenceService,
  KwokkaService,
  TranslationService,
  OnboardingService,
  VoiceService,
  ResourceCacheService,
  CacheService,
  DOMService,
  CookieService,
  AdService,
} from '@/service';
import { SoundService } from '@/service';
import { GaTrackerWorker, DebugTrackerWorker, RybbitTrackerWorker } from '@/service/tracker/worker';
import { TrackingGuard } from '@/guard/tracking.guard';

export const IOC_CONTAINER_CONFIG_SHARED: IocContainerConfig = {
  units: [
    // routing
    AuthenticatedGuard,
    ProfileGuard,
    TrackingGuard,
    TargetUrlInjectorGuard,
    MenuMusicGuard,
    LoadingGuard,
    ActiveGameGuard,

    // services
    AdService,
    NotificationService,
    ConfigService,
    LoggerService,
    PersistenceService,
    KwokkaService,
    TranslationService,
    OnboardingService,
    SoundService,
    // ClarityTrackerWorker,
    GaTrackerWorker,
    RybbitTrackerWorker,
    DebugTrackerWorker,
    VoiceService,
    CacheService,
    ResourceCacheService,
    DOMService,
    CookieService,
  ],
};
