<template>
  <UiDialog
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
    :title="state === states.Initial ? $t('settings.credentials.add') : null"
    ref="dialog"
    @hide="state = states.Initial"
  >
    <template v-slot:body>
      <div class="add-credential-dialog">
        <KwokkaAuthAddCredential
          v-model:state="state"
          :styles="{
            card: {
              border: 'none',
              borderRadius: 'none',
              padding: '0',
              width: '100%',
              maxWidth: 'auto',
              minHeight: 'auto',
              maxHeight: 'auto',
            },
            successHeading: {
              lineHeight: '1',
            },
          }"
          :googleClientId="googleClientId"
          :accountId="accountId"
          :accessToken="accessToken"
          :endpoint="authEndpoint"
          :discordClientId="discordClientId"
          :discordRedirectUri="discordRedirectUri"
          @created="onCreated($event)"
          @error="onError($event)"
        />
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { KwokkaAuthAddCredential, KwokkaAuthAddCredentialState } from '@kwokka/auth-vue';
  import type { CredentialEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { ConfigService } from '@/service/config/config.service';
  import { AccessService } from '@/service/access/access.service';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';

  @Component({
    components: {
      KwokkaAuthAddCredential,
      UiDialog,
    },
    emits: ['created'],
  })
  export default class AddCredentialDialog extends Vue {
    public state: KwokkaAuthAddCredentialState = KwokkaAuthAddCredentialState.Initial;
    public states = KwokkaAuthAddCredentialState;

    @Ref()
    public dialog: UiDialog;

    @Prop({ default: null })
    public accountId: string;

    @LazyInject(AccessService)
    private accessService: AccessService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public get authEndpoint(): string {
      return this.configService.frontendConfig.authGateway;
    }

    public get googleClientId(): string {
      return this.configService.frontendConfig.oauth.googleClientId;
    }

    public get accessToken(): string {
      return this.accessService.getAccessToken();
    }

    public get discordClientId(): string {
      return this.configService.frontendConfig.oauth.discordClientId;
    }

    public get discordRedirectUri(): string {
      return this.configService.frontendConfig.oauth.discordAddCredentialRedirectUri;
    }

    public showCallback(): void {
      this.state = KwokkaAuthAddCredentialState.Callback;
      this.show();
    }

    public show() {
      this.dialog.show();
    }

    public onCreated(credential: CredentialEntity): void {
      this.$emit('created', credential);
      this.notificationService.show({
        type: 'success',
        text: this.$t('settings.credentials.addedSuccessfully'),
      });
      this.state = KwokkaAuthAddCredentialState.Initial;
      this.dialog.hide();
    }

    public onError(error: any): void {
      this.notificationService.showErrors([error]);
    }
  }
</script>

<style scoped lang="scss">
  .add-credential-dialog {
    @include UiPadding(3, bottom);
  }
</style>
