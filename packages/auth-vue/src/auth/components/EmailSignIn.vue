<template>
  <EmailPasswordForm
    :isDisabled="isAuthInProgress"
    :isResetPasswordShown="true"
    :submitText="$t('auth.email.signIn')"
    @resetPassword="$emit('stateChange', states.ResetPasswordRequest)"
    @submit="onSubmit($event.email, $event.password)"
  />
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import Captcha from '@/components/Captcha.vue';
  import type { AuthService } from '@/service/auth.service';
  import type { LoggerService } from '@/service/logger.service';
  import { KwokkaAuthState } from '../auth-state';
  import EmailPasswordForm from '@/components/EmailPasswordForm.vue';
  import { KwokkaAuthError, ErrorWrapper } from '@/errors';

  @Component({
    components: { EmailPasswordForm },
    emits: ['signup', 'error', 'signin', 'stateChange'],
  })
  export default class EmailSignIn extends Vue {
    @Inject()
    public authService: AuthService;

    @Inject()
    public logger: LoggerService;

    @Inject()
    public captcha: Captcha;

    @Inject()
    public signInOnly: boolean;

    public readonly states = KwokkaAuthState;
    public isAuthInProgress: boolean = false;

    public async onSubmit(email: string, password: string): Promise<void> {
      try {
        this.isAuthInProgress = true;
        let signInResult;
        try {
          signInResult = await this.authService.signInEmail(email, password);
        } catch (error: any) {
          if (this.signInOnly) {
            return this.raiseError(error);
          }

          if (error instanceof KwokkaAuthError && error.code === 'CREDENTIAL_INVALID') {
            const captcha = await this.captcha.execute();
            const signupResult = await this.authService.signUpEmail(email, password, captcha);
            this.$emit('signup', signupResult.data);
            signInResult = await this.authService.signInEmail(email, password);
          } else {
            this.raiseError(error);

            return;
          }
        }

        this.$emit('signin', signInResult.data);
      } catch (error: any) {
        this.raiseError(error);
      } finally {
        this.isAuthInProgress = false;
      }
    }

    private raiseError(error: any): void {
      this.logger.error('Error when signing in with email: ', error);
      this.$emit('error', ErrorWrapper.wrap(error));
      this.isAuthInProgress = false;
    }
  }
</script>
