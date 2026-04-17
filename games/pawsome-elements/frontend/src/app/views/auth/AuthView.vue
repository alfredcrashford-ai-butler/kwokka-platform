<template>
  <AuthorizationLayout class="auth">
    <div class="auth__container">
      <div class="auth__logo">
        <UiResponsiveImage src="/static/logo_horizontal.webp" class="auth__logo-image" />
      </div>
      <KwokkaAuth
        v-model:state="state"
        :hcaptchakey="captchaKey"
        :styles="{
          card: {
            fontSize: 'var(--pwsm--font-size)',
            fontFamily: 'inherit',
            maxWidth: 'var(--pwsm--auth--card-max-width)',
            width: '100%',
            nineBoxWidth: 'calc(12 * var(--pwsm--spacing-unit))',
            nineBoxHeight: 'calc(12 * var(--pwsm--spacing-unit))',
            nineBoxTopLeft: 'url(/static/ui/card_1/card_1_top_left.webp)',
            nineBoxTop: 'url(/static/ui/card_1/card_1_top.webp)',
            nineBoxTopRight: 'url(/static/ui/card_1/card_1_top_right.webp)',
            nineBoxLeft: 'url(/static/ui/card_1/card_1_left.webp)',
            nineBoxCenter: 'url(/static/ui/card_1/card_1_center.webp)',
            nineBoxRight: 'url(/static/ui/card_1/card_1_right.webp)',
            nineBoxBottomLeft: 'url(/static/ui/card_1/card_1_bottom_left.webp)',
            nineBoxBottom: 'url(/static/ui/card_1/card_1_bottom.webp)',
            nineBoxBottomRight: 'url(/static/ui/card_1/card_1_bottom_right.webp)',
            backgroundColor: 'none',
            border: 'none',
            borderRadius: 'none',
            padding: 'var(--pwsm--auth--card-padding)',
            filter: 'var(--pwsm-drop-shadow-3)',
            margin: '0',
          },
          backButton: {
            margin: 'var(--pwsm--auth--back-button-margin)',
          },
          resetPasswordRequest: {
            submit: primaryButton,
            heading: {
              textShadow: 'var(--pwsm-text-shadow-3)',
              fontSize: '2em',
              margin: '0 0 calc(2 * var(--pwsm--spacing-unit)) 0',
            },
          },
          heading: {
            textShadow: 'var(--pwsm-text-shadow-3)',
            fontSize: '2em',
            margin: '0 0 calc(2 * var(--pwsm--spacing-unit)) 0',
          },
          button: {
            fontSize: '1.25em',
            nineBoxWidth: 'calc(4 * var(--pwsm--spacing-unit))',
            nineBoxHeight: 'calc(4 * var(--pwsm--spacing-unit))',
            borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
            height: 'calc(14 * var(--pwsm--spacing-unit))',
          },
          optionsList: {
            gap: 'calc(3 * var(--pwsm--spacing-unit))',
          },
          googleButton: {
            nineBoxTopLeft: 'url(/static/ui/button/light/button_light_top_left.webp)',
            nineBoxTop: 'url(/static/ui/button/light/button_light_top.webp)',
            nineBoxTopRight: 'url(/static/ui/button/light/button_light_top_right.webp)',
            nineBoxLeft: 'url(/static/ui/button/light/button_light_left.webp)',
            nineBoxCenter: 'url(/static/ui/button/light/button_light_center.webp)',
            nineBoxRight: 'url(/static/ui/button/light/button_light_right.webp)',
            nineBoxBottomLeft: 'url(/static/ui/button/light/button_light_bottom_left.webp)',
            nineBoxBottom: 'url(/static/ui/button/light/button_light_bottom.webp)',
            nineBoxBottomRight: 'url(/static/ui/button/light/button_light_bottom_right.webp)',
            border: 'none',
            backgroundColor: 'none',
          },
          discordButton: {
            nineBoxTopLeft: 'url(/static/ui/button/discord/button_discord_top_left.webp)',
            nineBoxTop: 'url(/static/ui/button/discord/button_discord_top.webp)',
            nineBoxTopRight: 'url(/static/ui/button/discord/button_discord_top_right.webp)',
            nineBoxLeft: 'url(/static/ui/button/discord/button_discord_left.webp)',
            nineBoxCenter: 'url(/static/ui/button/discord/button_discord_center.webp)',
            nineBoxRight: 'url(/static/ui/button/discord/button_discord_right.webp)',
            nineBoxBottomLeft: 'url(/static/ui/button/discord/button_discord_bottom_left.webp)',
            nineBoxBottom: 'url(/static/ui/button/discord/button_discord_bottom.webp)',
            nineBoxBottomRight: 'url(/static/ui/button/discord/button_discord_bottom_right.webp)',
            border: 'none',
            backgroundColor: 'none',
            textShadow: 'var(--pwsm-text-shadow-1)',
          },
          emailButton: darkButton,
          anonButton: darkButton,
          anon: {
            retryButton: primaryButton,
          },
          terms: {
            textShadow: 'var(--pwsm-text-shadow-1)',
            fontSize: '0.8em',
            margin: 'calc(2 * var(--pwsm--spacing-unit)) 0 0 0',
          },
          links: {
            color: 'rgb(var(--pwsm-primary-500))',
          },
          delimiter: {
            textShadow: 'var(--pwsm-text-shadow-1)',
            color: '#FFF',
            margin: 'var(--pwsm--spacing-unit)',
          },
          input: {
            backgroundColor: 'rgba(82, 60, 48, 0.5)',
            border: 'calc(0.25 * var(--pwsm--spacing-unit)) solid rgba(82, 60, 48, 0.75)',
            borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
            padding: 'calc(1 * var(--pwsm--spacing-unit)) calc(3 * var(--pwsm--spacing-unit))',
            height: 'calc(14 * var(--pwsm--spacing-unit))',
            fontSize: '1.25em',
          },
          icon: {
            width: 'calc(6 * var(--pwsm--spacing-unit))',
            height: 'calc(6 * var(--pwsm--spacing-unit))',
          },
          passwordButton: {
            backgroundColor: 'none',
          },
          email: {
            submit: primaryButton,
            emailInput: {
              margin: '0 0 calc(3 * var(--pwsm--spacing-unit)) 0',
            },
            passwordInput: {
              margin: '0 0 calc(3 * var(--pwsm--spacing-unit)) 0',
            },
            resetPasswordButton: {
              textShadow: 'var(--pwsm-text-shadow-1)',
              color: 'rgb(var(--pwsm-primary-500))',
              padding: '0',
              margin: '0 0 calc(3 * var(--pwsm--spacing-unit)) auto',
              fontSize: '0.8em',
              height: 'calc(4 * var(--pwsm--spacing-unit))',
            },
            suggestionList: {
              margin: '0 0 calc(6 * var(--pwsm--spacing-unit)) 0',
              padding: 'calc(2 * var(--pwsm--spacing-unit))',
              backgroundColor: 'rgba(82, 60, 48, 0.5)',
              border: 'calc(0.25 * var(--pwsm--spacing-unit)) solid rgba(82, 60, 48, 0.75)',
              borderRadius: 'calc(1 * var(--pwsm--spacing-unit))',
            },
          },
          suggestion: {
            fontSize: '0.8em',
          },
          suggestionPositive: {
            color: 'rgb(var(--pwsm-positive-400))',
          },
          suggestionNegative: {
            color: 'rgb(var(--pwsm-negative-300))',
          },
        }"
        :endpoint="authEndpoint"
        :resetPasswordToken="restoreToken"
        :googleClientId="googleClientId"
        :discordClientId="discordClientId"
        :discordRedirectUri="discordRedirectUri"
        :ppUrl="configService.frontendConfig.links.privacyPolicy"
        :options="credentialsOptions"
        :signInOnly="true"
        @signin="onSignin($event)"
        @signup="onSignUp()"
        @ppclick="onPrivacyPolicyClick()"
        @resetCompleted="onReset()"
        @error="onError($event)"
      />
      <UiButton class="auth__back" type="secondary" @click="onBackClick()">
        <UiIcon name="arrow-left" />
        <span>{{ $t('auth.back') }}</span>
      </UiButton>
    </div>
    <Settings class="auth__settings">
      <AppSettings />
      <AudioSettings />
      <LegalInfo />
    </Settings>
  </AuthorizationLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { KwokkaAuth, KwokkaAuthError, KwokkaAuthState } from '@kwokka/auth-vue';
  import { CredentialEntityType } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { ErrorCode, RouteUtil } from '@/util';
  import {
    ConfigService,
    ErrorTrackerService,
    KwokkaService,
    LoggerService,
    NotificationService,
    TrackerService,
  } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { RouteName } from '@/app/route-name';
  import { AppSettings, AudioSettings, AuthorizationLayout, LegalInfo, Settings } from '@/app/components';
  import { UiButton, UiIcon, UiResponsiveImage } from '@/app/ui-kit';

  @Component({
    components: {
      AuthorizationLayout,
      KwokkaAuth,
      Settings,
      AppSettings,
      AudioSettings,
      LegalInfo,
      UiResponsiveImage,
      UiButton,
      UiIcon,
    },
  })
  export default class AuthView extends Vue {
    public restoreToken: string = null;

    @LazyInject(TrackerService)
    public trackerService!: TrackerService;

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

    public readonly credentialsOptions = [
      CredentialEntityType.Google,
      CredentialEntityType.Discord,
      CredentialEntityType.EmailPassword,
    ];
    public state: KwokkaAuthState = KwokkaAuthState.Initial;
    public states = KwokkaAuthState;

    public readonly darkButton = {
      nineBoxTopLeft: 'url(/static/ui/button/dark/button_dark_top_left.webp)',
      nineBoxTop: 'url(/static/ui/button/dark/button_dark_top.webp)',
      nineBoxTopRight: 'url(/static/ui/button/dark/button_dark_top_right.webp)',
      nineBoxLeft: 'url(/static/ui/button/dark/button_dark_left.webp)',
      nineBoxCenter: 'url(/static/ui/button/dark/button_dark_center.webp)',
      nineBoxRight: 'url(/static/ui/button/dark/button_dark_right.webp)',
      nineBoxBottomLeft: 'url(/static/ui/button/dark/button_dark_bottom_left.webp)',
      nineBoxBottom: 'url(/static/ui/button/dark/button_dark_bottom.webp)',
      nineBoxBottomRight: 'url(/static/ui/button/dark/button_dark_bottom_right.webp)',
      border: 'none',
      backgroundColor: 'none',
      textShadow: 'var(--pwsm-text-shadow-1)',
    };
    public readonly primaryButton = {
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
      textShadow: 'var(--pwsm-text-shadow-1)',
    };

    public get selectedSignInType(): string {
      return this.$route.query.type as string;
    }

    public get captchaKey(): string {
      return this.configService.frontendConfig.hcaptchakey;
    }

    public get authEndpoint(): string {
      return this.configService.frontendConfig.authGateway;
    }

    public get googleClientId(): string {
      return this.configService.frontendConfig.oauth.googleClientId;
    }

    public get discordClientId(): string {
      return this.configService.frontendConfig.oauth.discordClientId;
    }

    public get discordRedirectUri(): string {
      return this.configService.frontendConfig.oauth.discordAuthRedirectUri;
    }

    public mounted(): void {
      // rt stands for restore token
      const token = RouteUtil.getQueryParam(this.$route.query.rt);
      if (token) {
        this.restoreToken = token;
        this.state = KwokkaAuthState.ResetPassword;
        return;
      }

      const callbackQueryParam = RouteUtil.getQueryParam(this.$route.query.callback);
      if (callbackQueryParam) {
        this.state = KwokkaAuthState.Callback;
      }
    }

    public onPrivacyPolicyClick(): void {
      this.trackerService.event(TrackingCategory.Auth, TrackingEvent.PrivacyPolicyClick);
    }

    public onSignin({ access, refresh }: { access: string; refresh: string }): void {
      this.kwokkaService.client.authorize(access, refresh);
      this.trackerService.event(TrackingCategory.Auth, TrackingEvent.SignIn);
      this.$router.replace({ name: RouteName.Main });
    }

    public onSignUp(): void {
      this.trackerService.event(TrackingCategory.Auth, TrackingEvent.SignUp);
    }

    public onReset(): void {
      this.$router.replace({ name: RouteName.Auth, query: {} });
    }

    public onError(error: KwokkaAuthError): void {
      this.logger.error(error);
      this.notificationService.showErrors([error]);
      if (![ErrorCode.OauthPopupClosed, ErrorCode.CaptchaError].includes(error.code)) {
        this.errorTrackerService.captureError(error);
      }
    }

    public onBackClick(): void {
      this.$router.replace(RouteName.Main);
    }
  }
</script>

<style lang="scss" scoped>
  .auth {
    --pwsm--auth--card-max-width: min(#{UiSpacing(120)}, 100vw);
    --pwsm--auth--card-padding: #{UiSpacing(24)} #{UiSpacing(8)} #{UiSpacing(12)} #{UiSpacing(8)};
    --pwsm--auth--back-button-margin: #{UiSpacing(24)} #{UiSpacing(12)};

    &__container {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    &__logo {
      width: UiSpacing(120);
      z-index: 1;
      height: 0;
      pointer-events: none;
    }

    &__logo-image {
      width: 100%;
      aspect-ratio: 2;
      transform: translateY(-50%);
    }

    &__settings {
      position: absolute;
      left: UiSpacing(2);
      top: UiSpacing(2);
      z-index: 1;
    }

    &__back {
      @include UiMargin(4, top);
    }
  }
</style>
