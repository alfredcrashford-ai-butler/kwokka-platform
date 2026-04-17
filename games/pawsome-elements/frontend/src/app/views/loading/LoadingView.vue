<template>
  <div class="loading-view">
    <div class="loading-view__container">
      <UiResponsiveImage src="/static/logo_horizontal.webp" alt="" class="loading-view__logo" />
      <UiLoader />
    </div>
  </div>
</template>

<script lang="ts">
  import { RouteName } from '@/app/route-name';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';
  import { UiLoader, UiResponsiveImage } from '@/app/ui-kit';
  import { LazyInject } from '@/ioc';
  import {
    ErrorTrackerService,
    KwokkaService,
    LoggerService,
    NotificationService,
    PersistenceService,
    PersistenceKey,
    ConfigService,
    TrackerService,
    ResourceCacheService,
  } from '@/service';
  import { Component, Vue } from 'vue-facing-decorator';

  @Component({
    components: {
      FadeTransition,
      UiResponsiveImage,
      UiLoader,
    },
  })
  export default class LoadingView extends Vue {
    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(ResourceCacheService)
    public resourceCacheService: ResourceCacheService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(TrackerService)
    public trackerService: TrackerService;

    @LazyInject(ErrorTrackerService)
    public errorTracker: ErrorTrackerService;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(PersistenceService)
    public persistenceService: PersistenceService;

    public get isAuthenticated(): boolean {
      return this.kwokkaService.client.isAuthenticated;
    }

    public async created(): Promise<void> {
      await this.resourceCacheService.clearUnusedResourcesCache();
    }

    public async mounted(): Promise<void> {
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      if (this.$route.query?.targetUrl) {
        this.$router.replace(this.$route.query.targetUrl as string);
        return;
      }

      const isOnboardingCompleted = this.persistenceService.loadValue(PersistenceKey.OnboardingV1Completed);
      if (!isOnboardingCompleted) {
        this.$router.replace({ name: RouteName.Tutorial });
        return;
      }

      this.$router.replace({ name: RouteName.Main });
    }

    private async authenticate(): Promise<void> {
      let tokenPair: { access: string; refresh: string };

      try {
        let accountId = this.kwokkaService.client.auth.anonAccountId;

        if (!accountId) {
          accountId = await this.kwokkaService.client.auth.signUpAnon();
        }

        tokenPair = await this.kwokkaService.client.auth.signInAnon(accountId);
      } catch (e) {
        this.errorTracker.captureError(e);
        const accountId = await this.kwokkaService.client.auth.signUpAnon();
        tokenPair = await this.kwokkaService.client.auth.signInAnon(accountId);
      }

      this.kwokkaService.client.authorize(tokenPair.access, tokenPair.refresh);
    }
  }
</script>

<style scoped lang="scss">
  .loading-view {
    position: relative;
    width: 100%;
    height: 100%;
    @include UiTavernBackground();

    &__logo {
      width: UiSpacing(120);
      aspect-ratio: 2;
      flex-shrink: 0;
    }

    &__container {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
</style>
