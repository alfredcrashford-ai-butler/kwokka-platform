<template>
  <div class="app-settings">
    <UiHeading size="2" sizeMobile="4">{{ $t('settings.app.title') }}</UiHeading>

    <p class="app-settings__caption">{{ $t('settings.app.description') }}</p>

    <UiSimpleSelect
      labelKey="label"
      :options="localeOptions"
      :modelValue="locale"
      :label="$t('settings.app.localeLabel')"
      :placeholder="$t('settings.app.localePlaceholder')"
      :disabled="isLocaleUpdating"
      @update:modelValue="onLocaleUpdate($event)"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import UiSimpleSelect from '@/app/ui-kit/UiSimpleSelect.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import { LazyInject } from '@/ioc';
  import { ProfileService } from '@/service/profile/profile.service';
  import { ProfileApi } from '@/api/avatar/profile/profile.api';
  import { TranslationLocales, TranslationService } from '@/service/translation/translation.service';
  import { NotificationService } from '@/service/notification/notification.service';

  @Component({
    components: {
      UiHeading,
      UiSimpleSelect,
    },
  })
  export default class AppSettings extends Vue {
    public isLocaleUpdating = false;

    @LazyInject(ProfileService)
    public profileService: ProfileService;

    @LazyInject(TranslationService)
    public translationService: TranslationService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(ProfileApi)
    public profileApi: ProfileApi;

    public get localeOptions(): { label: string; value: string }[] {
      return Object.values(TranslationLocales).map((value) => ({ label: this.$t(`language.${value}`), value }));
    }

    public get locale(): { label: string; value: string } {
      return this.localeOptions.find((el) => el.value === this.profileService?.profile?.locale);
    }

    public async onLocaleUpdate(data: { label: string; value: TranslationLocales }): Promise<void> {
      try {
        this.isLocaleUpdating = true;
        const profile = await this.profileApi.updateOwnProfile({ locale: data.value });
        this.profileService.setProfile(profile);
        this.translationService.setAndSaveLocale(data.value);
        this.notificationService.show({ type: 'success', text: this.$t('settings.app.updatedLocaleSuccessfully') });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      } finally {
        this.isLocaleUpdating = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-settings {
    display: flex;
    flex-direction: column;
    @include UiGap(4, false);

    &__caption {
      @include UiTypographyParagraph2();
      opacity: 0.7;
    }
  }
</style>
