<template>
  <div class="account-type-roles-setup">
    <UiHeading class="account-type-roles-setup__heading">{{ $t('accessSetup.accountTypeRoles.title') }}</UiHeading>
    <p class="account-type-roles-setup__description">{{ $t('accessSetup.accountTypeRoles.description') }}</p>

    <UiButton class="account-type-roles-setup__add-button" shade="accent" @click="onAddAccountTypeRolesClick">
      {{ $t('accessSetup.accountTypeRoles.addEditAccountTypeRoles') }}
    </UiButton>

    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onTableRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />

    <AccountTypeRolesDialog
      ref="accountTypeRolesDialog"
      @delete="onDeleteConfirm($event)"
      @edit="onEditConfirm($event)"
    />

    <AddEditAccountTypeRolesDialog
      ref="addEditAccountTypeRolesDialog"
      @confirm="onAddAccountTypeRolesConfirm($event)"
    />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccountTypeRolesEntity } from '@kwokka/entities';
  import { DateUtil, ObjectUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import { AccountTypeRolesApi } from '@/api/auth/account-type-roles/account-type-roles.api';
  import AccountTypeRolesDialog from './AccountTypeRolesDialog.vue';
  import AddEditAccountTypeRolesDialog from './AddEditAccountTypeRolesDialog.vue';
  import { NotificationService } from '@/service/notification/notification.service';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiHeading,
      UiTable,
      UiButton,
      AccountTypeRolesDialog,
      AddEditAccountTypeRolesDialog,
    },
  })
  export default class AccountTypeRolesSetup extends Vue {
    @Ref()
    public accountTypeRolesDialog: AccountTypeRolesDialog;

    @Ref()
    public addEditAccountTypeRolesDialog: AddEditAccountTypeRolesDialog;

    @Ref()
    public table: UiTable;

    public tableData: UiTableData = null;
    private accountTypeRoles: AccountTypeRolesEntity[] = [];

    @LazyInject(AccountTypeRolesApi)
    public accountTypeRolesApi: AccountTypeRolesApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public created(): void {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public onTableRowClick(accountTypeRoles: AccountTypeRolesEntity): void {
      this.accountTypeRolesDialog.show(accountTypeRoles);
    }

    public async onDeleteConfirm(accountTypeRoles: AccountTypeRolesEntity): Promise<void> {
      try {
        await this.accountTypeRolesApi.delete(accountTypeRoles.id);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accountTypeRoles.deletedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onEditConfirm(accountTypeRoles: AccountTypeRolesEntity): Promise<void> {
      try {
        const fields = ObjectUtil.take(accountTypeRoles, ['accessRolesIds']);
        await this.accountTypeRolesApi.update(accountTypeRoles.id, fields);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accountTypeRoles.updatedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public onAddAccountTypeRolesClick(): void {
      this.addEditAccountTypeRolesDialog.show();
    }

    public async onAddAccountTypeRolesConfirm(accountTypeRoles: AccountTypeRolesEntity): Promise<void> {
      try {
        await this.accountTypeRolesApi.create(accountTypeRoles);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('accessSetup.accountTypeRoles.addedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.accountTypeRolesApi.list(offset, limit);
        this.accountTypeRoles = response.data;
        this.setupTableData(this.accountTypeRoles, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private setupTableData(accountTypeRoles: AccountTypeRolesEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['type', 'createdAt'],
        data: accountTypeRoles,
        limit,
        mapColumnValues: {
          createdAt: (data: Date) => DateUtil.format(data),
        },
      });
    }
  }
</script>

<style scoped lang="scss">
  .account-type-roles-setup {
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
