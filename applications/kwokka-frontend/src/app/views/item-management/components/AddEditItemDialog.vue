<template>
  <UiDialog
    ref="dialog"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!isValid"
    :shouldCloseOnPrimaryButtonClick="false"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <div class="add-edit-item-dialog" v-if="item">
        <template v-if="item.id">
          <div class="add-edit-item-dialog__row">
            <span>Id: {{ item.id }}</span>
            <UiButton size="sm" width="shrink" type="secondary" @click="onCopyIdClick">
              <UiIcon name="copy" size="sm" />
            </UiButton>
          </div>
          <UiButton shade="negative" width="block" @click="onDeleteClick">
            <UiIcon name="trash" />
            {{ $t('itemManagement.items.delete') }}
          </UiButton>
        </template>
        <UiInput
          v-model="item.key"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('itemManagement.items.addEditItemKeyLabel')"
          :placeholder="$t('itemManagement.items.addEditItemKeyPlaceholder')"
        />
        <UiInput
          v-model="item.applicationAccountId"
          width="block"
          mode="compact"
          :disabled="!!item?.id"
          :label="$t('itemManagement.items.applicationAccountLabel')"
          :placeholder="$t('itemManagement.items.applicationAccountPlaceholder')"
        />
        <UiInput
          v-model="tags"
          width="block"
          mode="compact"
          :label="$t('itemManagement.items.tagsLabel')"
          :placeholder="$t('itemManagement.items.tagsPlaceholder')"
        />
        <UiSimpleSelect
          v-model="item.isTransferrable"
          width="block"
          mode="compact"
          :required="true"
          :options="[true, false]"
          :placeholder="$t('itemManagement.items.isTransferrablePlaceholder')"
          :label="$t('itemManagement.items.isTransferrableLabel')"
        />
        <UiSimpleSelect
          v-model="item.rarity"
          width="block"
          mode="compact"
          :required="true"
          :options="rarities"
          :placeholder="$t('itemManagement.items.rarityPlaceholder')"
          :label="$t('itemManagement.items.rarityLabel')"
        />
        <ItemActionsSetup v-model="item.actions" />
      </div>
    </template>
  </UiDialog>

  <UiDialog
    ref="deleteDialog"
    :title="$t('itemManagement.items.deleteConfirmTitle')"
    :text="$t('itemManagement.items.deleteConfirmDescription')"
    @primaryButtonClick="$emit('delete', item)"
  >
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { ItemEntity, ItemEntityRarity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiSimpleSelect from '@/app/ui-kit/UiSimpleSelect.vue';
  import ItemActionsSetup from './ItemActionsSetup.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import { copyTextToClipboard } from '@/utils/clipboard';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiInput,
      UiIcon,
      UiSimpleSelect,
      ItemActionsSetup,
    },
    emits: ['confirm', 'delete'],
  })
  export default class AddEditItemDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public deleteDialog: UiDialog;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public item: ItemEntity = null;
    public rarities: ItemEntityRarity[] = Object.values(ItemEntityRarity);
    public tags: string = '';

    public get isValid(): boolean {
      if (!this.item) {
        return false;
      }

      return Boolean(
        this.item.key &&
          typeof this.item.isTransferrable === 'boolean' &&
          this.item.rarity &&
          this.item.areActionsValid(),
      );
    }

    public get dialogTitle(): string {
      if (this.item?.id) {
        return this.$t('itemManagement.items.editItem');
      }

      return this.$t('itemManagement.items.addItem');
    }

    public show(item?: ItemEntity): void {
      this.item = new ItemEntity(
        item || {
          key: '',
          applicationAccountId: undefined,
          isTransferrable: null,
          actions: [],
          tags: [],
          rarity: null,
        },
      );
      this.tags = this.item.tags.join(',');
      this.dialog.show();
    }

    public onCopyIdClick(): void {
      copyTextToClipboard(this.item.id);
      this.notificationService.show({ type: 'info', text: this.$t('general.copied') });
    }

    public onConfirm(): void {
      if (this.tags.length) {
        this.item.tags = this.tags.split(',');
      }
      this.$emit('confirm', this.item);
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.deleteDialog.show();
    }

    public hide(): void {
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .add-edit-item-dialog {
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
