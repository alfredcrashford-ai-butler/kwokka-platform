<template>
  <div class="reload-prompt">
    <UiDialog
      ref="dialog"
      :title="$t('general.updateAvailable.title')"
      :text="$t('general.updateAvailable.description')"
      :isSecondaryButtonShown="false"
      :isBackdropClickEnabled="false"
      @primaryButtonClick="updateSW()"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { registerSW } from 'virtual:pwa-register';
  import { pwaInfo } from 'virtual:pwa-info';
  import { UiDialog } from '@/app/ui-kit';
  import { LazyInject } from '@/ioc';
  import { ErrorTrackerService, LoggerService } from '@/service';

  const UPDATE_INTERVAL_MS = 5 * 60 * 1000;

  @Component({
    components: {
      UiDialog,
    },
  })
  export default class ReloadPrompt extends Vue {
    public updateSW: () => void;

    @Ref()
    public dialog: UiDialog;

    @LazyInject(LoggerService)
    public loggerService: LoggerService;

    @LazyInject(ErrorTrackerService)
    public errorTracker: ErrorTrackerService;

    private logger: LoggerService;

    public created(): void {
      this.logger = this.loggerService.withPrefix('#ReloadPrompt:');
    }

    public mounted(): void {
      this.logger.log('Registering SW, pwa info: ', pwaInfo);
      this.updateSW = registerSW({
        onNeedRefresh: () => this.dialog.show(),
        onOfflineReady: () => this.onOfflineReady(),
        onRegisteredSW: (url: string, registration: ServiceWorkerRegistration | undefined) =>
          this.onSwRegistrationCompleted(url, registration),
        onRegisterError: (e: any) => this.onSwRegistrationError(e),
      });
    }

    public onOfflineReady(): void {
      this.logger.log('App is ready for offline use');
    }

    public onSwRegistrationCompleted(url: string, registration: ServiceWorkerRegistration | undefined): void {
      this.logger.log('Service worker registration completed, registration exists: ', !!registration);
      if (registration) {
        setInterval(() => this.checkUpdates(url, registration), UPDATE_INTERVAL_MS);
        this.checkUpdates(url, registration);
      }
    }

    public onSwRegistrationError(error: any): void {
      this.logger.error('Error during service worker registration:', error);
      this.errorTracker.captureError(error);
    }

    private async checkUpdates(url: string, registration: ServiceWorkerRegistration): Promise<void> {
      this.logger.log('Update of service worker started');
      if (registration.installing || !navigator) {
        this.logger.log('Update finished: is already installing or no navigator available');
        return;
      }

      if ('connection' in navigator && !navigator.onLine) {
        this.logger.log('Update finished: device offline');
        return;
      }

      const resp = await fetch(url, {
        cache: 'no-store',
        headers: { cache: 'no-store', 'cache-control': 'no-cache' },
      });

      if (resp?.status === 200) {
        await registration.update();
      }

      this.logger.log('Update of service worker finished');
    }
  }
</script>

<style lang="scss" scoped>
  .reload-prompt {
    position: relative;
    z-index: 1000000;
  }
</style>
