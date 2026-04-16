<template>
  <UiDialog
    ref="dialog"
    :title="$t('inventory.manage.giveItem')"
    :shouldCloseOnPrimaryButtonClick="false"
    :isPrimaryButtonDisabled="!quantity || !item"
    @primaryButtonClick="$emit('confirm', { account, item, quantity })"
  >
    <template v-slot:body>
      <div class="give-item-dialog">
        <div>{{ $t('inventory.manage.to') }}</div>
        <div v-if="account" class="give-item-dialog__to">
          <span>{{ $t('inventory.manage.accountId') }}: {{ account.id }}</span>
          <span>{{ $t('inventory.manage.profileName') }}: {{ profile?.name || '(no profile)' }}</span>
        </div>
        <div v-else class="give-item-dialog__to">
          {{ $t('inventory.manage.yourself') }}
        </div>
        <UiInput
          :label="$t('inventory.manage.itemIdLabel')"
          mode="compact"
          :placeholder="$t('inventory.manage.itemIdPlaceholder')"
          v-model="itemId"
        />
        <div class="give-item-dialog__item-placeholder" v-if="!item">{{ $t('inventory.manage.itemNotFound') }}</div>
        <template v-else>
          <ItemCard class="give-item-dialog__item" :item="item" :isClickable="false" :arePropertiesShown="false" />
          <UiInput
            :label="$t('inventory.manage.quantityLabel')"
            mode="compact"
            type="number"
            min="0"
            :placeholder="$t('inventory.manage.quantityPlaceholder')"
            v-model="quantity"
          />
        </template>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { AccountEntity, ProfileEntity, type ItemEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { FunctionUtil } from '@kwokka/utils';
  import { ItemApi } from '@/api/avatar/item/item.api';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import ItemCard from '@/app/components/ItemCard.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';

  const DEBOUNCE_MILLISECONDS = 500;

  @Component({
    components: {
      ItemCard,
      UiDialog,
      UiHeading,
      UiInput,
    },
    emits: ['confirm'],
  })
  export default class GiveItemDialog extends Vue {
    public account: AccountEntity = null;
    public profile: ProfileEntity = null;
    public itemId: string = '';
    public item: ItemEntity = null;
    public quantity: number = 0;

    @LazyInject(ItemApi)
    public itemApi: ItemApi;

    @Ref()
    public dialog: UiDialog;

    public mounted(): void {
      this.handleItemIdChange = FunctionUtil.debounce(this.handleItemIdChange.bind(this), DEBOUNCE_MILLISECONDS);
    }

    public show(account?: AccountEntity, profile?: ProfileEntity): void {
      this.account = account;
      this.profile = profile;
      this.item = null;
      this.itemId = '';
      this.quantity = 0;
      this.dialog.show();
    }

    public hide(): void {
      this.dialog.hide();
    }

    @Watch('itemId')
    public onAccountIdChange(value: string): void {
      this.handleItemIdChange(value);
    }

    private async handleItemIdChange(itemId: string): Promise<void> {
      if (!itemId) {
        this.item = null;
        return;
      }

      try {
        this.item = await this.itemApi.getById(itemId);
      } catch (e: any) {
        this.item = null;
      }
    }
  }
</script>

<style scoped lang="scss">
  .give-item-dialog {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__item {
      max-width: $grid-step * 80;
    }

    &__to {
      display: flex;
      flex-direction: column;
      @include UiTypographyParagraph2();
    }

    &__item-placeholder {
      width: 100%;
      max-width: $grid-step * 80;
      aspect-ratio: 1;
      @include UiBorderRadius(md);
      border: 1px solid rgba(#fff, 0.5);
      background-color: rgba(#fff, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
