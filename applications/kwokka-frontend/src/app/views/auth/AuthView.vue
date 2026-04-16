<template>
  <AuthorizationLayout class="auth">
    <KwokkaAuth
      v-model:state="state"
      :hcaptchakey="captchaKey"
      :styles="{
        card: {
          fontFamily: 'inherit',
          maxWidth: state !== states.Initial ? '480px' : '400px',
          minHeight:
            state === states.Initial
              ? '414px'
              : state === states.SignInAnonymous
              ? '238px'
              : state === states.SignInEmailPassword
              ? '530px'
              : state === states.ResetPasswordRequest
              ? '316px'
              : state === states.ResetPassword
              ? '474px'
              : 'auto',
        },
      }"
      :endpoint="authEndpoint"
      :resetPasswordToken="restoreToken"
      :googleClientId="googleClientId"
      :discordClientId="discordClientId"
      :discordRedirectUri="discordRedirectUri"
      @signin="onSignin($event)"
      @ppclick="onPrivacyPolicyClick"
      @resetCompleted="onReset()"
      @error="onError($event)"
    />
  </AuthorizationLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { KwokkaAuth, KwokkaAuthError, KwokkaAuthState } from '@kwokka/auth-vue';
  import AuthorizationLayout from '@/app/layouts/AuthorizationLayout.vue';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service/tracker/tracker.service';
  import { ConfigService } from '@/service/config/config.service';
  import { PersistenceService } from '@/service/persistence/persistence.service';
  import { NotificationService } from '@/service/notification/notification.service';
  import { PersistenceKey } from '@/service/persistence/persistence-key';
  import { RouteUtil } from '@/utils/route-util';

  @Component({
    components: {
      AuthorizationLayout,
      KwokkaAuth,
    },
  })
  export default class AuthView extends Vue {
    public restoreToken: string = null;

    @LazyInject(TrackerService)
    public trackerService!: TrackerService;

    @LazyInject(ConfigService)
    public configService!: ConfigService;

    @LazyInject(PersistenceService)
    public persistenceService!: PersistenceService;

    @LazyInject(NotificationService)
    public notificationService!: NotificationService;

    public state: KwokkaAuthState = KwokkaAuthState.Initial;
    public states = KwokkaAuthState;

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
      this.trackerService.event(TrackerService.E_CAT.AUTH, TrackerService.E_NAME.AUTH_PRIVACY_POLICY_CLICK);
    }

    public onSignin({ access, refresh }: { access: string; refresh: string }): void {
      this.persistenceService.storeValue(PersistenceKey.AccessToken, access);
      this.persistenceService.storeValue(PersistenceKey.RefreshToken, refresh);
      this.$router.replace({ name: 'main' });
    }

    public onReset(): void {
      this.$router.replace({ name: 'auth', query: {} });
    }

    public onError(error: KwokkaAuthError): void {
      this.notificationService.showErrors([error]);
    }
  }
</script>
