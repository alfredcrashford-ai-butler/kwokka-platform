<template>
  <UiDialog ref="dialog" size="lg" :isPrimaryButtonShown="false" :isSecondaryButtonShown="false">
    <template v-slot:body>
      <div class="item-instance-dialog">
        <ItemCard
          class="item-instance-dialog__item"
          :item="item"
          :itemInstance="itemInstance"
          :isClickable="false"
          :arePropertiesShown="false"
        />
        <div class="item-instance-dialog__details">
          <div class="item-instance-dialog__properties">
            <span class="item-instance-dialog__property">
              <UiIcon size="sm" :name="item?.isTransferrable ? 'check' : 'x'" />
              {{ $t(`inventory.${item?.isTransferrable ? 'transferrable' : 'untransferrable'}`) }}
            </span>
          </div>
          <p
            v-if="$te(`items.${item?.key}.description`)"
            class="item-instance-dialog__description"
            v-html="
              $te(`items.${item?.key}.description`)
                ? $t(`items.${item?.key}.description`)
                : $t('inventory.noDescription')
            "
          />
          <template v-if="canManage">
            <UiHeading size="4">{{ $t('inventory.otherActions') }}</UiHeading>
            <UiButton shade="accent" @click="$emit('take', item)">{{ $t('inventory.manage.takeItem') }}</UiButton>
          </template>
        </div>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { type ItemEntity, type ItemInstanceEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { AccessService } from '@/service/access/access.service';
  import { CapybaraAccessRight } from '@kwokka/rights';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import ItemCard from '@/app/components/ItemCard.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import ItemAction from './ItemAction.vue';

  @Component({
    components: {
      ItemCard,
      UiDialog,
      UiIcon,
      UiHeading,
      UiButton,
      ItemAction,
    },
    emits: ['take'],
  })
  export default class ItemInstanceDialog extends Vue {
    public itemInstance: ItemInstanceEntity = null;
    public item: ItemEntity = null;

    @Ref()
    public dialog: UiDialog;

    @LazyInject(AccessService)
    public accessService: AccessService;

    public get canManage(): boolean {
      return this.accessService.hasRight(CapybaraAccessRight.ManageItems);
    }

    public show(itemInstance: ItemInstanceEntity, item: ItemEntity): void {
      this.itemInstance = itemInstance;
      this.item = item;
      this.dialog.show();
    }

    public hide(): void {
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .item-instance-dialog {
    display: flex;
    @include UiGap(4, false);

    @include UiMediaMobile() {
      flex-direction: column;
      align-items: center;
    }

    &__item {
      max-width: $grid-step * 60;
      flex-shrink: 0;
      width: 100%;
      align-self: flex-start;
    }

    &__description {
      background-color: rgba(#000, 0.25);
      @include UiPadding(4, null, false);
      @include UiBorderRadius(md);
      @include UiTypographyParagraph2();
      text-align: justify;

      :deep(b) {
        @include UiFontWeight(bold);
        @include UiTheme() {
          color: UiColor(yellow-500);
        }
      }
    }

    &__details {
      display: flex;
      flex-direction: column;
      @include UiGap(2, false);
      flex-grow: 1;
    }

    &__properties {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    &__property {
      @include UiTypographyParagraph3();
      display: flex;
      align-items: center;
      @include UiGap(1, false);
      @include UiPadding(2, left, false);
      @include UiPadding(2, right, false);
      background-color: rgba(#000, 0.25);
      @include UiBorderRadius(sm);
    }
  }
</style>
