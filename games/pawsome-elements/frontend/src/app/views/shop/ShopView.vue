<template>
  <MenuLayout class="shop-view">
    <div class="shop-view__container">
      <div class="shop-view__navigation">
        <UiCircleButton class="shop-view__back-button ui-hide_portrait" icon="arrow-left" @click="onBackClick()" />
        <ShopItem
          v-for="set in displayedSets"
          :key="set.id"
          :class="{ 'shop-view__navigation-item_active': selectedSet?.id === set.id }"
          class="shop-view__navigation-item"
          :heading="set.heading"
          :imageSrc="set.imageSrc"
          @click="selectedSet = set"
        />
      </div>
      <ShopViewMain class="shop-view__main" :set="selectedSet" @back="onBackClick()" />
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import { UiCircleButton } from '@/app/ui-kit';
  import ShopItem from './components/ShopItem.vue';
  import { PawsomeElementsCardSet } from '@/game-data/game-instance';
  import ShopViewMain from './components/ShopViewMain.vue';
  import type { DisplaySet } from './display-set';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      MenuLayout,
      UiCircleButton,
      ShopItem,
      ShopViewMain,
    },
  })
  export default class ShopView extends Vue {
    public readonly sets = PawsomeElementsCardSet;
    public selectedSet: DisplaySet = null;

    public get displayedSets(): DisplaySet[] {
      const sets = [
        PawsomeElementsCardSet.CurseOfVoodoo,
        PawsomeElementsCardSet.ForgottenFormulas,
        PawsomeElementsCardSet.SecretsOfZen,
      ];
      return sets.map((id) => ({
        id,
        heading: this.$t(`cardSet.${id}.title`),
        shortDescription: this.$t(`cardSet.${id}.shortDescription`),
        description: this.$t(`cardSet.${id}.description`),
        imageSrc: `/static/card_set/${id}.webp`,
      }));
    }

    private onBackClick(): void {
      this.$router.replace({ name: RouteName.Main });
    }
  }
</script>

<style lang="scss">
  .shop-view {
    &.v-enter-active {
      transition-duration: 600ms;

      .shop-view__navigation {
        animation-name: UiAnimationFadeIn, UiAnimationSlideInLeft;
        animation-timing-function: linear, ease-out;
        animation-duration: 400ms;
      }

      .shop-view__main {
        animation-name: UiAnimationFadeIn, UiAnimationSlideInRight;
        animation-timing-function: linear, ease-out;
        animation-duration: 400ms;
        animation-delay: 200ms;
      }
    }

    &.v-leave-active {
      transition-duration: 500ms;

      .shop-view__navigation {
        animation-name: UiAnimationFadeOut, UiAnimationSlideOutLeft;
        animation-timing-function: linear, ease-out;
        animation-duration: 500ms;
      }

      .shop-view__main {
        animation-name: UiAnimationFadeOut, UiAnimationSlideOutRight;
        animation-timing-function: linear, ease-out;
        animation-duration: 500ms;
      }
    }
  }
</style>

<style scoped lang="scss">
  .shop-view {
    height: 100%;
    width: 100%;

    &__container {
      display: flex;
      height: 100%;
      width: 100%;
      @include UiGap(8);

      @include UiMediaPortrait() {
        flex-direction: column-reverse;
        @include UiGap(4);
      }
    }

    &__navigation {
      position: relative;
      flex-shrink: 0;
      height: calc(100% - UiSpacing(10));
      align-self: flex-end;
      width: UiSpacing(32);
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      background: UiColor(secondary-900) linear-gradient(UiColor(shade-900, 0.4), UiColor(shade-900, 0.8));
      @include UiBorderRadius(2);
      @include UiPadding(4);
      @include UiGap(4);
      @include UiDropShadow(3);
      animation-fill-mode: both;

      @include UiMediaPortrait() {
        height: UiSpacing(36);
        width: 100%;
        flex-direction: row;
      }

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
        border-style: solid;
        border-image-source: url('/static/ui/frame_2.webp');
        border-image-slice: 60;
        border-width: UiSpacing(4);
      }
    }

    &__navigation-item {
      width: 100%;
      aspect-ratio: 1;
      transition: transform ease 100ms;

      &_active {
        filter: brightness(1.2) !important;
        transform: scale(1.05);
      }

      @include UiMediaPortrait() {
        height: 100%;
        width: auto;
      }
    }

    &__back-button {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-25%, -25%);
      z-index: 1000;
    }

    &__main {
      animation-fill-mode: both;
    }
  }
</style>
