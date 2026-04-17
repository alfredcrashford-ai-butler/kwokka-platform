<template>
  <UiDialog
    ref="dialog"
    :title="$t('game.disconnectDialog.title')"
    :text="message"
    :primaryButtonText="$t('game.disconnectDialog.reconnect')"
    :secondaryButtonText="$t('game.disconnectDialog.toMainMenu')"
    :isPrimaryButtonShown="isReconnectShown"
    :isBackdropClickEnabled="false"
    @primaryButtonClick="$emit('reconnect')"
    @secondaryButtonClick="$emit('toMainMenu')"
  />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import { DisconnectReasonCode, type DisconnectReason } from '@kwokka/sdk-js';

  @Component({
    components: {
      UiDialog,
    },
    emits: ['reconnect', 'toMainMenu'],
  })
  export default class DisconnectDialog extends Vue {
    public reason: DisconnectReason = null;
    public isReconnectShown: boolean = false;

    @Ref()
    public dialog: UiDialog;

    public showWithReconnect(reason: DisconnectReason) {
      this.show(reason, true);
    }

    public showWithoutReconnect(reason: DisconnectReason) {
      this.show(reason, false);
    }

    public get message(): string {
      return this.$t(`game.disconnectDialog.code.${this.reason?.code || DisconnectReasonCode.Unknown}`);
    }

    private show(reason: DisconnectReason, isReconnectShown: boolean) {
      this.reason = reason;
      this.isReconnectShown = isReconnectShown;
      this.dialog.show();
    }
  }
</script>
