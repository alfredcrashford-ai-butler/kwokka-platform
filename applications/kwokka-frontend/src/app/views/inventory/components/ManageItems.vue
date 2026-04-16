<template>
  <div class="manage-items">
    <div class="manage-items__account">
      <UiInput
        v-model="accountId"
        mode="compact"
        size="sm"
        :label="$t('inventory.manage.accountIdLabel')"
        :placeholder="$t('inventory.manage.accountIdPlaceholder')"
      />
      <div class="manage-items__account-info" v-if="accountId">
        <span class="manage-items__account-info-entry">
          {{ $t('inventory.manage.accountExists') }}: {{ !!account }}
        </span>
        <span class="manage-items__account-info-entry">
          {{ $t('inventory.manage.profileName') }}: {{ profile?.name || '(no profile)' }}
        </span>
      </div>
    </div>
    <UiButton shade="accent" :disabled="!!accountId && !account" @click="onGiveItemClick">
      {{ $t('inventory.manage.giveItem') }}
    </UiButton>
  </div>

  <GiveItemDialog ref="giveItemDialog" @confirm="onGiveItemConfirm($event)" />
  <TakeItemDialog ref="takeItemDialog" @confirm="onTakeItemConfirm($event)" />
</template>

<script lang="ts">
  import { Component, Ref, Vue, Watch } from 'vue-facing-decorator';
  import type { AccountEntity, ItemEntity, ProfileEntity } from '@kwokka/entities';
  import { FunctionUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { ProfileApi } from '@/api/avatar/profile/profile.api';
  import { AccountApi } from '@/api/auth/account/account.api';
  import { LoggerService } from '@/service/logger/logger.service';
  import { NotificationService } from '@/service/notification/notification.service';
  import { AccessService } from '@/service/access/access.service';
  import ItemCard from '@/app/components/ItemCard.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import GiveItemDialog from './GiveItemDialog.vue';
  import TakeItemDialog from './TakeItemDialog.vue';
  import { ItemApi } from '@/api/avatar/item/item.api';

  type ItemExchangeData = {
    account: AccountEntity;
    item: ItemEntity;
    quantity: number;
  };

  const DEBOUNCE_MILLISECONDS = 500;

  @Component({
    components: {
      ItemCard,
      UiInput,
      UiButton,
      GiveItemDialog,
      TakeItemDialog,
    },
    emits: ['accountSelected', 'itemGiven', 'itemTaken'],
  })
  export default class ManageItems extends Vue {
    public accountId = '';
    public account: AccountEntity = null;
    public profile: ProfileEntity = null;

    @LazyInject(ItemApi)
    public itemApi: ItemApi;

    @LazyInject(AccountApi)
    public accountApi: AccountApi;

    @LazyInject(ProfileApi)
    public profileApi: ProfileApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    @LazyInject(AccessService)
    public accessService: AccessService;

    @Ref()
    public giveItemDialog: GiveItemDialog;

    @Ref()
    public takeItemDialog: TakeItemDialog;

    public mounted() {
      this.handleAccountIdChange = FunctionUtil.debounce(this.handleAccountIdChange.bind(this), DEBOUNCE_MILLISECONDS);
    }

    public showTakeItemDialog(item: ItemEntity): void {
      this.takeItemDialog.show(item, this.account, this.profile);
    }

    public async onTakeItemConfirm(data: ItemExchangeData): Promise<void> {
      const accountId = data.account?.id || this.accessService.accountId;
      try {
        const itemInstance = await this.itemApi.takeItemInstanceByItemId(accountId, data.item.id, data.quantity);
        this.notificationService.show({ type: 'success', text: this.$t('inventory.manage.itemTakenSuccessfully') });
        this.takeItemDialog.hide();
        this.$emit('itemTaken', itemInstance);
      } catch (e: any) {
        this.logger.error(`Failed to take item with id: ${data.item.id} from account with id: ${accountId}`, e);
        this.notificationService.showErrors([e]);
      }
    }

    public async onGiveItemConfirm(data: ItemExchangeData): Promise<void> {
      const accountId = data.account?.id || this.accessService.accountId;
      try {
        const itemInstance = await this.itemApi.giveItemInstanceByItemId(accountId, data.item.id, data.quantity);
        this.notificationService.show({ type: 'success', text: this.$t('inventory.manage.itemGivenSuccessfully') });
        this.giveItemDialog.hide();
        this.$emit('itemGiven', itemInstance);
      } catch (e: any) {
        this.logger.error(`Failed to give item with id: ${data.item.id} to account with id: ${accountId}`, e);
        this.notificationService.showErrors([e]);
      }
    }

    public onGiveItemClick(): void {
      this.giveItemDialog.show(this.account, this.profile);
    }

    @Watch('accountId')
    public onAccountIdChange(value: string): void {
      this.handleAccountIdChange(value);
    }

    private async handleAccountIdChange(accountId: string): Promise<void> {
      if (!accountId) {
        this.$emit('accountSelected', null);
        return;
      }

      try {
        this.account = await this.accountApi.getById(accountId);
      } catch (e: any) {
        this.account = null;
        this.profile = null;
        this.notificationService.showErrors([e]);
        return;
      }

      try {
        this.profile = await this.profileApi.getByAccountId(accountId);
      } catch (e: any) {
        this.logger.warn('Failed to fetch account profile', e);
      }

      this.$emit('accountSelected', this.account);
    }
  }
</script>

<style scoped lang="scss">
  .manage-items {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    &__account {
      > * {
        flex-shrink: 0;
      }

      display: flex;
      @include UiGap(4);
      flex-grow: 1;
    }

    &__account-info {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    &__account-info-entry {
      @include UiTypographyParagraph3();
      white-space: nowrap;
    }
  }
</style>
