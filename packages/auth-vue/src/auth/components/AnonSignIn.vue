<template>
  <div class="kwokka-auth-anon" :inert="isAuthInProgress">
    <Loader class="kwokka-auth-anon__loader" v-if="isAuthInProgress" />
    <Button
      class="kwokka-auth-anon__retry"
      v-else
      v-styles="styles?.anon?.retryButton"
      @click="signInOrSignUpAndSignIn"
      >{{ $t('auth.anon.retry') }}</Button
    >
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';
  import Loader from '@/components/Loader.vue';
  import Captcha from '@/components/Captcha.vue';
  import Button from '@/components/Button.vue';
  import type { AuthService, OwlResponse } from '@/service/auth.service';
  import type { LoggerService } from '@/service/logger.service';
  import { ErrorWrapper } from '@/errors/error-wrapper';

  const ANON_ACCOUNT_ID_KEY = '[kwokka-auth][anon-account-id]';

  @Component({
    components: { Loader, Button },
    directives: { styles: stylesDirective },
    emits: ['signup', 'error', 'signin'],
  })
  export default class AnonSignIn extends Vue {
    @Inject()
    public styles: KwokkaAuthStyles;

    @Inject()
    public authService: AuthService;

    @Inject()
    public logger: LoggerService;

    @Inject()
    public captcha: Captcha;

    public isAuthInProgress: boolean = true;

    public mounted(): void {
      this.signInOrSignUpAndSignIn();
    }

    public async signInOrSignUpAndSignIn(): Promise<void> {
      try {
        this.isAuthInProgress = true;
        let accountId = await this.signIn();
        if (accountId) {
          this.isAuthInProgress = false;
          return;
        }

        const signupResult = await this.signUp();
        accountId = signupResult?.data?.accountId;
        localStorage.setItem(ANON_ACCOUNT_ID_KEY, accountId);
        await this.signIn();
      } catch (error: any) {
        this.logger.error('Error when signing in as anon: ', error);
        this.$emit('error', ErrorWrapper.wrap(error));
      } finally {
        this.isAuthInProgress = false;
      }
    }

    private async signUp(): Promise<OwlResponse<{ accountId: string }>> {
      const signupResult = await this.authService.signUpAnon();
      this.$emit('signup', signupResult.data);
      return signupResult;
    }

    private async signIn(): Promise<void | string> {
      let accountId = localStorage.getItem(ANON_ACCOUNT_ID_KEY);

      if (!accountId) {
        return;
      }

      try {
        const result = await this.authService.signInAnon(accountId);
        this.$emit('signin', result.data);
        return accountId;
      } catch (error: any) {
        localStorage.removeItem(ANON_ACCOUNT_ID_KEY);
        this.logger.error('Error when signing in as anon: ', error);
        this.$emit('error', ErrorWrapper.wrap(error));
        return accountId;
      }
    }
  }
</script>
