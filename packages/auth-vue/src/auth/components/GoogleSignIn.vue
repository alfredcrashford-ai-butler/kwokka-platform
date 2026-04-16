<template>
  <Loader />
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import { stylesDirective } from '@/styles/styles-directive';
  import { GoogleOauth2Service } from '@/service/google-oauth2.service';
  import type { LoggerService } from '@/service/logger.service';
  import type { AuthService } from '@/service/auth.service';
  import { ErrorWrapper, KwokkaAuthError } from '@/errors';
  import Captcha from '@/components/Captcha.vue';
  import Loader from '@/components/Loader.vue';
  import { KwokkaAuthState } from '../auth-state';

  @Component({
    components: { Loader },
    directives: { styles: stylesDirective },
    emits: ['signup', 'error', 'signin', 'reset'],
  })
  export default class GoogleSignIn extends Vue {
    @Inject()
    public captcha: Captcha;

    @Inject()
    public googleOauth2Service: GoogleOauth2Service;

    @Inject()
    public authService: AuthService;

    @Inject()
    public logger: LoggerService;

    @Inject()
    public signInOnly: boolean;

    public created(): void {
      this.runAuthFlow();
    }

    private async runAuthFlow(): Promise<void> {
      let accessToken;
      try {
        accessToken = await this.googleOauth2Service.performOauth2();
      } catch (e: unknown) {
        return this.raiseError(e, 'Failed to get access token from google oauth2: ');
      }

      try {
        let signInResult;
        try {
          signInResult = await this.authService.signInGoogleOauth2(accessToken);
        } catch (e: unknown) {
          if (this.signInOnly) {
            return this.raiseError(e);
          }

          if (e instanceof KwokkaAuthError && e.code === 'CREDENTIAL_INVALID') {
            const captcha = await this.captcha.execute();
            const signupResult = await this.authService.signUpGoogleOauth2(accessToken, captcha);
            this.$emit('signup', signupResult.data);
            signInResult = await this.authService.signInGoogleOauth2(accessToken);
          } else {
            return this.raiseError(e);
          }
        }

        this.$emit('signin', signInResult.data);
      } catch (e: unknown) {
        this.raiseError(e);
      }
    }

    private raiseError(e: unknown, message?: string): void {
      this.logger.error(message || 'Error when signing in with google oauth2: ', e);
      this.$emit('error', ErrorWrapper.wrap(e));
      this.$emit('stateChange', KwokkaAuthState.Initial);
    }
  }
</script>
