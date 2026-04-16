<template>
  <UiDialog
    ref="dialog"
    :title="`${$t('general.components.credentialDialog.title')}: ${credential?.identifier}`"
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
  >
    <template v-slot:body>
      <p class="credential-dialog__paragraph"><b>Id:</b> {{ credential?.id }}</p>
      <p class="credential-dialog__paragraph"><b>Type:</b> {{ credential?.type }}</p>
      <p class="credential-dialog__paragraph"><b>Identifier:</b> {{ credential?.identifier }}</p>
      <p class="credential-dialog__paragraph"><b>AccountId:</b> {{ credential?.accountId }}</p>
      <p class="credential-dialog__paragraph"><b>IsVerified:</b> {{ credential?.isVerified }}</p>
      <p class="credential-dialog__paragraph"><b>CreatedAt:</b> {{ formattedCreatedAt }}</p>
      <p class="credential-dialog__paragraph"><b>Data:</b></p>
      <pre class="credential-dialog__data">{{ formattedData }}</pre>
      <hr class="credential-dialog__delimeter" />
      <div class="credential-dialog__actions">
        <router-link class="ui-link-reset" :to="`/access-management/account/${credential?.accountId}`">
          <UiButton type="secondary" width="block">
            <UiIcon name="arrow-square-out" />
            {{ $t('general.components.credentialDialog.openAccountDetails') }}
          </UiButton>
        </router-link>
        <UiButton
          type="secondary"
          width="block"
          @click="onSendVerificationClick"
          v-if="credential?.isVerifiable() && !credential?.isVerified"
        >
          <UiIcon name="paper-plane-tilt" />
          {{ $t('general.components.credentialDialog.sendVerification') }}
        </UiButton>
        <UiButton type="secondary" width="block" @click="onDeleteClick">
          <UiIcon name="trash" />
          {{ $t('general.components.credentialDialog.delete') }}
        </UiButton>
      </div>
    </template>
  </UiDialog>

  <UiDialog
    ref="confirmDeleteDialog"
    :title="$t('general.components.credentialDialog.confirmDeleteTitle')"
    :text="$t('general.components.credentialDialog.confirmDeleteDescription')"
    @primaryButtonClick="onDeleteConfirm"
    @secondaryButtonClick="onDeleteCancel"
  />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { CredentialEntity } from '@kwokka/entities';
  import { DateUtil } from '@kwokka/utils';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiIcon,
    },
    emits: ['delete', 'sendVerification'],
  })
  export default class CredentialDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public confirmDeleteDialog: UiDialog;

    public credential: CredentialEntity = null;

    public get formattedCreatedAt(): string {
      if (!this.credential) {
        return '';
      }

      return DateUtil.format(this.credential.createdAt);
    }

    public get formattedData(): string {
      if (!this.credential) {
        return '';
      }

      return this.credential.data;
    }

    public async show(credential: CredentialEntity): Promise<void> {
      this.credential = credential;
      this.dialog.show();
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.confirmDeleteDialog.show();
    }

    public onSendVerificationClick(): void {
      this.$emit('sendVerification', this.credential);
      this.dialog.hide();
    }

    public onDeleteCancel(): void {
      this.dialog.show();
    }

    public async onDeleteConfirm(): Promise<void> {
      this.$emit('delete', this.credential);
      this.confirmDeleteDialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .credential-dialog {
    &__delimeter {
      @include UiMargin(4, top);
      @include UiMargin(4, bottom);
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    }

    &__actions {
      display: flex;
      flex-direction: column;
      @include UiGap(2, false);
    }

    &__paragraph {
      > b {
        @include UiFontWeight(bold);
      }
    }

    &__data {
      @include UiTypographyModifyMonospace();
      @include UiBorderRadius(sm);
      @include UiPadding(4, null, false);
      @include UiTypographyParagraph3();
      overflow: auto;
      @include UiTheme() {
        background-color: UiColor(shade-800);
      }
    }
  }
</style>
