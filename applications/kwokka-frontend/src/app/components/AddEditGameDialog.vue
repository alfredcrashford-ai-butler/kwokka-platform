<template>
  <UiDialog
    ref="dialog"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!isValid"
    :shouldCloseOnPrimaryButtonClick="false"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <div class="add-edit-game-dialog" v-if="game">
        <template v-if="game.id">
          <div class="add-edit-game-dialog__row">
            <span>Id: {{ game.id }}</span>
            <UiButton size="sm" width="shrink" type="secondary" @click="onCopyIdClick">
              <UiIcon name="copy" size="sm" />
            </UiButton>
          </div>
          <UiButton shade="negative" width="block" @click="onDeleteClick">
            <UiIcon name="trash" />
            {{ $t('general.components.addEditGameDialog.delete') }}
          </UiButton>
        </template>
        <UiInput
          v-model="game.key"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('general.components.addEditGameDialog.addEditGameKeyLabel')"
          :placeholder="$t('general.components.addEditGameDialog.addEditGameKeyPlaceholder')"
        />
        <UiInput
          v-model="game.applicationAccountId"
          :required="true"
          width="block"
          mode="compact"
          :disabled="!!game?.id"
          :label="$t('general.components.addEditGameDialog.applicationAccountLabel')"
          :placeholder="$t('general.components.addEditGameDialog.applicationAccountPlaceholder')"
        />
        <UiInput
          v-model="tags"
          width="block"
          mode="compact"
          :label="$t('general.components.addEditGameDialog.tagsLabel')"
          :placeholder="$t('general.components.addEditGameDialog.tagsPlaceholder')"
        />
        <UiInput
          :modelValue="formatDate(game.availableSince)"
          @update:modelValue="game.availableSince = new Date($event)"
          type="datetime-local"
          width="block"
          mode="compact"
          :label="$t('general.components.addEditGameDialog.availableSinceLabel')"
          :placeholder="$t('general.components.addEditGameDialog.availableSincePlaceholder')"
        />
        <UiInput
          :modelValue="formatDate(game.availableTill)"
          @update:modelValue="game.availableTill = new Date($event)"
          type="datetime-local"
          width="block"
          mode="compact"
          :label="$t('general.components.addEditGameDialog.availableTillLabel')"
          :placeholder="$t('general.components.addEditGameDialog.availableTillPlaceholder')"
        />
      </div>
    </template>
  </UiDialog>

  <UiDialog
    ref="deleteDialog"
    :title="$t('general.components.addEditGameDialog.deleteConfirmTitle')"
    :text="$t('general.components.addEditGameDialog.deleteConfirmDescription')"
    @primaryButtonClick="$emit('delete', game)"
  >
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { GameEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import { copyTextToClipboard } from '@/utils/clipboard';
  import { DateUtil } from '@kwokka/utils';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiInput,
      UiIcon,
    },
    emits: ['confirm', 'delete'],
  })
  export default class AddEditGameDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public deleteDialog: UiDialog;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public game: GameEntity = null;
    public tags: string = '';

    public get isValid(): boolean {
      if (!this.game) {
        return false;
      }

      return Boolean(this.game.key && this.game.applicationAccountId && this.game.isAvailabilityRangeValid());
    }

    public get dialogTitle(): string {
      if (this.game?.id) {
        return this.$t('general.components.addEditGameDialog.editGame');
      }

      return this.$t('general.components.addEditGameDialog.addGame');
    }

    public show(game?: GameEntity): void {
      this.game = new GameEntity(
        game || {
          key: '',
          applicationAccountId: undefined,
          tags: [],
        },
      );
      this.tags = this.game.tags?.join(',');
      this.dialog.show();
    }

    public onCopyIdClick(): void {
      copyTextToClipboard(this.game.id);
      this.notificationService.show({ type: 'info', text: this.$t('general.copied') });
    }

    public onConfirm(): void {
      if (this.tags.length) {
        this.game.tags = this.tags.split(',');
      }
      this.$emit('confirm', this.game);
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.deleteDialog.show();
    }

    public hide(): void {
      this.dialog.hide();
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
  .add-edit-game-dialog {
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
