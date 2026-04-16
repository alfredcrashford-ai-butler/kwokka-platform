<template>
  <UiDialog
    ref="dialog"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!isValid"
    :shouldCloseOnPrimaryButtonClick="false"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <div class="add-edit-item-trade-dialog" v-if="itemTrade">
        <template v-if="itemTrade.id">
          <div class="add-edit-item-trade-dialog__row">
            <span>Id: {{ itemTrade.id }}</span>
            <UiButton size="sm" width="shrink" type="secondary" @click="onCopyIdClick">
              <UiIcon name="copy" size="sm" />
            </UiButton>
          </div>
          <UiButton shade="negative" width="block" @click="onDeleteClick">
            <UiIcon name="trash" />
            {{ $t('itemManagement.itemTrades.delete') }}
          </UiButton>
        </template>
        <UiInput
          v-model="itemTrade.key"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('itemManagement.itemTrades.keyLabel')"
          :placeholder="$t('itemManagement.itemTrades.keyPlaceholder')"
        />

        <UiInput
          v-model="itemTrade.itemId"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('itemManagement.itemTrades.itemIdLabel')"
          :placeholder="$t('itemManagement.itemTrades.itemIdPlaceholder')"
        />
        <UiInput
          v-model="itemTrade.quantity"
          width="block"
          mode="compact"
          type="number"
          :required="true"
          :label="$t('itemManagement.itemTrades.quantityLabel')"
          :placeholder="$t('itemManagement.itemTrades.quantityPlaceholder')"
        />

        <UiInput
          v-model="itemTrade.tradedItemId"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('itemManagement.itemTrades.tradedItemIdLabel')"
          :placeholder="$t('itemManagement.itemTrades.tradedItemIdPlaceholder')"
        />
        <UiInput
          v-model="itemTrade.tradedItemQuantity"
          width="block"
          mode="compact"
          type="number"
          :required="true"
          :label="$t('itemManagement.itemTrades.tradedItemQuantityLabel')"
          :placeholder="$t('itemManagement.itemTrades.tradedItemQuantityPlaceholder')"
        />

        <UiInput
          v-model="itemTrade.maxQuantity"
          width="block"
          mode="compact"
          type="number"
          :label="$t('itemManagement.itemTrades.maxQuantityLabel')"
          :placeholder="$t('itemManagement.itemTrades.maxQuantityPlaceholder')"
        />

        <UiTextarea
          v-model="stringifiedRequiredItems"
          width="block"
          :label="$t('itemManagement.itemTrades.requiredItemsLabel')"
          :placeholder="$t('itemManagement.itemTrades.requiredItemsPlaceholder')"
          :invalid="!isJsonString(stringifiedRequiredItems)"
        />
      </div>
    </template>
  </UiDialog>

  <UiDialog
    ref="deleteDialog"
    :title="$t('itemManagement.itemTrades.deleteConfirmTitle')"
    :text="$t('itemManagement.itemTrades.deleteConfirmDescription')"
    @primaryButtonClick="$emit('delete', itemTrade)"
  >
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { ItemTradeEntity } from '@kwokka/entities';
  import { copyTextToClipboard } from '@/utils/clipboard';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
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
  export default class AddEditItemTradeDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public deleteDialog: UiDialog;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public stringifiedRequiredItems = '';
    public itemTrade: ItemTradeEntity = null;

    public get isValid(): boolean {
      if (!this.itemTrade) {
        return false;
      }

      const hasItemIds = this.itemTrade.itemId && this.itemTrade.tradedItemId;
      return Boolean(this.itemTrade.key && hasItemIds && ItemTradeEntity.isQuantityValid(this.itemTrade));
    }

    public get dialogTitle(): string {
      if (this.itemTrade?.id) {
        return this.$t('itemManagement.itemTrades.editItemTrade');
      }

      return this.$t('itemManagement.itemTrades.addItemTrade');
    }

    public isJsonString(str: string): boolean {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    public show(itemTrade?: ItemTradeEntity): void {
      this.itemTrade = new ItemTradeEntity(
        itemTrade || {
          itemId: '',
          key: '',
          quantity: undefined,
          maxQuantity: undefined,
          tradedItemId: '',
          tradedItemQuantity: undefined,
          requiredItems: [],
        },
      );
      if (this.itemTrade.requiredItems) {
        this.stringifiedRequiredItems = JSON.stringify(this.itemTrade.requiredItems);
      } else {
        this.stringifiedRequiredItems = '';
      }
      this.dialog.show();
    }

    @Watch('stringifiedRequiredItems')
    public onConfigUpdated(str: string): void {
      if (this.isJsonString(str)) {
        this.itemTrade.requiredItems = JSON.parse(str);
      } else {
        this.itemTrade.requiredItems = [];
      }
    }

    public onConfirm(): void {
      this.$emit('confirm', this.itemTrade);
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.deleteDialog.show();
    }

    public onCopyIdClick(): void {
      copyTextToClipboard(this.itemTrade.id);
      this.notificationService.show({ type: 'info', text: this.$t('general.copied') });
    }

    public hide(): void {
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .add-edit-item-trade-dialog {
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
