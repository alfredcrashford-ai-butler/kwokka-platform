<template>
  <div class="game-traits">
    <UiHeading class="game-traits__heading">{{ $t('itemManagement.traits.title') }}</UiHeading>
    <div class="game-traits__row">
      <p>{{ $t('itemManagement.traits.description') }}</p>
      <UiButton @click="onAddClick">{{ $t('itemManagement.traits.addTrait') }}</UiButton>
    </div>

    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />

    <AddEditTraitDialog ref="addEditDialog" @confirm="onAddEditConfirm($event)" @delete="onDeleteConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { TraitEntity } from '@kwokka/entities';
  import { ObjectUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import { TraitApi } from '@/api/avatar/trait/trait.api';
  import type { NetworkResponse } from '@/service/network/http.service';
  import AddEditTraitDialog from './AddEditTraitDialog.vue';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiHeading,
      UiButton,
      UiTable,
      AddEditTraitDialog,
    },
  })
  export default class TraitSetup extends Vue {
    @Ref()
    public table: UiTable;

    @Ref()
    public addEditDialog: AddEditTraitDialog;

    public tableData: UiTableData = null;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(TraitApi)
    public traitApi: TraitApi;

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public async onRowClick(trait: TraitEntity): Promise<void> {
      this.addEditDialog.show(trait);
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.fetchData(offset, limit);
        this.setupTableData(response.data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private fetchData(offset: number, limit: number): Promise<NetworkResponse<TraitEntity[]>> {
      return this.traitApi.list(offset, limit);
    }

    public async onAddClick() {
      this.addEditDialog.show();
    }

    public async onDeleteConfirm(trait: TraitEntity): Promise<void> {
      try {
        await this.traitApi.delete(trait.id);
        this.notificationService.show({ text: this.$t('itemManagement.traits.deletedSuccessfully'), type: 'success' });
        this.table.reset();
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onAddEditConfirm(trait: TraitEntity): Promise<void> {
      if (!trait.applicationAccountId) {
        trait.applicationAccountId = undefined;
      }

      if (trait.id) {
        await this.updateTrait(trait);
      } else {
        await this.createTrait(trait);
      }

      this.addEditDialog.hide();
      this.table.reset();
    }

    private async updateTrait(trait: TraitEntity): Promise<void> {
      try {
        const updateParams = ObjectUtil.take(trait, [
          'key',
          'type',
          'defaultValue',
          'isOwnerEditable',
          'isPubliclyVisible',
          'config',
        ]);
        await this.traitApi.update(trait.id, updateParams);
        this.notificationService.show({ text: this.$t('itemManagement.traits.updatedSuccessfully'), type: 'success' });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async createTrait(trait: TraitEntity): Promise<void> {
      try {
        await this.traitApi.create(trait);
        this.notificationService.show({ text: this.$t('itemManagement.traits.createdSuccessfully'), type: 'success' });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private setupTableData(traits: TraitEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['key', 'type', 'isOwnerEditable', 'isPubliclyVisible'],
        data: traits,
        limit,
      });
    }
  }
</script>

<style scoped lang="scss">
  .game-traits {
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
