<template>
  <div class="kwokka-auth kwokka-auth-block" v-styles="styles?.card">
    <Button
      v-styles="styles?.backButton"
      class="kwokka-auth__back-button"
      :class="{
        'kwokka-auth__back-button_hidden': !isStateWithBackButton,
      }"
      :title="$t('auth.back')"
      @click="setState(states.Initial)"
    >
      <Icon name="arrow-left" />
    </Button>

    <h1
      class="kwokka-auth__heading kwokka-auth-block"
      v-styles="styles?.heading"
      v-if="$te('auth.heading') && !isStateWithTitle"
    >
      {{ $t('auth.heading') }}
    </h1>

    <Options
      v-if="state === states.Initial"
      :items="authItems"
      @signup="onSignup($event)"
      @signin="onSignin($event)"
      @error="onError($event)"
      @select="onOptionSelect($event)"
    />

    <Success v-if="state === states.Success" />

    <ResetPasswordRequest
      v-if="state === states.ResetPasswordRequest"
      @resetRequested="onResetRequested()"
      @error="onError($event)"
    />

    <ResetPassword
      v-if="state === states.ResetPassword"
      @resetCompleted="onResetCompleted($event)"
      @error="onError($event)"
    />

    <Callback
      v-if="state === states.Callback"
      @signup="onSignup($event)"
      @signin="onSignin($event)"
      @error="onError($event)"
      @stateChange="setState($event)"
    />

    <div v-if="isAuthState">
      <component
        :is="selectedSignInComponent"
        @stateChange="setState($event)"
        @signup="onSignup($event)"
        @signin="onSignin($event)"
        @error="onError($event)"
      />
    </div>

    <i18n-t
      keypath="auth.conditions"
      tag="div"
      class="kwokka-auth__terms kwokka-auth-block"
      scope="global"
      v-if="isStateWithPrivacyPolicy && $te('auth.conditions')"
      v-styles="styles.terms"
    >
      <a
        class="kwokka-auth-link"
        :href="ppUrl"
        target="_blank"
        :title="$t('auth.conditionsPP')"
        @click="$emit('ppclick', $event)"
        v-styles="styles.links"
      >
        {{ $t('auth.conditionsPP') }}
      </a>
    </i18n-t>

    <Captcha :hcaptchakey="hcaptchakey" ref="captcha" />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Prop, Provide, Ref, Vue } from 'vue-facing-decorator';
  import { CredentialEntityType } from '@kwokka/entities';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';
  import { AuthService } from '@/service/auth.service';
  import { LoggerService } from '@/service/logger.service';
  import { GoogleOauth2Service } from '@/service/google-oauth2.service';
  import { ErrorWrapper } from '@/errors/error-wrapper';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';
  import { KwokkaAuthState } from '@/auth/auth-state';
  import AnonSignIn from '@/auth/components/AnonSignIn.vue';
  import EmailSignIn from '@/auth/components/EmailSignIn.vue';
  import GoogleSignIn from '@/auth/components/GoogleSignIn.vue';
  import DiscordSignIn from '@/auth/components/DiscordSignIn.vue';
  import Callback from '@/auth/components/Callback.vue';
  import Options from '@/components/Options.vue';
  import Success from '@/components/Success.vue';
  import ResetPasswordRequest from './components/ResetPasswordRequest.vue';
  import ResetPassword from './components/ResetPassword.vue';
  import Captcha from '@/components/Captcha.vue';

  @Component({
    components: { Button, Icon, Options, Success, ResetPasswordRequest, ResetPassword, Captcha, Callback },
    emits: ['update:state', 'signin', 'signup', 'error', 'ppclick', 'resetRequested', 'resetCompleted'],
    directives: { styles: stylesDirective },
  })
  export default class KwokkaAuth extends Vue {
    @Prop({ default: KwokkaAuthState.Initial })
    public state: KwokkaAuthState;

    @Provide()
    @Prop({ default: {} })
    public styles: KwokkaAuthStyles;

    @Provide()
    @Prop({ required: true })
    public hcaptchakey: string;

    @Provide()
    @Prop({ required: true })
    public discordClientId: string;

    @Provide()
    @Prop({ required: true })
    public discordRedirectUri: string;

    @Provide()
    @Ref()
    public captcha: Captcha;

    @Provide()
    @Prop({ required: true })
    public googleClientId: string;

    @Prop({ default: 'https://api.kwokka.co/owl' })
    public endpoint: string;

    @Prop({ default: 'https://kwokka.co/privacy-policy' })
    public ppUrl: string;

    @Provide()
    @Prop({ default: false })
    public signInOnly: boolean;

    @Prop({
      default: [
        CredentialEntityType.Google,
        CredentialEntityType.Discord,
        CredentialEntityType.EmailPassword,
        CredentialEntityType.Anonymous,
      ],
    })
    public options: CredentialEntityType[];

    @Provide()
    @Prop({ required: false })
    public resetPasswordToken: string;

    @Provide()
    public authService = new AuthService();

    @Provide()
    public googleOauth2Service = new GoogleOauth2Service();

    @Provide()
    public logger = new LoggerService();

    public get isAuthState(): boolean {
      return [
        KwokkaAuthState.SignInAnonymous,
        KwokkaAuthState.SignInEmailPassword,
        KwokkaAuthState.SignInGoogle,
        KwokkaAuthState.SignInDiscord,
      ].includes(this.state);
    }

    public get isStateWithTitle(): boolean {
      return [KwokkaAuthState.Success, KwokkaAuthState.ResetPasswordRequest, KwokkaAuthState.ResetPassword].includes(
        this.state,
      );
    }

    public get isStateWithBackButton(): boolean {
      return [
        KwokkaAuthState.SignInAnonymous,
        KwokkaAuthState.SignInEmailPassword,
        KwokkaAuthState.ResetPasswordRequest,
      ].includes(this.state);
    }

    public get authItems(): { type: CredentialEntityType; text: string }[] {
      const options = [
        {
          type: CredentialEntityType.EmailPassword,
          text: this.$t('auth.email.name'),
        },
        {
          type: CredentialEntityType.Anonymous,
          text: this.$t('auth.anon.name'),
        },
        {
          type: CredentialEntityType.Google,
          text: this.$t('auth.google.name'),
        },
        {
          type: CredentialEntityType.Discord,
          text: this.$t('auth.discord.name'),
        },
      ];

      return options.filter((el) => this.options.includes(el.type));
    }

    public get isStateWithPrivacyPolicy(): boolean {
      return this.state === KwokkaAuthState.Initial || this.isAuthState;
    }

    public readonly states = KwokkaAuthState;
    public readonly signInComponents = {
      [KwokkaAuthState.SignInAnonymous]: markRaw(AnonSignIn),
      [KwokkaAuthState.SignInEmailPassword]: markRaw(EmailSignIn),
      [KwokkaAuthState.SignInGoogle]: markRaw(GoogleSignIn),
      [KwokkaAuthState.SignInDiscord]: markRaw(DiscordSignIn),
    };

    public created(): void {
      this.authService.setBaseUrl(this.endpoint);
      this.googleOauth2Service.setClientId(this.googleClientId);
    }

    public get selectedSignInComponent(): typeof Vue {
      if (!this.isAuthState) {
        return null;
      }

      return this.signInComponents[this.state];
    }

    public onOptionSelect(option: CredentialEntityType): void {
      const credentialEntityTypeToStateMap = {
        [CredentialEntityType.Anonymous]: KwokkaAuthState.SignInAnonymous,
        [CredentialEntityType.EmailPassword]: KwokkaAuthState.SignInEmailPassword,
        [CredentialEntityType.Google]: KwokkaAuthState.SignInGoogle,
        [CredentialEntityType.Discord]: KwokkaAuthState.SignInDiscord,
      };
      this.setState(credentialEntityTypeToStateMap[option]);
    }

    public setState(state: KwokkaAuthState): void {
      this.$emit('update:state', state);
    }

    public onSignup(data: { accountId: string }): void {
      this.$emit('signup', data);
    }

    public onSignin(data: { access: string; refresh: string }): void {
      this.setState(KwokkaAuthState.Success);
      this.$emit('signin', data);
    }

    public onError(error: any): void {
      this.$emit('error', ErrorWrapper.wrap(error));
    }

    public onResetRequested(): void {
      this.$emit('resetRequested');
    }

    public onResetCompleted(data: { accountId: string }): void {
      this.$emit('resetCompleted', data);
    }
  }
