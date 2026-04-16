<template>
  <div class="item-trades-setup">
    <UiHeading class="item-trades-setup__heading">{{ $t('itemManagement.itemTrades.title') }}</UiHeading>
    <div class="item-trades-setup__row">
      <p>{{ $t('itemManagement.itemTrades.description') }}</p>
      <UiButton @click="onAddClick">{{ $t('itemManagement.itemTrades.addItemTrade') }}</UiButton>
    </div>

    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />

    <AddEditItemTradeDialog ref="addEditDialog" @confirm="onAddEditConfirm($event)" @delete="onDeleteConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { ItemTradeEntity } from '@kwokka/entities';
  import { ObjectUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import type { NetworkResponse } from '@/service/network/http.service';
  import { ItemTradeApi } from '@/api/avatar/item-trade/item-trade.api';
  import AddEditItemTradeDialog from './AddEditItemTradeDialog.vue';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiHeading,
      UiButton,
      UiTable,
      AddEditItemTradeDialog,
    },
  })
  export default class ItemTradesSetup extends Vue {
    @Ref()
    public table: UiTable;

    @Ref()
    public addEditDialog: AddEditItemTradeDialog;

    public tableData: UiTableData = null;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(ItemTradeApi)
    public itemTradeApi: ItemTradeApi;

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public async onRowClick(itemTrade: ItemTradeEntity): Promise<void> {
      this.addEditDialog.show(itemTrade);
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.fetchData(offset, limit);
        this.setupTableData(response.data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private fetchData(offset: number, limit: number): Promise<NetworkResponse<ItemTradeEntity[]>> {
      return this.itemTradeApi.list(offset, limit);
    }

    public async onAddClick() {
      this.addEditDialog.show();
    }

    public async onDeleteConfirm(itemTrade: ItemTradeEntity): Promise<void> {
      try {
        await this.itemTradeApi.delete(itemTrade.id);
        this.notificationService.show({
          text: this.$t('itemManagement.itemTrades.deletedSuccessfully'),
          type: 'success',
        });
        this.table.reset();
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onAddEditConfirm(itemTrade: ItemTradeEntity): Promise<void> {
      if (itemTrade.id) {
        await this.updateItemTrade(itemTrade);
      } else {
        await this.createItemTrade(itemTrade);
      }

      this.addEditDialog.hide();
      this.table.reset();
    }

    private async updateItemTrade(itemTrade: ItemTradeEntity): Promise<void> {
      try {
        const updateParams = ObjectUtil.take(itemTrade, [
          'itemId',
          'key',
          'quantity',
          'maxQuantity',
          'tradedItemId',
          'tradedItemQuantity',
          'requiredItems',
        ]);
        await this.itemTradeApi.update(itemTrade.id, updateParams);
        this.notificationService.show({
          text: this.$t('itemManagement.itemTrades.updatedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async createItemTrade(itemTrade: ItemTradeEntity): Promise<void> {
      try {
        await this.itemTradeApi.create(itemTrade);
        this.notificationService.show({
          text: this.$t('itemManagement.itemTrades.createdSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private setupTableData(itemTrades: ItemTradeEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['key', 'itemId', 'quantity', 'tradedItemId', 'tradedItemQuantity', 'maxQuantity'],
        data: itemTrades,
        limit,
      });
    }
  }
</script>

<style scoped lang="scss">
  .item-trades-setup {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
