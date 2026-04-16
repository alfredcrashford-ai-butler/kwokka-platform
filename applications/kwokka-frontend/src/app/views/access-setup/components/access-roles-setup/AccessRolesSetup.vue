<template>
  <div class="access-roles-setup">
    <UiHeading class="access-roles-setup__heading">{{ $t('accessSetup.accessRoles.title') }}</UiHeading>
    <p class="access-roles-setup__description">{{ $t('accessSetup.accessRoles.description') }}</p>

    <UiButton class="access-roles-setup__add-button" shade="accent" @click="onAddAccessRoleClick">
      {{ $t('accessSetup.accessRoles.addAccessRole') }}
    </UiButton>

    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onTableRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />

    <AccessRoleDialog ref="accessRoleDialog" @edit="onEditConfirm($event)" @delete="onDeleteConfirm($event)" />

    <AddEditAccessRoleDialog ref="addEditAccessRoleDialog" @confirm="onAddAccessRoleConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRoleEntity } from '@kwokka/entities';
  import { DateUtil, ObjectUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { AccessRoleApi } from '@/api/auth/access-role/access-role.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import AddEditAccessRoleDialog from './AddEditAccessRoleDialog.vue';
  import AccessRoleDialog from './AccessRoleDialog.vue';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiHeading,
      UiTable,
      UiButton,
      AddEditAccessRoleDialog,
      AccessRoleDialog,
    },
  })
  export default class AccessRolesSetup extends Vue {
    @Ref()
    public accessRoleDialog: AccessRoleDialog;

    @Ref()
    public addEditAccessRoleDialog: AddEditAccessRoleDialog;

    @Ref()
    public table: UiTable;

    public tableData: UiTableData = null;
    private accessRoles: AccessRoleEntity[] = [];

    @LazyInject(AccessRoleApi)
    public accessRoleApi: AccessRoleApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public onTableRowClick(accessRole: AccessRoleEntity) {
      this.accessRoleDialog.show(accessRole);
    }

    public async onDeleteConfirm(accessRole: AccessRoleEntity): Promise<void> {
      try {
        await this.accessRoleApi.delete(accessRole.id);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accessRoles.deletedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onEditConfirm(accessRole: AccessRoleEntity): Promise<void> {
      try {
        const fields = ObjectUtil.take(accessRole, ['name', 'description', 'accessRightsIds']);
        await this.accessRoleApi.update(accessRole.id, fields);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accessRoles.updatedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public onAddAccessRoleClick(): void {
      this.addEditAccessRoleDialog.show();
    }

    public async onAddAccessRoleConfirm(accessRole: AccessRoleEntity): Promise<void> {
      try {
        await this.accessRoleApi.create(accessRole);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accessRoles.addedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.accessRoleApi.list(offset, limit);
        this.accessRoles = response.data;
        this.setupTableData(this.accessRoles, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private setupTableData(accessRoles: AccessRoleEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['name', 'createdAt'],
        data: accessRoles,
        limit,
        mapColumnValues: {
          createdAt: (data: Date) => DateUtil.format(data),
        },
      });
    }
  }
</script>

<style scoped lang="scss">
  .access-roles-setup {
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
