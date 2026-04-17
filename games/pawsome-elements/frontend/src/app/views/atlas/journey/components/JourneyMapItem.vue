<template>
  <div
    class="journey-map-item"
    :class="{
      'journey-map-item_pos-top': position === 'top',
      'journey-map-item_pos-bottom': position === 'bottom',
      'journey-map-item_is-active': isActive,
      'journey-map-item_is-selected': isSelected,
    }"
  >
    <div class="journey-map-item__container" v-ui-sound @click="$emit('click', $event)">
      <div class="journey-map-item__icon">
        <div
          class="journey-map-item__icon-background journey-map-item__icon-background_accent"
          :class="{ 'journey-map-item__icon-background_hidden': !isHighlighted }"
        ></div>
        <div class="journey-map-item__icon-background"></div>
        <span class="journey-map-item__num">{{ num }}</span>
      </div>
      <CaptionPanel class="journey-map-item__preview">
        <template v-if="item && itemTrade">
          <UiResponsiveImage
            class="journey-map-item__img"
            :src="`${itemsSrc}/${item?.key}.webp`"
            :alt="$t(`item.${item?.key}.title`)"
          />
          <h4 class="journey-map-item__name">{{ $t(`item.${item?.key}.title`) }}</h4>
          <PriceTag class="journey-map-item__price" :value="itemTrade?.tradedItemQuantity" v-if="isCostShown" />
        </template>
      </CaptionPanel>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { ItemEntity, ItemTradeEntity } from '@kwokka/entities';
  import CaptionPanel from '@/app/components/CaptionPanel.vue';
  import PriceTag from '@/app/components/PriceTag.vue';
  import { UiResponsiveImage } from '@/app/ui-kit';
  import { LazyInject } from '@/ioc';
  import { ConfigService } from '@/service';

  @Component({
    components: {
      CaptionPanel,
      UiResponsiveImage,
      PriceTag,
    },
    emits: ['click'],
  })
  export default class JourneyMapItem extends Vue {
    @Prop({ default: null })
    public item: ItemEntity;

    @Prop({ default: null })
    public itemTrade: ItemTradeEntity;

    @Prop({ required: true })
    public position: 'top' | 'bottom';

    @Prop({ required: true })
    public num: number;

    @Prop({ default: true })
    public isActive: boolean;

    @Prop({ default: false })
    public isSelected: boolean;

    @Prop({ default: false })
    public isHighlighted: boolean;

    @Prop({ default: true })
    public isCostShown: boolean;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    public get itemsSrc(): string {
      return this.configService.frontendConfig.kwokkaItemsSrc;
    }
  }
</script>

<style scoped lang="scss">
  .journey-map-item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: brightness(0.5) !important;

    &_is-active {
      filter: brightness(1) !important;
    }

    &_is-selected {
      filter: brightness(1.25) !important;

      &.journey-map-item:not(.journey-map-item_is-active) {
        filter: brightness(0.75) !important;
      }

      .journey-map-item__icon,
      &.journey-map-item_pos-top .journey-map-item__preview,
      &.journey-map-item_pos-bottom .journey-map-item__preview {
        transition-duration: 200ms;
        transition-timing-function: ease;
        transition-delay: 0ms;
      }

      .journey-map-item__icon {
        transform: scale(1.2);
      }

      &.journey-map-item_pos-top .journey-map-item__preview {
        transform: translateY(10%);
      }

      &.journey-map-item_pos-bottom .journey-map-item__preview {
        transform: translateY(-10%);
      }
    }

    &_pos-top {
      .journey-map-item__preview:after {
        top: 0;
        transform: translate(-50%, -100%) rotateZ(180deg);
      }
    }

    &_pos-bottom {
      > .journey-map-item__container {
        flex-direction: column-reverse;
      }

      .journey-map-item__preview:after {
        bottom: 1px;
        transform: translate(-50%, 100%);
      }
    }

    &__container {
      position: relative;
      @include UiButtonAppearance();
      display: flex;
      flex-direction: column;
      align-items: center;
      @include UiGap(3);
      width: fit-content;
    }

    &__icon {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: UiSpacing(6);
      height: UiSpacing(6);
      @include UiPadding(0.5, bottom);
      @include UiBoxShadow(1);
      @include UiBorderRadius(10);
    }

    &__preview {
      position: relative;
      @include UiBoxShadow(2);
      height: UiSpacing(32);
      width: UiSpacing(20);
      display: flex;
      flex-direction: column;
      @include UiPadding(2);
      @include UiGap(1);
      text-align: center;
      align-items: center;

      &:after {
        z-index: 0;
        content: '';
        position: absolute;
        background-image: url('/static/atlas/pin.webp');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        width: UiSpacing(3);
        height: UiSpacing(2);
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &__icon,
    &__preview {
      transition: transform UiTransition(spring);
      will-change: transition;
      transition-duration: 1000ms;
      transition-delay: 100ms;
    }

    &__icon-background {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-image: url('/static/atlas/circle.webp');
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      transition:
        transform ease 200ms,
        opacity ease 200ms;

      &_accent {
        width: 140%;
        height: 140%;
        transform: translate(-50%, -50%) rotateZ(45deg) scale(1);
        background-image: url('/static/atlas/circle_focused.webp');
      }

      &_hidden {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
    }

    &__num {
      position: relative;
      @include UiTextShadow(1);
    }

    &__img {
      pointer-events: none;
      width: 100%;
      aspect-ratio: 1;
    }

    &__name {
      @include UiTypographyParagraph1();
      flex-grow: 1;
      @include UiTextShadow(3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
</style>
