<template>
  <div class="app-settings">
    <h3 class="app-settings__title">{{ $t('settings.app.title') }}</h3>
    <UiSimpleSelect
      :options="options"
      :label="$t('settings.app.localeLabel')"
      :placeholder="$t('settings.app.localePlaceholder')"
      labelKey="label"
      :modelValue="selectedOption"
      @update:modelValue="onOptionSelect($event)"
    />
    <UiButton type="secondary" @click="onResetAppDataClick()">{{ $t('settings.app.resetAppData') }}</UiButton>
    <UiButton type="red" @click="onResetAppAndLoginDataClick()">{{ $t('settings.app.resetAppAndLoginData') }}</UiButton>

    <UiDialog
      ref="resetAppDataConfirmationDialog"
      :title="$t('settings.app.resetAppDataDialogTitle')"
      :text="$t('settings.app.resetAppDataDialogText')"
      @primaryButtonClick="onResetAppDataConfirm()"
    />

    <UiDialog
      ref="resetAppAndLoginDataConfirmationDialog"
      :title="$t('settings.app.resetAppAndLoginDataDialogTitle')"
      :text="$t('settings.app.resetAppAndLoginDataDialogText')"
      @primaryButtonClick="onResetAppAndLoginDataConfirm()"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import {
    TranslationService,
    TranslationLocale,
    NotificationService,
    PersistenceService,
    CacheService,
  } from '@/service';
  import { UiButton, UiDialog, UiSimpleSelect } from '@/app/ui-kit';

  type LocaleOption = { label: string; value: string };

  @Component({
    components: {
      UiSimpleSelect,
      UiDialog,
      UiButton,
    },
  })
  export default class AppSettings extends Vue {
    @Ref()
    public resetAppDataConfirmationDialog: UiDialog;

    @Ref()
    public resetAppAndLoginDataConfirmationDialog: UiDialog;

    @LazyInject(TranslationService)
    private translationService: TranslationService;

    @LazyInject(NotificationService)
    private notificationService: NotificationService;

    @LazyInject(PersistenceService)
    private persistenceService: PersistenceService;

    @LazyInject(CacheService)
    private cacheService: CacheService;

    public options: LocaleOption[] = [];
    public selectedOption: LocaleOption = null;

    public mounted(): void {
      this.selectedOption = this.getLocaleOption(this.translationService.getSavedLocale());
      this.options = Object.values(TranslationLocale).map((locale) => this.getLocaleOption(locale));
    }

    public async onOptionSelect(option: LocaleOption): Promise<void> {
      if (this.selectedOption?.value === option.value) {
        return;
      }

      await this.translationService.setAndSaveLocale(option.value);
      this.selectedOption = this.getLocaleOption(option.value);
      this.notificationService.show({ type: 'success', text: this.$t('settings.app.updatedLocaleSuccessfully') });
    }

    public onResetAppDataClick(): void {
      this.resetAppDataConfirmationDialog.show();
    }

    public async onResetAppDataConfirm(): Promise<void> {
      await this.resetAppData();
      window.open('/', '_self');
    }

    private async resetAppData(): Promise<void> {
      this.resetPersistence();
      await Promise.all([this.resetSw(), this.resetCaches()]);
    }

    private getLocaleOption(locale: string): LocaleOption {
      return { label: this.$t(`language.${locale}`), value: locale };
    }

    private resetCaches(): Promise<void> {
      return this.cacheService.clearAll();
    }

    private resetPersistence(): void {
      this.persistenceService.clear();
    }

    private resetAllPersistence(): void {
      this.persistenceService.hardClear();
    }

    private async resetSw(): Promise<void> {
      if ('serviceWorker' in navigator) {
        const swRegistrations = (await navigator.serviceWorker.getRegistrations()) || [];
        await Promise.all(swRegistrations.map((el) => el.unregister()));
      }
    }

    public onResetAppAndLoginDataClick(): void {
      this.resetAppAndLoginDataConfirmationDialog.show();
    }

    public async onResetAppAndLoginDataConfirm(): Promise<void> {
      await this.resetAppData();
      this.resetAllPersistence();
      window.open('/', '_self');
    }
  }
</script>

<style scoped lang="scss">
  .app-settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include UiGap(4);

    &__title {
      @include UiTypographyHeading4();
      @include UiTextShadow(3);
    }
  }
</style>
