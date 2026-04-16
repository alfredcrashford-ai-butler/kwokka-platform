<template>
  <UiCard v-if="account" class="account-tokens-card">
    <UiHeading class="account-details-card__heading" size="2">{{ $t('account.tokens.title') }}</UiHeading>
    <UiTable
      ref="table"
      v-if="tableData"
      :data="tableData"
      :areRowsClickable="true"
      @rowClicked="onTableRowClick($event)"
      @dataRequested="onTableDataRequested($event)"
    />
    <TokenDialog ref="dialog" @revokeCorrelation="onRevokeCorrelation($event)" />
  </UiCard>
  <UiSkeleton v-else />
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { DateUtil } from '@kwokka/utils';
  import type { AccountEntity, TokenEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiTable, { type UiTableData } from '@/app/ui-kit/UiTable.vue';
  import { TokenApi } from '@/api/auth/token/token.api';
  import { LazyInject } from '@/ioc';
  import TokenDialog from './TokenDialog.vue';
  import { NotificationService } from '@/service/notification/notification.service';

  const ITEMS_PER_PAGE = 10;

  @Component({
    components: {
      UiCard,
      UiSkeleton,
      UiHeading,
      UiTable,
      TokenDialog,
    },
  })
  export default class AccountTokensCard extends Vue {
    @Prop({ required: true })
    public account: AccountEntity = null;

    @Ref()
    public table: UiTable;

    @Ref()
    public dialog: TokenDialog;

    public tableData: UiTableData = null;
    private tokens: TokenEntity[] = [];

    @LazyInject(TokenApi)
    public tokenApi: TokenApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public created() {
      this.setupTableData([], ITEMS_PER_PAGE);
    }

    public onTableRowClick(token: TokenEntity) {
      this.dialog.show(token);
    }

    public async onTableDataRequested({ offset, limit }): Promise<void> {
      try {
        const response = await this.tokenApi.listByAccountId(this.account.id, offset, limit);
        this.tokens = response.data;
        this.setupTableData(this.tokens, response.meta.limit);
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onRevokeCorrelation(token: TokenEntity): Promise<void> {
      try {
        await this.tokenApi.revokeAccessByCorrelationId(token.correlationId);
        this.table.reset();
        this.notificationService.show({
          text: this.$t('account.tokens.revokedCorrelationSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    private setupTableData(tokens: TokenEntity[], limit: number): void {
      this.tableData = markRaw({
        columns: ['type', 'credentialId', 'correlationId', 'revokedAt', 'expiresAt', 'createdAt'],
        data: tokens,
        limit,
        mapColumnValues: {
          createdAt: (data: Date) => (data ? DateUtil.format(data) : '-'),
          expiresAt: (data: Date) => (data ? DateUtil.format(data) : '-'),
          revokedAt: (data: Date) => (data ? DateUtil.format(data) : '-'),
        },
      });
    }
  }
</script>

<style scoped lang="scss">
  .account-tokens-card {
    @include UiPadding(4);
    display: flex;
    flex-direction: column;
    @include UiGap(4);
  }
</style>
