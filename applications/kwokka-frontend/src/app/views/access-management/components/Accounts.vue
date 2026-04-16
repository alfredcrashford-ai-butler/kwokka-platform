<template>
  <div class="accounts">
    <div class="accounts__row">
      <UiHeading size="2">{{ $t('accessManagement.accounts.title') }}</UiHeading>
      <UiButton @click="createAccountDialog.show()">{{ $t('accessManagement.accounts.create') }}</UiButton>
    </div>
    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />

    <CreateAccountDialog ref="createAccountDialog" @confirm="onCreateAccountConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccountEntityType, type AccountEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { AccountApi } from '@/api/auth/account/account.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import CreateAccountDialog from './CreateAccountDialog.vue';
  import { ProfileApi } from '@/api/avatar/profile/profile.api';

  const ITEMS_PER_PAGE = 10;

  interface AccountViewModel extends AccountEntity {
    name: string;
    locale: string;
  }

  @Component({
    components: {
      UiTable,
      UiHeading,
      UiButton,
      CreateAccountDialog,
    },
  })
  export default class Accounts extends Vue {
    @Ref()
    public table: UiTable;

    @Ref()
    public createAccountDialog: CreateAccountDialog;

    public tableData: UiTableData = null;

    @LazyInject(AccountApi)
    public accountApi: AccountApi;

    @LazyInject(ProfileApi)
    public profileApi: ProfileApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public async onRowClick(account: AccountEntity): Promise<void> {
      this.$router.push({ name: 'account-access-management', params: { id: account.id } });
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.accountApi.list(offset, limit);
        const accounts = response.data;
        const data = await Promise.all(
          accounts.map(async (account) => {
            const profile = await this.profileApi.getByAccountId(account.id);
            return { ...account, name: profile?.name, locale: profile?.locale };
          }),
        );
        this.setupTableData(data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onCreateAccountConfirm(accountType: AccountEntityType): Promise<void> {
      try {
        if (accountType === AccountEntityType.User) {
          await this.accountApi.createUser();
        } else if (accountType === AccountEntityType.Application) {
          await this.accountApi.createApplication();
        } else if (accountType === AccountEntityType.ApplicationAdmin) {
          await this.accountApi.createApplicationAdmin();
        } else {
          this.notificationService.show({
            type: 'error',
            text: this.$t('accessManagement.accounts.createOfTypeNotAllowed'),
          });
          return;
        }

        this.notificationService.show({
          type: 'success',
          text: this.$t('accessManagement.accounts.createdSuccessfully'),
        });
        this.table.reset();
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private setupTableData(data: AccountViewModel[], limit: number): void {
      this.tableData = markRaw({
        columns: ['id', 'name', 'type', 'isVerified', 'isActive', 'locale'],
        data,
        limit,
      });
    }
  }
</script>

<style scoped lang="scss">
  .accounts {
    @include UiGap(4);
    display: flex;
    flex-direction: column;

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
