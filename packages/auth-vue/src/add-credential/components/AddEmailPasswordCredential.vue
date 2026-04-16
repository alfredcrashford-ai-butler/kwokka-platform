<template>
  <EmailPasswordForm
    :isDisabled="isFormDisabled"
    :isResetPasswordShown="false"
    :submitText="$t('auth.addCredentialSubmit')"
    @submit="onSubmit($event.email, $event.password)"
  />
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import type { AuthService } from '@/service/auth.service';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { LoggerService } from '@/service/logger.service';
  import { EmailPasswordCredentialEntity } from '@kwokka/entities';
  import EmailPasswordForm from '@/components/EmailPasswordForm.vue';
  import { ErrorWrapper } from '@/errors';

  @Component({
    components: { EmailPasswordForm },
    directives: { styles: stylesDirective },
    emits: ['create', 'error'],
  })
  export default class AddEmailPasswordCredential extends Vue {
    @Inject()
    public authService: AuthService;

    @Inject()
    public logger: LoggerService;

    @Inject()
    public accessToken: string;

    @Prop({ default: null })
    public accountId: string;

    public isFormDisabled: boolean = false;

    public async onSubmit(email: string, password: string): Promise<void> {
      try {
        this.isFormDisabled = true;
        const credential = new EmailPasswordCredentialEntity({
          accountId: this.accountId,
          identifier: email,
          data: { email, password },
          isVerified: false,
        });
        const newCredential = await this.authService.addCredential(credential, this.accessToken, this.accountId);
        this.$emit('create', newCredential);
      } catch (error) {
        this.logger.error('Error when adding new credential: ', error);
        this.$emit('error', ErrorWrapper.wrap(error));
      } finally {
        this.isFormDisabled = false;
      }
    }
  }
</script>
