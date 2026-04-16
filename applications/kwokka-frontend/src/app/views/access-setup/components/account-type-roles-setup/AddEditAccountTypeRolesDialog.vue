<template>
  <UiDialog
    ref="dialog"
    size="lg"
    :title="$t('accessSetup.accountTypeRoles.addEditAccountTypeRoles')"
    :isPrimaryButtonDisabled="!isValid"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <template v-if="accountTypeRoles">
        <UiSimpleSelect
          class="add-account-type-roles-dialog__input"
          :options="accountTypes"
          v-model="accountTypeRoles.type"
          width="block"
          mode="compact"
          :placeholder="$t('accessSetup.accountTypeRoles.addEditAccountTypeRolesPlaceholder')"
        />

        <p class="add-account-type-roles-dialog__label">{{ $t('accessSetup.accountTypeRoles.accessRoles') }}</p>

        <div class="add-account-type-roles-dialog__roles">
          <UiChip v-for="accessRole in selectedAccessRoles" :key="accessRole.id">
            <span>{{ accessRole.name }}</span>
            <UiButton
              size="xxs"
              type="transparent"
              width="shrink"
              shape="circled"
              @click="onRemoveAccessRoleClick(accessRole)"
            >
              <UiIcon name="x" size="xs" />
            </UiButton>
          </UiChip>
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
      <UiLoader v-else />
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRoleEntity, AccountEntityType, AccountTypeRolesEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import { AccessRoleApi } from '@/api/auth/access-role/access-role.api';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiChip from '@/app/ui-kit/UiChip.vue';
  import UiSimpleSelect from '@/app/ui-kit/UiSimpleSelect.vue';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';

  const ITEMS_PER_PAGE = 5;

  @Component({
    components: {
      UiTable,
      UiDialog,
      UiButton,
      UiIcon,
      UiChip,
      UiSimpleSelect,
      UiLoader,
    },
    emits: ['confirm'],
  })
  export default class AddEditAccountTypeRolesDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public table: UiTable;

    @LazyInject(AccessRoleApi)
    public accessRoleApi: AccessRoleApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public tableData: UiTableData = null;
    public accountTypes: AccountEntityType[] = Object.values(AccountEntityType);
    public selectedAccessRoles: AccessRoleEntity[] = [];
    public accountTypeRoles: AccountTypeRolesEntity = null;

    public get isValid(): boolean {
      return Boolean(this.accountTypeRoles?.type && this.selectedAccessRoles?.length);
    }

    public created(): void {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public onTableRowClick(accessRole: AccessRoleEntity): void {
      if (this.isAccessRoleAdded(accessRole)) {
        return;
      }

      this.selectedAccessRoles = [...this.selectedAccessRoles, accessRole];
    }

    private async setupAccessRoles(accountTypeRoles: AccountTypeRolesEntity): Promise<void> {
      const ids = accountTypeRoles.accessRolesIds;
      this.selectedAccessRoles = await Promise.all(ids.map((id) => this.accessRoleApi.getById(id)));
    }

    public show(accountTypeRoles?: AccountTypeRolesEntity): void {
      accountTypeRoles = new AccountTypeRolesEntity(accountTypeRoles || { type: null, accessRolesIds: [] });
      this.dialog.show();
      this.setupAccessRoles(accountTypeRoles).then(() => (this.accountTypeRoles = accountTypeRoles));
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.accessRoleApi.list(offset, limit);
        this.setupTableData(response.data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public onConfirm(): void {
      this.accountTypeRoles.accessRolesIds = this.selectedAccessRoles.map((el) => el.id);
      this.$emit('confirm', this.accountTypeRoles);
      this.dialog.hide();
    }

    public onRemoveAccessRoleClick(accessRole: AccessRoleEntity): void {
      this.selectedAccessRoles = this.selectedAccessRoles.filter((el) => el.id !== accessRole.id);
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
      return this.selectedAccessRoles.some((el) => el.id === accessRole.id);
    }
  }
</script>

<style scoped lang="scss">
  .add-account-type-roles-dialog {
    &__input {
      @include UiMargin(4, bottom);
    }

    &__roles {
      @include UiMargin(4, bottom);
      display: flex;
      align-items: center;
      @include UiGap(1);
      flex-wrap: wrap;
    }

    &__label {
      @include UiMargin(2, bottom);
    }
  }
</style>
