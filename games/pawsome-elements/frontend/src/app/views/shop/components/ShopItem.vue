<template>
  <div v-ui-sound class="shop-item" @click="$emit('click', $event)">
    <UiResponsiveImage class="shop-item__image" :src="imageSrc" mode="cover" :alt="heading" />
    <h2 class="shop-item__text">{{ heading }}</h2>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { ItemCard } from '@/app/components';
  import { UiResponsiveImage } from '@/app/ui-kit';

  @Component({
    components: {
      ItemCard,
      UiResponsiveImage,
    },
    emits: ['click'],
  })
  export default class ShopItem extends Vue {
    @Prop({ required: true })
    public heading: string;

    @Prop({ required: true })
    public imageSrc: string;
  }
</script>

<style scoped lang="scss">
  .shop-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    @include UiGap(1);
    width: 100%;
    aspect-ratio: 1;
    @include UiBorderRadius(2);
    @include UiButtonAppearance();
    background: UiColor(primary-400) linear-gradient(UiColor(shade-900, 0.6), UiColor(shade-900, 0.3));
    @include UiBoxShadow(3);

    &__image {
      position: absolute;
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
      border: UiSpacing(0.6) solid UiColor(secondary-900);
      @include UiBorderRadius(2);
      pointer-events: none;
    }

    &__text {
      position: absolute;
      z-index: 1;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      @include UiTextShadow(3);
      @include UiTypographyHeading5();
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
      border-image-slice: 100;
      border-width: UiSpacing(4);
    }
  }
</style>
