<template>
  <Loader />
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import { DiscordCredentialEntity } from '@kwokka/entities';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { LoggerService } from '@/service/logger.service';
  import type { AuthService } from '@/service/auth.service';
  import { ErrorWrapper } from '@/errors';
  import { OauthFailedError } from '@/errors/oauth-failed.error';
  import Loader from '@/components/Loader.vue';
  import { KwokkaAuthAddCredentialState } from '../auth-add-credential-state';
  import { LocationUtil } from '@/utils/location.util';

  @Component({
    components: { Loader },
    directives: { styles: stylesDirective },
    emits: ['stateChange', 'create', 'error'],
  })
  export default class Callback extends Vue {
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

    private async runFlow(): Promise<void> {
      try {
        if (window.location.search.includes('callback=discord')) {
          return this.runDiscordFlow();
        }

        throw new OauthFailedError({ info: 'failed to parse callback url', href: location.href });
      } catch (e: unknown) {
        this.raiseError(e);
      }
    }

    private async runDiscordFlow(): Promise<void> {
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
        const credential = new DiscordCredentialEntity({
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
      } catch (e: any) {
        this.raiseError(e);
      }
    }

    private raiseError(e: unknown, message?: string): void {
      this.logger.error(message || 'Error when adding new credential with oauth2 callback: ', e);
      this.$emit('error', ErrorWrapper.wrap(e));
      this.$emit('stateChange', KwokkaAuthAddCredentialState.Initial);
    }
  }
</script>
