<template>
  <UiDialog
    ref="dialog"
    :title="$t('inventory.manage.takeItem')"
    :shouldCloseOnPrimaryButtonClick="false"
    :isPrimaryButtonDisabled="!quantity || !item"
    @primaryButtonClick="$emit('confirm', { account, item, quantity })"
  >
    <template v-slot:body>
      <div class="take-item-dialog">
        <div>{{ $t('inventory.manage.from') }}</div>
        <div v-if="account" class="take-item-dialog__from">
          <span>{{ $t('inventory.manage.accountId') }}: {{ account.id }}</span>
          <span>{{ $t('inventory.manage.profileName') }}: {{ profile?.name || '(no profile)' }}</span>
        </div>
        <div v-else class="take-item-dialog__from">
          {{ $t('inventory.manage.yourself') }}
        </div>
        <ItemCard class="take-item-dialog__item" :item="item" :isClickable="false" :arePropertiesShown="false" />
        <UiInput
          :label="$t('inventory.manage.quantityLabel')"
          mode="compact"
          type="number"
          min="0"
          :placeholder="$t('inventory.manage.quantityPlaceholder')"
          v-model="quantity"
        />
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccountEntity, ProfileEntity, type ItemEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { ItemApi } from '@/api/avatar/item/item.api';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import ItemCard from '@/app/components/ItemCard.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';

  @Component({
    components: {
      ItemCard,
      UiDialog,
      UiHeading,
      UiInput,
    },
    emits: ['confirm'],
  })
  export default class TakeItemDialog extends Vue {
    public account: AccountEntity = null;
    public profile: ProfileEntity = null;
    public item: ItemEntity = null;
    public quantity: number = 0;

    @LazyInject(ItemApi)
    public itemApi: ItemApi;

    @Ref()
    public dialog: UiDialog;

    public show(item: ItemEntity, account?: AccountEntity, profile?: ProfileEntity): void {
      this.item = item;
      this.account = account;
      this.profile = profile;
      this.quantity = 0;
      this.dialog.show();
    }

    public hide(): void {
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .take-item-dialog {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__item {
      max-width: $grid-step * 80;
    }

    &__from {
      display: flex;
      flex-direction: column;
      @include UiTypographyParagraph2();
    }
  }
</style>
