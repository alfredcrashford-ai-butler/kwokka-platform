<template>
  <div class="legal-info">
    <UiButton type="link" @click="dialog.show()">{{ $t('general.legalInfo.title') }}</UiButton>
    <UiDialog
      ref="dialog"
      :title="$t('general.legalInfo.title')"
      :isPrimaryButtonShown="false"
      :isSecondaryButtonShown="false"
      :isCloseButtonShown="true"
    >
      <template v-slot:body>
        <div class="legal-info__content">
          <p>{{ $t('general.legalInfo.description') }}</p>
          <a :href="configService.frontendConfig.links.legalNotice" target="_blank" v-ui-sound>
            {{ $t('general.legalInfo.legalNotice') }}
          </a>
          <a :href="configService.frontendConfig.links.privacyPolicy" target="_blank" v-ui-sound>
            {{ $t('general.legalInfo.privacyPolicy') }}
          </a>
          <hr />
          <p>{{ $t('general.legalInfo.ourWebsites') }}</p>
          <a :href="configService.frontendConfig.links.website" target="_blank" v-ui-sound>
            {{ configService.frontendConfig.links.website }}
          </a>
          <a :href="configService.frontendConfig.links.kwokkaWebsite" target="_blank" v-ui-sound>
            {{ configService.frontendConfig.links.kwokkaWebsite }}
          </a>
          <!-- <hr />
          <UiButton type="blue" size="xl" @click="onManageCookiePreferencesClick()">
            {{ $t('general.legalInfo.manageCookiePreferences') }}
          </UiButton>
          <hr /> -->
          <p>{{ $t('general.legalInfo.copyright', { year: new Date().getFullYear() }) }}</p>
        </div>
      </template>
    </UiDialog>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { ConfigService, CookieService } from '@/service';
  import { UiButton, UiDialog } from '@/app/ui-kit';

  @Component({
    components: {
      UiDialog,
      UiButton,
    },
  })
  export default class LegalInfo extends Vue {
    @Ref()
    public dialog: UiDialog;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(CookieService)
    public cookieService: CookieService;

    public onManageCookiePreferencesClick(): void {
      this.cookieService.showPreferences();
    }
  }
</script>

<style scoped lang="scss">
  .legal-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @include UiGap(4);

    &__title {
      @include UiTypographyHeading4();
      @include UiTextShadow(3);
    }

    &__content {
      @include UiTypographyParagraph1();
      @include UiTextShadow(2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      @include UiGap(4);

      hr {
        width: 100%;
        @include UiMargin(4, top);
        @include UiMargin(4, bottom);
        border-bottom: 1px solid UiColor(shade-900, 0.5);
      }
    }
  }
</style>
