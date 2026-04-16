<template>
  <Loader />
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import type { AuthService } from '@/service/auth.service';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { LoggerService } from '@/service/logger.service';
  import { GoogleCredentialEntity } from '@kwokka/entities';
  import { ErrorWrapper } from '@/errors';
  import Loader from '@/components/Loader.vue';
  import type { GoogleOauth2Service } from '@/service/google-oauth2.service';
  import { KwokkaAuthAddCredentialState } from '../auth-add-credential-state';

  @Component({
    components: { Loader },
    directives: { styles: stylesDirective },
    emits: ['create', 'error', 'stateChange'],
  })
  export default class AddGoogleCredential extends Vue {
    @Inject()
    public googleOauth2Service: GoogleOauth2Service;

    @Inject()
    public authService: AuthService;

    @Inject()
    public logger: LoggerService;

    @Inject()
    public accessToken: string;

    @Prop({ default: null })
    public accountId: string;

    public created(): void {
      this.runFlow();
    }

    public async runFlow(): Promise<void> {
      let accessToken;
      try {
        accessToken = await this.googleOauth2Service.performOauth2();
      } catch (e: unknown) {
        return this.raiseError(e, 'Failed to get access token from google oauth2: ');
      }

      try {
        const credential = new GoogleCredentialEntity({
          accountId: this.accountId,
          identifier: null,
          data: null,
          isVerified: false,
        });

        const newCredential = await this.authService.addCredential(
          credential,
          this.accessToken,
          this.accountId,
          accessToken,
        );

        this.$emit('create', newCredential);
      } catch (e) {
        this.raiseError(e);
      }
    }

    private raiseError(e: unknown, message?: string): void {
      this.logger.error(message || 'Error when adding new credential with google oauth2: ', e);
      this.$emit('error', ErrorWrapper.wrap(e));
      this.$emit('stateChange', KwokkaAuthAddCredentialState.Initial);
    }
  }
</script>
