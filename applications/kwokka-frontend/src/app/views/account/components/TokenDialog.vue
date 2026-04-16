<template>
  <UiDialog
    ref="dialog"
    :title="$t('account.tokens.token')"
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
  >
    <template v-slot:body>
      <p class="token-dialog__paragraph"><b>Id:</b> {{ token?.id }}</p>
      <p class="token-dialog__paragraph"><b>Type:</b> {{ token?.type }}</p>
      <p class="token-dialog__paragraph"><b>AccountId:</b> {{ token?.accountId }}</p>
      <p class="token-dialog__paragraph"><b>CredentialId:</b> {{ token?.credentialId }}</p>
      <p class="token-dialog__paragraph"><b>CorrelationId:</b> {{ token?.accountId }}</p>
      <p class="token-dialog__paragraph"><b>RevokedAt:</b> {{ formatDate(token?.revokedAt) }}</p>
      <p class="token-dialog__paragraph"><b>ExpiresAt:</b> {{ formatDate(token?.expiresAt) }}</p>
      <p class="token-dialog__paragraph"><b>CreatedAt:</b> {{ formatDate(token?.createdAt) }}</p>
      <hr class="token-dialog__delimeter" />
      <div class="token-dialog__actions">
        <UiButton type="secondary" width="block" @click="onRevokeByCorrelationClick">
          <UiIcon name="x" />
          {{ $t('account.tokens.revokeCorrelation') }}
        </UiButton>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { TokenEntity } from '@kwokka/entities';
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
    emits: ['revokeCorrelation'],
  })
  export default class TokenDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    public token: TokenEntity = null;

    public formatDate(date: Date) {
      return !date ? '' : DateUtil.format(date);
    }

    public async show(token: TokenEntity): Promise<void> {
      this.token = token;
      this.dialog.show();
    }

    public onRevokeByCorrelationClick(): void {
      this.$emit('revokeCorrelation', this.token);
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .token-dialog {
    &__delimeter {
      @include UiMargin(4, top);
      @include UiMargin(4, bottom);
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    }

    &__paragraph {
      > b {
        @include UiFontWeight(bold);
      }
    }
  }
</style>
