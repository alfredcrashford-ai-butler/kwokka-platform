<template>
  <div class="game-settings">
    <Settings ref="settings" @open="$emit('open')" @close="$emit('close')">
      <AppSettings />
      <AudioSettings />
      <UiButton size="xl" type="red" width="block" @click="onLeaveClick()">{{ $t('game.leaveGame') }}</UiButton>
    </Settings>

    <UiDialog
      ref="leaveDialog"
      :title="$t('game.leaveGameDialog.title')"
      :text="$t('game.leaveGameDialog.text')"
      :primaryButtonText="$t('game.leaveGameDialog.primaryButtonText')"
      :secondaryButtonText="$t('game.leaveGameDialog.secondaryButtonText')"
      @show="$emit('open')"
      @hide="$emit('close')"
      @primaryButtonClick="$emit('leave')"
      @secondaryButtonClick="settings.show()"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AppSettings, AudioSettings, Settings } from '@/app/components/settings';
  import { UiButton, UiDialog } from '@/app/ui-kit';

  @Component({
    components: {
      UiButton,
      UiDialog,
      Settings,
      AudioSettings,
      AppSettings,
    },
    emits: ['leave', 'open', 'close'],
  })
  export default class GameSettings extends Vue {
    @Ref()
    public leaveDialog: UiDialog;

    @Ref()
    public settings: Settings;

    public onLeaveClick(): void {
      this.settings.hide();
      this.leaveDialog.show();
    }
  }
</script>

<style scoped lang="scss">
  .game-settings {
    position: absolute;
    left: UiSpacing(2);
    top: UiSpacing(2);
  }
</style>
