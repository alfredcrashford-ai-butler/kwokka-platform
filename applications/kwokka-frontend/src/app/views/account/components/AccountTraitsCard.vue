<template>
  <UiCard v-if="account && traits" class="account-traits-card">
    <UiHeading size="2">{{ $t('account.traits.title') }}</UiHeading>

    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onTableRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />
    <div v-else class="account-traits-card__empty">{{ $t('account.traits.empty') }}</div>

    <AccountTraitDialog ref="dialog" :account="account" @confirm="onAccountTraitConfirm($event)" />
  </UiCard>
  <UiSkeleton v-else />
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { AccountEntity, TraitEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import { LazyInject } from '@/ioc';
  import type { UiTableData } from '@/app/ui-kit/UiTable.vue';
  import UiTable from '@/app/ui-kit/UiTable.vue';
  import AccountTraitDialog from './AccountTraitDialog.vue';
  import { TraitApi } from '@/api/avatar/trait/trait.api';
  import { TraitInstanceApi } from '@/api/avatar/trait-instance/trait-instance.api';
  import { NotificationService } from '@/service/notification/notification.service';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiCard,
      UiSkeleton,
      UiHeading,
      UiTable,
      AccountTraitDialog,
    },
  })
  export default class AccountTraitsCard extends Vue {
    public tableData: UiTableData = null;
    public traits: TraitEntity[] = null;

    @Ref()
    public dialog: AccountTraitDialog;

    @Prop({ required: true })
    public account: AccountEntity = null;

    @LazyInject(TraitApi)
    public traitApi: TraitApi;

    @LazyInject(TraitInstanceApi)
    public traitInstanceApi: TraitInstanceApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public async mounted(): Promise<void> {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public async onAccountTraitConfirm(value: any): Promise<void> {
      // TODO: implement
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.traitApi.list(offset, limit);
        this.setupTableData(response.data, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public onTableRowClick(trait: TraitEntity): void {
      this.dialog.show(trait);
    }

    private setupTableData(traits: TraitEntity[], limit: number): void {
      this.traits = traits;
      this.tableData = markRaw({
        columns: ['key', 'type', 'applicationAccountId'],
        data: traits,
        limit,
      });
    }
  }
</script>

<style scoped lang="scss">
  .account-traits-card {
    @include UiPadding(4);
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__empty {
      @include UiPadding(10, top);
      @include UiPadding(10, bottom);
      display: flex;
      justify-content: center;
      @include UiTypographyHeading4();
      background-color: rgba(0, 0, 0, 0.4);
      @include UiBorderRadius(lg);
    }
  }
</style>
