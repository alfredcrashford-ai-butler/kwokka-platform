<template>
  <div class="credentials-settings">
    <UiHeading size="2" sizeMobile="4">{{ $t('settings.credentials.title') }}</UiHeading>

    <p class="credentials-settings__caption">{{ $t('settings.credentials.description') }}</p>

    <UiSkeleton v-if="isLoading" />
    <template v-else>
      <Credential
        v-for="credential in credentials"
        :key="credential.id"
        :credential="credential"
        :isDeleteEnabled="credentials.length > 1"
        @delete="onCredentialDelete(credential)"
        @sendVerification="onCredentialVerificationSend(credential)"
      />

      <UiButton type="secondary" width="block" @click="addCredentialDialog.show()">
        <UiIcon name="plus" />
        <span> {{ $t('settings.credentials.add') }}</span>
      </UiButton>
    </template>

    <AddCredentialDialog ref="addCredentialDialog" @created="onCredentialCreated($event)" />

    <UiDialog
      ref="deleteCeredentialDialog"
      :title="$t('settings.credentials.deleteCredential.title')"
      :text="$t('settings.credentials.deleteCredential.description')"
      @primaryButtonClick="onCredentialDeleteConfirm"
      @hide="credentialToDelete = null"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { CredentialEntityType, type CredentialEntity } from '@kwokka/entities';
  import { ConfigService } from '@/service/config/config.service';
  import { LazyInject } from '@/ioc';
  import { CredentialApi } from '@/api/auth/credential/credential.api';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import Credential from './Credential.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import AddCredentialDialog from '@/app/components/AddCredentialDialog.vue';
  import { LoggerService } from '@/service/logger/logger.service';
  import { NotificationService } from '@/service/notification/notification.service';

  @Component({
    components: {
      UiSkeleton,
      UiButton,
      UiIcon,
      Credential,
      UiHeading,
      AddCredentialDialog,
      UiDialog,
    },
  })
  export default class CredentialsSettings extends Vue {
    public isLoading = true;
    public credentials: CredentialEntity[] = [];
    public credentialToDelete: CredentialEntity = null;
    public readonly credentialTypes = CredentialEntityType;

    @LazyInject(ConfigService)
    private configService: ConfigService;

    @LazyInject(LoggerService)
    private logger: LoggerService;

    @LazyInject(CredentialApi)
    private credentialsApi: CredentialApi;

    @LazyInject(NotificationService)
    private notificationService: NotificationService;

    @Ref()
    public addCredentialDialog: AddCredentialDialog;

    @Ref()
    public deleteCeredentialDialog: UiDialog;

    public get appVersion(): string {
      return this.configService.frontendConfig.version;
    }

    public async mounted(): Promise<void> {
      const { data: credentials } = await this.credentialsApi.listOwnCredentials(0, 50);
      this.credentials = credentials;
      this.isLoading = false;
      if (this.$route.query.callback) {
        this.addCredentialDialog.showCallback();
      }
    }

    public onCredentialDelete(credential: CredentialEntity): void {
      this.deleteCeredentialDialog.show();
      this.credentialToDelete = credential;
    }

    public async onCredentialVerificationSend(credential: CredentialEntity): Promise<void> {
      try {
        await this.credentialsApi.verifyOwnCredential(credential.id);
        this.notificationService.show({
          text: this.$t('settings.credentials.sentVerificationSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.logger.error(e);
        this.notificationService.showErrors([e]);
      }
    }

    public async onCredentialDeleteConfirm(): Promise<void> {
      try {
        const credential = await this.credentialsApi.deleteOwnCredential(this.credentialToDelete.id);
        this.credentials = this.credentials.filter((el) => el.id !== credential.id);
        this.notificationService.show({
          text: this.$t('settings.credentials.deletedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.logger.error(e);
        this.notificationService.showErrors([e]);
      }
    }

    public onCredentialCreated(credential: CredentialEntity): void {
      this.credentials = [credential, ...this.credentials];
      this.$router.replace({ query: { callback: undefined }, hash: undefined });
    }
  }
</script>

<style scoped lang="scss">
  .credentials-settings {
    display: flex;
    flex-direction: column;
    @include UiGap(4, false);

    &__caption {
      @include UiTypographyParagraph2();
      opacity: 0.7;
    }
  }
</style>
