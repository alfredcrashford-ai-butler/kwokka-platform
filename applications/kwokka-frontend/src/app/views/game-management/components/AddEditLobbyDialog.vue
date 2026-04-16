<template>
  <UiDialog
    ref="dialog"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!isValid"
    :shouldCloseOnPrimaryButtonClick="false"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <div class="add-edit-lobby-dialog" v-if="lobby">
        <template v-if="lobby.id">
          <div class="add-edit-lobby-dialog__row">
            <span>Id: {{ lobby.id }}</span>
            <UiButton size="sm" width="shrink" type="secondary" @click="onCopyIdClick">
              <UiIcon name="copy" size="sm" />
            </UiButton>
          </div>
          <UiButton shade="negative" width="block" @click="onDeleteClick">
            <UiIcon name="trash" />
            {{ $t('gameManagement.lobbies.delete') }}
          </UiButton>
        </template>

        <UiInput
          v-model="lobby.key"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('gameManagement.lobbies.keyLabel')"
          :placeholder="$t('gameManagement.lobbies.keyPlaceholder')"
        />
        <UiInput
          v-model="lobby.minPlayers"
          width="block"
          mode="compact"
          type="number"
          :min="0"
          :max="100"
          :step="1"
          :required="true"
          :label="$t('gameManagement.lobbies.minPlayersLabel')"
          :placeholder="$t('gameManagement.lobbies.minPlayersPlaceholder')"
        />
        <UiInput
          v-model="lobby.maxPlayers"
          width="block"
          mode="compact"
          type="number"
          :min="0"
          :max="100"
          :step="1"
          :required="true"
          :label="$t('gameManagement.lobbies.maxPlayersLabel')"
          :placeholder="$t('gameManagement.lobbies.maxPlayersPlaceholder')"
        />
        <UiTextarea
          v-model="stringifiedConfig"
          width="block"
          :label="$t('gameManagement.lobbies.configLabel')"
          :placeholder="$t('gameManagement.lobbies.configPlaceholder')"
          :invalid="!isJsonString(stringifiedConfig)"
          :required="true"
        />
        <UiInput
          :modelValue="formatDate(lobby.availableSince)"
          @update:modelValue="lobby.availableSince = new Date($event)"
          type="datetime-local"
          width="block"
          mode="compact"
          :label="$t('gameManagement.lobbies.availableSinceLabel')"
          :placeholder="$t('gameManagement.lobbies.availableSincePlaceholder')"
        />
        <UiInput
          :modelValue="formatDate(lobby.availableTill)"
          @update:modelValue="lobby.availableTill = new Date($event)"
          type="datetime-local"
          width="block"
          mode="compact"
          :label="$t('gameManagement.lobbies.availableTillLabel')"
          :placeholder="$t('gameManagement.lobbies.availableTillPlaceholder')"
        />
      </div>
    </template>
  </UiDialog>

  <UiDialog
    ref="deleteDialog"
    :title="$t('gameManagement.lobbies.deleteConfirmTitle')"
    :text="$t('gameManagement.lobbies.deleteConfirmDescription')"
    @primaryButtonClick="$emit('delete', lobby)"
  >
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { LobbyEntity } from '@kwokka/entities';
  import { DateUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import { copyTextToClipboard } from '@/utils/clipboard';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiTextarea from '@/app/ui-kit/UiTextarea.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiInput,
      UiIcon,
      UiTextarea,
    },
    emits: ['confirm', 'delete'],
  })
  export default class AddEditLobbyDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public deleteDialog: UiDialog;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public stringifiedConfig = '';
    public lobby: LobbyEntity = null;

    public isJsonString(str: string): boolean {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    public get isValid(): boolean {
      if (!this.lobby) {
        return false;
      }

      return Boolean(
        this.lobby.key &&
          this.lobby.gameId &&
          this.lobby.isPlayerRangeValid() &&
          this.lobby.isAvailabilityRangeValid() &&
          this.lobby.config,
      );
    }

    public get dialogTitle(): string {
      if (this.lobby?.id) {
        return this.$t('gameManagement.lobbies.editLobby');
      }

      return this.$t('gameManagement.lobbies.addLobby');
    }

    public show(lobby: LobbyEntity): void {
      this.lobby = lobby;
      const config = lobby.config;
      if (config) {
        this.stringifiedConfig = JSON.stringify(config);
      } else {
        this.stringifiedConfig = '';
      }
      this.dialog.show();
    }

    public onCopyIdClick(): void {
      copyTextToClipboard(this.lobby.id);
      this.notificationService.show({ type: 'info', text: this.$t('general.copied') });
    }

    public onConfirm(): void {
      this.$emit('confirm', this.lobby);
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.deleteDialog.show();
    }

    public hide(): void {
      this.dialog.hide();
    }

    @Watch('stringifiedConfig')
    public onSettingsUpdated(str: string): void {
      if (this.isJsonString(str)) {
        this.lobby.config = JSON.parse(str);
      } else {
        this.lobby.config = {};
      }
    }

    public formatDate(date?: Date): string {
      if (!date) {
        return null;
      }

      return DateUtil.format(date, 'YYYY-MM-DDTHH:mm');
    }
  }
</script>

<style scoped lang="scss">
  .add-edit-lobby-dialog {
    display: flex;
    flex-direction: column;
    @include UiGap(4, false);

    &__row {
      display: flex;
      align-items: center;
      @include UiGap(4, false);
    }
  }
</style>
