<template>
  <UiDialog
    ref="dialog"
    :title="$t('account.roles.roleDialogTitle')"
    @primaryButtonClick="onConfirm"
    @hide="tableData = null"
  >
    <template v-slot:body>
      <div class="account-roles-dialog__roles">
        <div class="account-roles-dialog__role" v-for="accessRole in selectedAccessRoles" :key="accessRole.role.id">
          <UiCheckbox v-model="accessRole.enabled" size="sm" />
          <span class="account-roles-dialog__role-name">{{ accessRole.role.name || accessRole.role.id }}</span>
          <UiButton size="sm" type="transparent" width="shrink" @click="onAccessRoleDelete(accessRole.role)">
            <UiIcon name="trash" size="sm" />
          </UiButton>
        </div>
      </div>

      <UiTable
        ref="table"
        v-if="tableData"
        :data="tableData"
        :areRowsClickable="true"
        @rowClicked="onTableRowClick($event)"
        @dataRequested="onTableDataRequested($event)"
      />
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRoleEntity, AccountRolesEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { AccessRoleApi } from '@/api/auth/access-role/access-role.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiCheckbox from '@/app/ui-kit/UiCheckbox.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiDialog,
      UiTable,
      UiIcon,
      UiButton,
      UiCheckbox,
    },
    emits: ['confirm'],
  })
  export default class AccountRolesDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Prop({ required: true })
    public accountRoles: AccountRolesEntity = null;

    @LazyInject(AccessRoleApi)
    public accessRoleApi: AccessRoleApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public tableData: UiTableData = null;
    public selectedAccessRoles: { role: AccessRoleEntity; enabled: boolean }[] = [];

    public onTableRowClick(role: AccessRoleEntity): void {
      if (this.isAccessRoleAdded(role)) {
        return;
      }

      this.selectedAccessRoles = [...this.selectedAccessRoles, { role, enabled: false }];
    }

    public show(): void {
      this.setupTableData([], ITEMS_PER_PAGE);
      this.selectedAccessRoles = this.accountRoles.accessRoles.map((el) => ({
        role: new AccessRoleEntity({ id: el.id, name: null, description: null, accessRightsIds: [] }),
        enabled: el.enabled,
      }));
      this.dialog.show();
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.accessRoleApi.list(offset, limit);
        const noNameRoles = this.selectedAccessRoles.filter((el) => !el.role.name);
        noNameRoles.forEach((el) => {
          const foundOne = response.data.find((res) => res.id === el.role.id);
          if (foundOne) {
            el.role.name = foundOne.name;
          }
        });
        this.setupTableData(response.data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public onConfirm(): void {
      const accountRoles = new AccountRolesEntity(this.accountRoles);
      accountRoles.accessRoles = this.selectedAccessRoles.map((el) => ({ id: el.role.id, enabled: el.enabled }));
      this.$emit('confirm', accountRoles);
      this.dialog.hide();
    }

    public onAccessRoleDelete(accessRole: AccessRoleEntity): void {
      this.selectedAccessRoles = this.selectedAccessRoles.filter((el) => el.role.id !== accessRole.id);
    }

    private setupTableData(accessRole: AccessRoleEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['name'],
        data: accessRole,
        limit,
        mapColumnValues: {
          name: (value, rowData: AccessRoleEntity) => (this.isAccessRoleAdded(rowData) ? `✅ ${value}` : value),
        },
      });
    }

    private isAccessRoleAdded(accessRole: AccessRoleEntity): boolean {
      return this.selectedAccessRoles.some((el) => el.role.id === accessRole.id);
    }
  }
</script>

<style scoped lang="scss">
  .account-roles-dialog {
    &__roles {
      @include UiMargin(4, bottom);
      display: flex;
      flex-direction: column;
      @include UiGap(1, false);
    }

    &__role-name {
      flex-grow: 1;
    }

    &__role {
      display: flex;
      align-items: center;
      @include UiPadding(1, top, false);
      @include UiPadding(1, bottom, false);
      @include UiPadding(4, left, false);
      @include UiPadding(4, right, false);
      @include UiBorderRadius(sm);
      background-color: rgba(0, 0, 0, 0.25);
      @include UiGap(1, false);

      > * {
        flex-shrink: 0;
      }
    }
  }
</style>
