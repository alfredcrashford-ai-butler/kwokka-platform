<template>
  <AuthorizationLayout>
    <div class="setup-profile-container">
      <div class="setup-profile ui-9-box">
        <UiLoader v-if="isLoading" />
        <template v-else>
          <h1 class="setup-profile__heading">{{ $t('avatar.setup.title') }}</h1>
          <KwokkaSimpleAvatarSetup
            :accessToken="accessToken"
            :locale="locale"
            :styles="{
              container: {
                fontSize: 'calc(var(--pwsm--font-size)',
                fontFamily: 'inherit',
                gap: 'calc(4 * var(--pwsm--spacing-unit))',
              },
              button: {
                fontSize: '1.25em',
                nineBoxWidth: 'calc(4 * var(--pwsm--spacing-unit))',
                nineBoxHeight: 'calc(4 * var(--pwsm--spacing-unit))',
                borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
                height: 'calc(14 * var(--pwsm--spacing-unit))',
              },
              nextButton: {
                nineBoxTopLeft: 'url(/static/ui/button/primary/button_primary_top_left.webp)',
                nineBoxTop: 'url(/static/ui/button/primary/button_primary_top.webp)',
                nineBoxTopRight: 'url(/static/ui/button/primary/button_primary_top_right.webp)',
                nineBoxLeft: 'url(/static/ui/button/primary/button_primary_left.webp)',
                nineBoxCenter: 'url(/static/ui/button/primary/button_primary_center.webp)',
                nineBoxRight: 'url(/static/ui/button/primary/button_primary_right.webp)',
                nineBoxBottomLeft: 'url(/static/ui/button/primary/button_primary_bottom_left.webp)',
                nineBoxBottom: 'url(/static/ui/button/primary/button_primary_bottom.webp)',
                nineBoxBottomRight: 'url(/static/ui/button/primary/button_primary_bottom_right.webp)',
                border: 'none',
                backgroundColor: 'none',
              },
              name: {
                gap: 'calc(4 * var(--pwsm--spacing-unit))',
              },
              description: {
                filter: 'url(#pwsm-outline-1)',
                fontSize: '1em',
              },
              input: {
                backgroundColor: 'rgba(82, 60, 48, 0.5)',
                border: 'calc(0.25 * var(--pwsm--spacing-unit)) solid rgba(82, 60, 48, 0.75)',
                borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
                padding: 'calc(1 * var(--pwsm--spacing-unit)) calc(3 * var(--pwsm--spacing-unit))',
                height: 'calc(14 * var(--pwsm--spacing-unit))',
                fontSize: '1.25em',
              },
              inputLabel: {
                filter: 'url(#pwsm-outline-2)',
              },
            }"
            :endpoint="configService.frontendConfig.avatarGateway"
            :decorationsSrc="configService.frontendConfig.kwokkaDecorationsSrc"
            @completed="onCompleted()"
            @error="onError($event)"
          />
        </template>
      </div>
    </div>
  </AuthorizationLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { KwokkaSimpleAvatarSetup } from '@kwokka/avatar-vue';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import { LoggerService } from '@/service/logger/logger.service';
  import { ConfigService } from '@/service/config/config.service';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';
  import { KwokkaService } from '@/service/kwokka/kwokka.service';
  import AuthorizationLayout from '@/app/components/AuthorizationLayout.vue';
  import { ErrorTrackerService, TranslationService } from '@/service';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      AuthorizationLayout,
      KwokkaSimpleAvatarSetup,
      UiLoader,
    },
  })
  export default class SetupProfileView extends Vue {
    public isLoading = true;

    @LazyInject(ConfigService)
    public configService!: ConfigService;

    @LazyInject(KwokkaService)
    public kwokkaService!: KwokkaService;

    @LazyInject(NotificationService)
    public notificationService!: NotificationService;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService!: ErrorTrackerService;

    @LazyInject(LoggerService)
    public logger!: LoggerService;

    @LazyInject(TranslationService)
    public translationService!: TranslationService;

    public get locale(): string {
      return this.translationService.getSavedLocale();
    }

    public get accessToken(): string {
      return this.kwokkaService.client.accessToken;
    }

    public async mounted(): Promise<void> {
      const profile = await this.kwokkaService.client.profile.getOwnProfile();
      const profileDecorations = await this.kwokkaService.client.profile.getOwnProfileDecorations();
      if (!profile || !profileDecorations) {
        this.isLoading = false;
      } else {
        this.$router.replace({ name: RouteName.Main });
      }
    }

    public onCompleted(): void {
      this.notificationService.show({ type: 'success', text: this.$t('avatar.setup.successNotification') });
      this.$router.replace({ name: RouteName.Main });
    }

    public onError(error: any): void {
      this.logger.error(error);
      this.notificationService.showErrors([error]);
      this.errorTrackerService.captureError(error);
    }
  }
</script>

<style scoped lang="scss">
  .setup-profile-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .setup-profile {
    --pwsm--setup-profile--button-size: #{UiSpacing(7)};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: UiSpacing(100);
    @include UiGap(4);
    @include UiPadding(8, top);
    @include UiPadding(8, left);
    @include UiPadding(8, right);
    @include UiPadding(12, bottom);
    @include Ui9BoxWidth(UiSpacing(12));
    @include Ui9BoxHeight(UiSpacing(12));
    @include Ui9BoxTopLeft('/static/ui/card_1/card_1_top_left.webp');
    @include Ui9BoxTop('/static/ui/card_1/card_1_top.webp');
    @include Ui9BoxTopRight('/static/ui/card_1/card_1_top_right.webp');
    @include Ui9BoxLeft('/static/ui/card_1/card_1_left.webp');
    @include Ui9BoxCenter('/static/ui/card_1/card_1_center.webp');
    @include Ui9BoxRight('/static/ui/card_1/card_1_right.webp');
    @include Ui9BoxBottomLeft('/static/ui/card_1/card_1_bottom_left.webp');
    @include Ui9BoxBottom('/static/ui/card_1/card_1_bottom.webp');
    @include Ui9BoxBottomRight('/static/ui/card_1/card_1_bottom_right.webp');
    @include UiDropShadow(3);

    &__heading {
      filter: url('#pwsm-outline-4');
    }
  }
</style>
