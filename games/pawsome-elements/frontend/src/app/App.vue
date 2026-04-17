<template>
  <div class="app">
    <UiIconsDefinition />

    <div class="app__wrapper">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>

    <OnboardingPresenter />
    <NotificationsPresenter />

    <ReloadPrompt />

    <div class="app__version">{{ configService.frontendConfig.version }}</div>

    <div class="app__tooltip-container" data-app-tooltip-container></div>
  </div>
</template>

<script lang="ts">
  import { Component, Provide, Vue } from 'vue-facing-decorator';
  import { FunctionUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { UiIconsDefinition } from '@/app/ui-kit';
  import { ReloadPrompt, NotificationsPresenter, OnboardingPresenter } from '@/app/components';
  import {
    ErrorTrackerService,
    ConfigService,
    SoundService,
    TrackerService,
    CookieService,
    TranslationService,
    AdService,
  } from '@/service';

  const RESIZE_DEBOUNCE_MS = 200;

  @Component({
    components: {
      UiIconsDefinition,
      NotificationsPresenter,
      OnboardingPresenter,
      ReloadPrompt,
    },
  })
  export default class App extends Vue {
    @LazyInject(ErrorTrackerService)
    public errorTrackerService: ErrorTrackerService;

    @LazyInject(TrackerService)
    public trackerService: TrackerService;

    @LazyInject(SoundService)
    public soundService: SoundService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(CookieService)
    public cookieService: CookieService;

    @LazyInject(TranslationService)
    public translationService: TranslationService;

    @LazyInject(AdService)
    public adService: AdService;

    @Provide()
    public isLandscape: boolean = false;

    @Provide()
    public isPortrait: boolean = false;

    private resizeListener: () => any;

    public created(): void {
      this.errorTrackerService.setup();
      this.soundService.setup();
      this.trackerService.setup();
      this.setupCookieService();
      this.setupAdService();

      this.resizeListener = FunctionUtil.debounce(this.onResize.bind(this), RESIZE_DEBOUNCE_MS);
      window.addEventListener('resize', this.resizeListener);
      this.onResize();
    }

    public beforeDestroy(): void {
      window.removeEventListener('resize', this.resizeListener);
    }

    private async setupCookieService(): Promise<void> {
      const messages = await this.translationService.getCurrentLocaleMessages();
      this.cookieService.setup(this.translationService.getCurrentLocale(), messages.cookieConsent);
    }

    private async setupAdService(): Promise<void> {
      await this.adService.setup();
      this.adService.configure({ isSoundEnabled: !this.soundService.settings.mute });
    }

    private onResize(): void {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.isLandscape = width > height;
      this.isPortrait = !this.isLandscape;
    }
  }
</script>

<style scoped lang="scss">
  .app {
    &__wrapper {
      height: 100%;
      overflow: hidden;
    }

    &__version {
      --pwsm--spacing-unit: 4px;
      --pwsm--font-size: 16px;
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 9999999;
      pointer-events: none;
      @include UiTypographyParagraph2();
      @include UiMargin(1);
      opacity: 0.5;
    }

    &__tooltip-container {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      width: 100%;
      height: 100%;
      z-index: 10000;

      --pwsm--spacing-unit: 6px;
      --pwsm--font-size: 20px;
    }
  }
</style>