</script>

<style>
  .kwokka-auth,
  .kwokka-auth * {
    box-sizing: border-box;
    transition: all ease-in-out 100ms;
  }

  .kwokka-auth {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition:
      max-width ease-in-out 50ms,
      min-height ease-in-out 50ms 50ms,
      max-height ease-in-out 50ms 50ms;
    --kwk-auth--max-width: 400px;
    --kwk-auth--width: 100%;
    --kwk-auth--background-color: #45305f;
    --kwk-auth--border-radius: 24px;
    --kwk-auth--border: 2px solid #fff;
    --kwk-auth--padding: 40px;
    --kwk-auth--font-family: sans-serif;
    --kwk-auth--color: #fff;
  }

  .kwokka-auth__back-button {
    position: absolute;
    left: 0;
    top: 0;
    --kwk-auth--margin: 56px 0 0 40px;
    --kwk-auth--width: 32px;
    --kwk-auth--height: 32px;
    --kwk-auth--border-radius: 16px;
    --kwk-auth--padding: 0;
    --kwk-auth--border: none;
    --kwk-auth--background-color: none;
  }

  .kwokka-auth__back-button_hidden {
    visibility: hidden;
    opacity: 0;
  }

  .kwokka-auth__heading {
    --kwk-auth--font-size: 40px;
    --kwk-auth--line-height: 1.5;
    --kwk-auth--font-weight: 700;
    --kwk-auth--margin: 0 0 20px 0;
    --kwk-auth--width: fit-content;
  }

  .kwokka-auth__terms {
    --kwk-auth--margin: 20px 0 0 0;
    --kwk-auth--font-size: 12px;
    text-align: center;
  }
</style>
