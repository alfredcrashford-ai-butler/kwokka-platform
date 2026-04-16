<template>
  <UiCard v-if="account && accountRoles" class="account-roles-card">
    <UiHeading size="2">{{ $t('account.roles.title') }}</UiHeading>

    <UiTable
      ref="table"
      v-if="tableData && accountRoles?.accessRoles?.length"
      :data="tableData"
      :areRowsClickable="false"
      :showPagination="false"
    />
    <div v-else class="account-roles-card__empty-roles">{{ $t('account.roles.empty') }}</div>

    <UiButton @click="onSetupClick" shade="accent" class="account-roles-card__button">{{
      $t('account.roles.setup')
    }}</UiButton>

    <AccountRolesDialog :accountRoles="accountRoles" ref="dialog" @confirm="onAccountRolesSetupConfirm($event)" />
  </UiCard>
  <UiSkeleton v-else />
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { AccountEntity, AccountRolesEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import { AccountRolesApi } from '@/api/auth/account-roles/account-roles.api';
  import { LazyInject } from '@/ioc';
  import type { UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiTable from '@/app/ui-kit/UiTable.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import AccountRolesDialog from './AccountRolesDialog.vue';

  @Component({
    components: {
      UiCard,
      UiSkeleton,
      UiHeading,
      UiTable,
      UiButton,
      AccountRolesDialog,
    },
  })
  export default class AccountRolesCard extends Vue {
    @Ref()
    public dialog: AccountRolesDialog;

    @Prop({ required: true })
    public account: AccountEntity = null;

    @LazyInject(AccountRolesApi)
    public accountRolesApi: AccountRolesApi;

    public tableData: UiTableData = null;
    public accountRoles: AccountRolesEntity = null;

    public async mounted(): Promise<void> {
      const accountRoles = await this.accountRolesApi.getByAccountId(this.account.id);
      this.setupTableData(accountRoles);
    }

    public onSetupClick(): void {
      this.dialog.show();
    }

    public async onAccountRolesSetupConfirm(accountRoles: AccountRolesEntity): Promise<void> {
      accountRoles = await this.accountRolesApi.update(accountRoles.id, { accessRoles: accountRoles.accessRoles });
      this.setupTableData(accountRoles);
    }

    private setupTableData(accountRoles: AccountRolesEntity): void {
      this.accountRoles = accountRoles;
      this.tableData = markRaw({
        columns: ['id', 'enabled'],
        data: accountRoles.accessRoles,
      });
    }
  }
</script>

<style scoped lang="scss">
  .account-roles-card {
    @include UiPadding(4);
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__empty-roles {
      @include UiPadding(10, top);
      @include UiPadding(10, bottom);
      display: flex;
      justify-content: center;
      @include UiTypographyHeading4();
      background-color: rgba(0, 0, 0, 0.4);
      @include UiBorderRadius(lg);
    }

    &__button {
      align-self: flex-end;
    }
  }
</style>
