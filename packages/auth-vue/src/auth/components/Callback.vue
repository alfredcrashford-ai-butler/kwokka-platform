<template>
  <Loader />
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { LoggerService } from '@/service/logger.service';
  import type { AuthService } from '@/service/auth.service';
  import { ErrorWrapper, KwokkaAuthError } from '@/errors';
  import { OauthFailedError } from '@/errors/oauth-failed.error';
  import Captcha from '@/components/Captcha.vue';
  import Loader from '@/components/Loader.vue';
  import { LocationUtil } from '@/utils/location.util';
  import { KwokkaAuthState } from '../auth-state';

  @Component({
    components: { Loader },
    directives: { styles: stylesDirective },
    emits: ['stateChange', 'signin', 'signup', 'error'],
  })
  export default class Callback extends Vue {
    @Inject()
    public captcha: Captcha;

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
      try {
        if (window.location.search.includes('callback=discord')) {
          return this.runDiscordAuthFlow();
        }

        throw new OauthFailedError({ info: 'failed to parse callback url', href: location.href });
      } catch (e: unknown) {
        this.raiseError(e);
      }
    }

    private async runDiscordAuthFlow(): Promise<void> {
      const hashParams = LocationUtil.parseHashParams();
      if (hashParams.error) {
        this.raiseError(new OauthFailedError({ hashParams, context: 'Failed to parse hash params.' }));
        return;
      }

      const accessToken = hashParams.access_token;
      if (!accessToken) {
        this.raiseError(new OauthFailedError({ context: 'Failed to get access token from hash params.' }));
      }

      try {
        let signInResult;
        try {
          signInResult = await this.authService.signInDiscordOauth2(accessToken);
        } catch (e: unknown) {
          if (this.signInOnly) {
            return this.raiseError(e);
          }

          if (e instanceof KwokkaAuthError && e.code === 'CREDENTIAL_INVALID') {
            const captcha = await this.captcha.execute();
            const signupResult = await this.authService.signUpDiscordOauth2(accessToken, captcha);
            this.$emit('signup', signupResult.data);
            signInResult = await this.authService.signInDiscordOauth2(accessToken);
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
      this.logger.error(message || 'Error when signing in with oauth2 callback: ', e);
      this.$emit('error', ErrorWrapper.wrap(e));
      this.$emit('stateChange', KwokkaAuthState.Initial);
    }
  }
</script>
