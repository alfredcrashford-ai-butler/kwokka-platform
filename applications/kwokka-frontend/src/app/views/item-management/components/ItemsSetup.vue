<template>
  <div class="items-setup">
    <UiHeading class="items-setup__heading">{{ $t('itemManagement.items.title') }}</UiHeading>
    <div class="items-setup__row">
      <p>{{ $t('itemManagement.items.description') }}</p>
      <UiButton @click="onAddClick">{{ $t('itemManagement.items.addItem') }}</UiButton>
    </div>
    <div class="items-setup__grid">
      <template v-for="item in displayItems" :key="item.id">
        <ItemCard v-if="item.value" class="items-setup__card" :item="item.value" @click="onItemCardClick(item.value)" />
        <div v-else class="items-setup__empty-card"></div>
      </template>
    </div>
    <UiPagination
      :isPrevDisabled="page <= 0"
      :isNextDisabled="items.length < itemsPerPage"
      :page="page"
      @next="setPage(page + 1)"
      @prev="setPage(page - 1)"
    />

    <AddEditItemDialog ref="addEditDialog" @confirm="onAddEditConfirm($event)" @delete="onDeleteConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { ItemEntity } from '@kwokka/entities';
  import { ObjectUtil, UuidUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { ItemApi } from '@/api/avatar/item/item.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiPagination from '@/app/ui-kit/UiPagination.vue';
  import AddEditItemDialog from './AddEditItemDialog.vue';
  import ItemCard from '@/app/components/ItemCard.vue';

  type DisplayItem = {
    id: string;
    value?: ItemEntity;
  };

  @Component({
    components: {
      UiHeading,
      UiButton,
      ItemCard,
      UiPagination,
      AddEditItemDialog,
    },
  })
  export default class ItemsSetup extends Vue {
    @Ref()
    public addEditDialog: AddEditItemDialog;

    public items: ItemEntity[] = [];

    @LazyInject(ItemApi)
    public itemApi: ItemApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public page: number = 0;

    public readonly itemsPerPage = 12;

    public get displayItems(): DisplayItem[] {
      const filling = new Array(this.itemsPerPage - this.items.length).fill(null);
      return [...this.items, ...filling].map((el) => ({ value: el, id: el?.id || UuidUtil.generate(6) }));
    }

    public mounted() {
      this.fetchItems();
    }

    public onAddClick(): void {
      this.addEditDialog.show();
    }

    public onItemCardClick(item: ItemEntity): void {
      this.addEditDialog.show(item);
    }

    public async onDeleteConfirm(item: ItemEntity): Promise<void> {
      try {
        await this.itemApi.delete(item.id);
        this.notificationService.show({ text: this.$t('itemManagement.items.deletedSuccessfully'), type: 'success' });
        this.fetchItems();
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onAddEditConfirm(item: ItemEntity): Promise<void> {
      if (!item.applicationAccountId) {
        item.applicationAccountId = undefined;
      }

      if (item.id) {
        await this.updateItem(item);
      } else {
        await this.createItem(item);
      }

      this.addEditDialog.hide();
      this.setPage(0);
    }

    public setPage(page: number) {
      this.page = page;
      this.fetchItems();
    }

    private async updateItem(item: ItemEntity): Promise<void> {
      try {
        const updateParams = ObjectUtil.take(item, ['key', 'isTransferrable', 'actions', 'tags', 'rarity']);
        await this.itemApi.update(item.id, updateParams);
        this.notificationService.show({ text: this.$t('itemManagement.items.updatedSuccessfully'), type: 'success' });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async createItem(item: ItemEntity): Promise<void> {
      try {
        await this.itemApi.create(item);
        this.notificationService.show({ text: this.$t('itemManagement.items.createdSuccessfully'), type: 'success' });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async fetchItems(): Promise<void> {
      try {
        const response = await this.itemApi.list(this.itemsPerPage * this.page, this.itemsPerPage);
        this.items = response.data;
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }
  }
</script>

<style scoped lang="scss">
  .items-setup {
    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax($grid-step * 39, 1fr));
      @include UiGap(3);
      @include UiMargin(4, bottom);
    }

    &__heading {
      @include UiMargin(4, bottom);
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include UiMargin(4, bottom);
    }

    &__card {
      aspect-ratio: 1;
    }

    &__empty-card {
      border: 1px solid;
      @include UiBorderRadius(md);
      @include UiTheme() {
        border: 1px solid UiColor(shade-100);
        background-color: UiColor(shade-400);
      }
      aspect-ratio: 1;
      opacity: 0.5;
    }
  }
</style>
