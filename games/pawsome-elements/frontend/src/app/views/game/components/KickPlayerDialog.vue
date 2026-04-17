<template>
  <UiDialog
    ref="dialog"
    :title="$t('game.kickPlayerDialog.title')"
    :text="$t('game.kickPlayerDialog.text')"
    :primaryButtonText="$t('game.kickPlayerDialog.primaryButtonText')"
    :secondaryButtonText="$t('game.kickPlayerDialog.secondaryButtonText')"
    @primaryButtonClick="$emit('confirm', playerId)"
    @hide="playerId = null"
  />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';

  @Component({
    components: {
      UiDialog,
    },
    emits: ['confirm'],
  })
  export default class KickPlayerDialog extends Vue {
    public playerId: string = null;

    @Ref()
    public dialog: UiDialog;

    public show(playerId: string) {
      this.playerId = playerId;
      this.dialog.show();
    }
  }
</script>
