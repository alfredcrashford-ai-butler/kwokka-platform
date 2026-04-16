<template>
  <UiCard v-if="account" class="account-actions-card">
    <UiHeading size="2">{{ $t('account.actions.title') }}</UiHeading>
    <div class="account-actions-card__buttons">
      <UiButton width="block" type="secondary" @click="onRevokeAccessClick">{{
        $t('account.actions.revokeAccess')
      }}</UiButton>
      <UiButton v-if="account.isActive" width="block" type="secondary" @click="onDeactivateClick">
        {{ $t('account.actions.deactivate') }}
      </UiButton>
      <UiButton v-if="!account.isActive" width="block" type="secondary" @click="onActivateClick">{{
        $t('account.actions.activate')
      }}</UiButton>
      <UiButton width="block" type="primary" shade="negative" @click="onDeleteClick">{{
        $t('account.actions.delete')
      }}</UiButton>
    </div>

    <UiDialog
      ref="revokeConfirmationDialog"
      :title="$t('account.actions.revokeConfirmTitle')"
      :text="$t('account.actions.revokeConfirmText')"
      @primaryButtonClick="onRevokeConfirm"
    />

    <UiDialog
      ref="deactivateConfirmationDialog"
      :title="$t('account.actions.deactivateConfirmTitle')"
      :text="$t('account.actions.deactivateConfirmText')"
      @primaryButtonClick="onDeactivateConfirm"
    />

    <UiDialog
      ref="activateConfirmationDialog"
      :title="$t('account.actions.activateConfirmTitle')"
      :text="$t('account.actions.activateConfirmText')"
      @primaryButtonClick="onActivateConfirm"
    />

    <UiDialog
      ref="deleteConfirmationDialog"
      :title="$t('account.actions.deleteConfirmTitle')"
      :text="$t('account.actions.deleteConfirmText')"
      @primaryButtonClick="onDeleteConfirm"
    />
  </UiCard>
  <UiSkeleton v-else />
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { AccountEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { TokenApi } from '@/api/auth/token/token.api';
  import { AccountApi } from '@/api/auth/account/account.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';

  @Component({
    components: {
      UiCard,
      UiHeading,
      UiButton,
      UiSkeleton,
      UiDialog,
    },
    emits: ['reset', 'delete'],
  })
  export default class AccountActionsCard extends Vue {
    @Ref()
    public revokeConfirmationDialog: UiDialog;

    @Ref()
    public deactivateConfirmationDialog: UiDialog;

    @Ref()
    public activateConfirmationDialog: UiDialog;

    @Ref()
    public deleteConfirmationDialog: UiDialog;

    @Prop()
    public account: AccountEntity = null;

    @LazyInject(TokenApi)
    public tokenApi: TokenApi;

    @LazyInject(AccountApi)
    public accountApi: AccountApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public onRevokeAccessClick(): void {
      this.revokeConfirmationDialog.show();
    }

    public onDeactivateClick(): void {
      this.deactivateConfirmationDialog.show();
    }

    public onActivateClick(): void {
      this.activateConfirmationDialog.show();
    }

    public onDeleteClick(): void {
      this.deleteConfirmationDialog.show();
    }

    public onRevokeConfirm(): void {
      this.withErrorHandling(async () => {
        await this.tokenApi.revokeAccessByAccountId(this.account.id);
        this.$emit('reset');
      }, 'account.actions.revokedSuccessfully');
    }

    public async onDeactivateConfirm(): Promise<void> {
      this.withErrorHandling(async () => {
        await this.accountApi.setActive(this.account.id, false);
        this.$emit('reset');
      }, 'account.actions.deactivatedSuccessfully');
    }

    public async onActivateConfirm(): Promise<void> {
      this.withErrorHandling(async () => {
        await this.accountApi.setActive(this.account.id, true);
        this.$emit('reset');
      }, 'account.actions.activatedSuccessfully');
    }

    public async onDeleteConfirm(): Promise<void> {
      this.withErrorHandling(async () => {
        await this.accountApi.delete(this.account.id);
        this.$emit('delete');
      }, 'account.actions.deletedSuccessfully');
    }

    private async withErrorHandling(fn: () => Promise<any>, successMessageTranslationKey?: string): Promise<void> {
      try {
        await fn();
        if (successMessageTranslationKey) {
          this.notificationService.show({ text: this.$t(successMessageTranslationKey), type: 'success' });
        }
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }
  }
</script>

<style scoped lang="scss">
  .account-actions-card {
    @include UiPadding(4);
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__buttons {
      display: flex;
      flex-direction: column;
      @include UiGap(2);
    }
  }
</style>
