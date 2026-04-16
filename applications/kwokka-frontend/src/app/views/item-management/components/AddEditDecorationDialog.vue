<template>
  <UiDialog
    ref="dialog"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!isValid"
    :shouldCloseOnPrimaryButtonClick="false"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <div class="add-edit-decoration-dialog" v-if="decoration">
        <template v-if="decoration.id">
          <div class="add-edit-decoration-dialog__row">
            <span>Id: {{ decoration.id }}</span>
            <UiButton size="sm" width="shrink" type="secondary" @click="onCopyIdClick">
              <UiIcon name="copy" size="sm" />
            </UiButton>
          </div>
          <UiButton shade="negative" width="block" @click="onDeleteClick">
            <UiIcon name="trash" />
            {{ $t('itemManagement.decorations.delete') }}
          </UiButton>
        </template>
        <UiInput
          v-model="decoration.key"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('itemManagement.decorations.keyLabel')"
          :placeholder="$t('itemManagement.decorations.keyPlaceholder')"
        />
        <UiInput
          v-model="decoration.applicationAccountId"
          width="block"
          mode="compact"
          :disabled="!!decoration?.id"
          :label="$t('itemManagement.decorations.applicationAccountLabel')"
          :placeholder="$t('itemManagement.decorations.applicationAccountPlaceholder')"
        />
        <UiSimpleSelect
          v-model="decoration.type"
          width="block"
          mode="compact"
          :required="true"
          :options="types"
          :placeholder="$t('itemManagement.decorations.typePlaceholder')"
          :label="$t('itemManagement.decorations.typeLabel')"
        />
      </div>
    </template>
  </UiDialog>

  <UiDialog
    ref="deleteDialog"
    :title="$t('itemManagement.decorations.deleteConfirmTitle')"
    :text="$t('itemManagement.decorations.deleteConfirmDescription')"
    @primaryButtonClick="$emit('delete', decoration)"
  >
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { DecorationEntity, DecorationEntityType } from '@kwokka/entities';
  import { copyTextToClipboard } from '@/utils/clipboard';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiSimpleSelect from '@/app/ui-kit/UiSimpleSelect.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiInput,
      UiIcon,
      UiSimpleSelect,
    },
    emits: ['confirm', 'delete'],
  })
  export default class AddEditDecorationDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public deleteDialog: UiDialog;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public decoration: DecorationEntity = null;
    public types: DecorationEntityType[] = Object.values(DecorationEntityType);

    public get isValid(): boolean {
      if (!this.decoration) {
        return false;
      }

      return Boolean(this.decoration.key && this.decoration.type);
    }

    public get dialogTitle(): string {
      if (this.decoration?.id) {
        return this.$t('itemManagement.decorations.editDecoration');
      }

      return this.$t('itemManagement.decorations.addDecoration');
    }

    public show(decoration?: DecorationEntity): void {
      this.decoration = new DecorationEntity(
        decoration || {
          key: '',
          applicationAccountId: undefined,
          type: null,
        },
      );
      this.dialog.show();
    }

    public onConfirm(): void {
      this.$emit('confirm', this.decoration);
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.deleteDialog.show();
    }

    public onCopyIdClick(): void {
      copyTextToClipboard(this.decoration.id);
      this.notificationService.show({ type: 'info', text: this.$t('general.copied') });
    }

    public hide(): void {
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .add-edit-decoration-dialog {
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
