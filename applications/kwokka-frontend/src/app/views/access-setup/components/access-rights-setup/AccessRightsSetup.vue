<template>
  <div class="access-rights-setup">
    <UiHeading class="access-rights-setup__heading">{{ $t('accessSetup.accessRights.title') }}</UiHeading>
    <p class="access-rights-setup__description">{{ $t('accessSetup.accessRights.description') }}</p>

    <UiButton class="access-rights-setup__add-button" shade="accent" @click="onAddAccessRightClick">
      {{ $t('accessSetup.accessRights.addAccessRight') }}
    </UiButton>

    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onTableRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />

    <AccessRightDialog ref="accessRightDialog" @edit="onEditConfirm($event)" @delete="onDeleteConfirm($event)" />

    <AddEditAccessRightDialog ref="addEditAccessRightDialog" @confirm="onAddAccessRightConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRightEntity } from '@kwokka/entities';
  import { DateUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { AccessRightApi } from '@/api/auth/access-right/access-right.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import AddEditAccessRightDialog from './AddEditAccessRightDialog.vue';
  import AccessRightDialog from './AccessRightDialog.vue';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiHeading,
      UiTable,
      UiButton,
      AddEditAccessRightDialog,
      AccessRightDialog,
    },
  })
  export default class AccessRightsSetup extends Vue {
    @Ref()
    public accessRightDialog: AccessRightDialog;

    @Ref()
    public addEditAccessRightDialog: AddEditAccessRightDialog;

    @Ref()
    public table: UiTable;

    public tableData: UiTableData = null;
    private accessRights: AccessRightEntity[] = [];

    @LazyInject(AccessRightApi)
    public accessRightApi: AccessRightApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public onTableRowClick(accessRight: AccessRightEntity) {
      this.accessRightDialog.show(accessRight);
    }

    public async onDeleteConfirm(accessRight: AccessRightEntity): Promise<void> {
      try {
        await this.accessRightApi.delete(accessRight.id);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accessRights.deletedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public onAddAccessRightClick(): void {
      this.addEditAccessRightDialog.show();
    }

    public async onEditConfirm(accessRight: AccessRightEntity): Promise<void> {
      try {
        await this.accessRightApi.update(accessRight.id, { name: accessRight.name });
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accessRights.updatedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onAddAccessRightConfirm(accessRight: AccessRightEntity): Promise<void> {
      try {
        await this.accessRightApi.create(accessRight);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accessRights.addedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.accessRightApi.list(offset, limit);
        this.accessRights = response.data;
        this.setupTableData(this.accessRights, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private setupTableData(accessRights: AccessRightEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['id', 'name', 'createdAt'],
        data: accessRights,
        limit,
        mapColumnValues: {
          createdAt: (data: Date) => DateUtil.format(data),
        },
      });
    }
  }
</script>

<style scoped lang="scss">
  .access-rights-setup {
    display: flex;
    flex-direction: column;

    &__heading {
      @include UiMargin(4, bottom);
    }

    &__description {
      @include UiMargin(4, bottom);
      @include UiTypographyParagraph2();
      opacity: 0.7;
    }

    &__add-button {
      @include UiMargin(4, bottom);
      align-self: flex-end;
    }
  }
</style>
