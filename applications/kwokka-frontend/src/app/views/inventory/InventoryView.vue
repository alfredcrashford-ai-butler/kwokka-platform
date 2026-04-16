<template>
  <SecondLevelLayout :title="$t('inventory.title')" backUrl="/main">
    <div class="inventory">
      <ManageItems
        v-if="canManage"
        ref="manageItemsComponent"
        @accountSelected="onAccountSelected($event)"
        @itemGiven="setPage(page)"
        @itemTaken="setPage(page)"
      />
      <hr class="inventory__divider" v-if="canManage" />
      <div class="inventory__grid">
        <template v-for="item in displayItemInstances" :key="item.id">
          <ItemCard
            v-if="item.value"
            class="inventory__card"
            :item="items[item.value?.itemId]"
            :itemInstance="item.value"
            :arePropertiesShown="false"
            @click="onItemCardClick(item.value, items[item.value?.itemId])"
          />
          <div v-else class="inventory__empty-card"></div>
        </template>
      </div>
      <UiPagination
        :isPrevDisabled="page <= 0"
        :isNextDisabled="itemInstances.length < itemsPerPage"
        :page="page"
        @next="setPage(page + 1)"
        @prev="setPage(page - 1)"
      />
    </div>

    <ItemInstanceDialog ref="dialog" @take="onTakeItemClick($event)" @actionRun="onActionRun($event)" />
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { AccountEntity, ItemEntity, ItemInstanceEntity } from '@kwokka/entities';
  import { CapybaraAccessRight } from '@kwokka/rights';
  import { UuidUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { ItemApi } from '@/api/avatar/item/item.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import { AccessService } from '@/service/access/access.service';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import ItemCard from '@/app/components/ItemCard.vue';
  import UiPagination from '@/app/ui-kit/UiPagination.vue';
  import ItemInstanceDialog from './components/ItemInstanceDialog.vue';
  import ManageItems from './components/ManageItems.vue';

  type DisplayItemInstance = {
    id: string;
    value: ItemInstanceEntity;
  };

  @Component({
    components: {
      SecondLevelLayout,
      ItemCard,
      ItemInstanceDialog,
      UiPagination,
      ManageItems,
    },
  })
  export default class InventoryView extends Vue {
    public itemInstances: ItemInstanceEntity[] = [];
    public items: { [itemId in string]: ItemEntity } = {};
    public account: AccountEntity = null;

    @LazyInject(ItemApi)
    public itemApi: ItemApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(AccessService)
    public accessService: AccessService;

    @Ref()
    public dialog: ItemInstanceDialog;

    @Ref()
    public manageItemsComponent: ManageItems;

    public page: number = 0;

    public readonly itemsPerPage = 20;

    public get displayItemInstances(): DisplayItemInstance[] {
      const filling = new Array(this.itemsPerPage - this.itemInstances.length).fill(null);
      return [...this.itemInstances, ...filling].map((el) => ({ value: el, id: el?.id || UuidUtil.generate(6) }));
    }

    public get canManage(): boolean {
      return this.accessService.hasRight(CapybaraAccessRight.ManageItems);
    }

    public mounted(): void {
      this.fetchItems();
    }

    public setPage(page: number): void {
      this.page = page;
      this.fetchItems();
    }

    public onItemCardClick(itemInstance: ItemInstanceEntity, item: ItemEntity): void {
      this.dialog.show(itemInstance, item);
    }

    public onAccountSelected(account: AccountEntity): void {
      this.account = account;
      this.setPage(0);
    }

    public onTakeItemClick(item: ItemEntity): void {
      this.dialog.hide();
      this.manageItemsComponent.showTakeItemDialog(item);
    }

    public async onActionRun(data: { itemInstance: ItemInstanceEntity; actionKey: string }): Promise<void> {
      try {
        if (this.account) {
          await this.itemApi.runItemInstanceAction(
            data.itemInstance.itemId,
            data.itemInstance.accountId,
            data.actionKey,
          );
        } else {
          await this.itemApi.runOwnItemInstanceAction(data.itemInstance.itemId, data.actionKey);
        }
        this.dialog.hide();
        this.notificationService.show({ type: 'success', text: this.$t('inventory.actionRanSuccessfully') });
        this.setPage(this.page);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private async fetchItems(): Promise<void> {
      try {
        const itemInstances = await this.fetchItemInstances();
        let itemIds = itemInstances.map((el) => el.itemId);
        itemIds = itemIds.filter((id) => !this.items[id]);
        const items = await Promise.all(itemIds.map((id) => this.itemApi.getById(id)));
        this.itemInstances = itemInstances;
        items.forEach((item) => (this.items[item.id] = item));
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private async fetchItemInstances(): Promise<ItemInstanceEntity[]> {
      if (this.account) {
        const result = await this.itemApi.listItemInstancesByAccountId(
          this.itemsPerPage * this.page,
          this.itemsPerPage,
          this.account.id,
        );
        return result.data;
      } else {
        const result = await this.itemApi.listOwnItemInstances(this.itemsPerPage * this.page, this.itemsPerPage);
        return result.data;
      }
    }
  }
</script>

<style scoped lang="scss">
  .inventory {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__grid {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax($grid-step * 39, 1fr));
      @include UiGap(3);
    }

    &__card {
      aspect-ratio: 1;
    }

    &__empty-card {
      @include UiBorderRadius(md);
      @include UiTheme() {
        border: 1px solid UiColor(shade-100);
        background-color: UiColor(shade-400);
      }
      aspect-ratio: 1;
      opacity: 0.5;
    }

    &__divider {
      border-bottom: 1px solid rgba(#fff, 0.65);
    }
  }
</style>
