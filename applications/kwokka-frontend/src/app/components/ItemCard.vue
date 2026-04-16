<template>
  <div
    v-if="item"
    class="item-card"
    tabindex="0"
    :class="[{ 'item-card_clickable': isClickable }, `item-card_rarity-${item?.rarity}`]"
    @click="$emit('click', $event)"
  >
    <UiResponsiveImage class="item-card__image" inert :src="itemImageSrc" />
    <div class="item-card__count" v-if="(itemInstance?.quantity || 0) > 1">{{ itemInstance?.quantity }}</div>
    <div class="item-card__rarity">{{ $t(`general.components.itemCard.rarity.${item?.rarity}`) }}</div>
    <div class="item-card__properties" v-if="arePropertiesShown">
      <UiTooltip v-if="hasTrigger(triggers.Use)" :content="$t('general.components.itemCard.useTooltip')">
        <div class="item-card__property item-card__property_use">
          {{ $t('general.components.itemCard.use') }}
        </div>
      </UiTooltip>
      <UiTooltip v-if="hasTrigger(triggers.Have)" :content="$t('general.components.itemCard.haveTooltip')">
        <div class="item-card__property item-card__property_have">
          {{ $t('general.components.itemCard.have') }}
        </div>
      </UiTooltip>
    </div>
    <div class="item-card__title">
      <DynamicFontSize
        :minScale="0.75"
        :maxScale="1.35"
        :minContentLength="6"
        :maxContentLength="24"
        :text="$t(`items.${item?.key}.name`)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { ItemEntityActionTrigger, type ItemEntity, type ItemInstanceEntity } from '@kwokka/entities';
  import UiResponsiveImage from '@/app/ui-kit/UiResponsiveImage.vue';
  import DynamicFontSize from '@/app/components/DynamicFontSize.vue';
  import UiTooltip from '@/app/ui-kit/UiTooltip.vue';

  @Component({
    components: {
      UiResponsiveImage,
      DynamicFontSize,
      UiTooltip,
    },
    emits: ['click'],
  })
  export default class ItemCard extends Vue {
    public readonly triggers = ItemEntityActionTrigger;

    @Prop({ default: null })
    public itemInstance: ItemInstanceEntity;

    @Prop({ required: true })
    public item: ItemEntity;

    @Prop({ default: true })
    public arePropertiesShown: boolean;

    @Prop({ default: true })
    public isClickable: boolean;

    public get itemImageSrc(): string {
      return `/assets/items/${this.item?.key}.webp`;
    }

    public get hasActiveActions(): string {
      return `/assets/items/${this.item?.key}.webp`;
    }

    public hasTrigger(trigger: ItemEntityActionTrigger): boolean {
      return this.item.actions.some((el) => el.trigger === trigger);
    }
  }
</script>

<style scoped lang="scss">
  .item-card {
    position: relative;
    @include UiBorderRadius(md);
    @include UiPadding(4, false);
    @include UiTheme() {
      border: 1px solid UiColor(shade-100);
    }
    background: linear-gradient(0deg, var(--item-card-bg-from), var(--item-card-bg-to));
    aspect-ratio: 1;

    &_clickable {
      @include UiButtonAppearance();
      @include UiButtonStates();
    }

    &_rarity-junk {
      --item-card-bg-from: #625040;
      --item-card-bg-to: #9d9d9d;
      --item-card-rarity-color: #d8d8d8;
    }

    &_rarity-common {
      --item-card-bg-from: #7d5b5b;
      --item-card-bg-to: #f0f0f0;
      --item-card-rarity-color: #d8d8d8;
    }

    &_rarity-uncommon {
      --item-card-bg-from: #235567;
      --item-card-bg-to: #96d7f1;
      --item-card-rarity-color: #bfedff;
    }

    &_rarity-rare {
      --item-card-bg-from: #0b2b7d;
      --item-card-bg-to: #86a8ff;
      --item-card-rarity-color: #6490ff;
    }

    &_rarity-epic {
      --item-card-bg-from: #2b0036;
      --item-card-bg-to: #dd57ff;
      --item-card-rarity-color: #bc00eb;
    }

    &_rarity-legendary {
      --item-card-bg-from: #764800;
      --item-card-bg-to: #ffd972;
      --item-card-rarity-color: #ffbd00;
    }

    &_rarity-immortal {
      --item-card-bg-from: #4f0f02;
      --item-card-bg-to: #f95738;
      --item-card-rarity-color: #ff9b87;
    }

    &__image {
      width: 100%;
      height: 100%;
    }

    &__title {
      position: absolute;
      left: -1px;
      bottom: -1px;

      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 10%;
      width: calc(100% + 2px);
      height: calc(2lh + 10%);
      background: linear-gradient(0deg, rgba(#000, 0.5) 2lh, transparent);
      overflow: hidden;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
      border-left: 1px solid;
      border-bottom: 1px solid;
      border-right: 1px solid;
      border-color: inherit;

      @include UiTypographyHeading6();
      text-overflow: ellipsis;
      text-align: center;
      word-break: normal;
    }

    &__properties {
      position: absolute;
      right: - UiGridSpacing(2);
      top: UiGridSpacing(12);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      @include UiGap(1, false);
      @include UiTypographyParagraph3();
    }

    &__property {
      $height: UiGridSpacing(3);
      @include UiPadding(2, left, false);
      @include UiPadding(2, right, false);
      border-radius: $height;
      border: 1px solid;
      text-transform: uppercase;
      @include UiFontWeight(bold);
      @include UiShadow(1);

      &_use {
        @include UiTheme() {
          background-color: UiColor(item-trigger-use-1);
          color: UiColor(item-trigger-use-2);
        }
      }

      &_have {
        @include UiTheme() {
          background-color: UiColor(item-trigger-have-1);
          color: UiColor(item-trigger-have-2);
        }
      }
    }

    &__count {
      @include UiTypographyParagraph3();
      position: absolute;
      top: UiGridSpacing(1);
      left: UiGridSpacing(1);

      display: flex;
      align-items: center;
      justify-content: center;
      $size: UiGridSpacing(6);
      min-width: $size;
      height: $size;
      border-radius: $size;

      background-color: rgba(#000, 0.5);
    }

    &__rarity {
      position: absolute;
      top: UiGridSpacing(1);
      right: UiGridSpacing(1);

      $size: UiGridSpacing(6);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: $size;
      height: $size;
      @include UiPadding(2, left, false);
      @include UiPadding(2, right, false);

      @include UiTypographyParagraph3();
      @include UiFontWeight(bold);
      color: var(--item-card-rarity-color);
      text-transform: uppercase;
      background-color: rgba(#000, 0.5);
    }
  }
</style>
