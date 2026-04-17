<template>
  <div class="action-card">
    <div class="action-card__title-panel">
      <div class="action-card__title-panel-bg ui-9-box"></div>
      <h1 class="action-card__title">{{ heading }}</h1>
    </div>
    <UiCircleButton
      v-if="isBackButtonShown"
      class="action-card__back"
      icon="arrow-left"
      @click="$emit('backClick', $event)"
    />
    <div class="action-card__container">
      <div class="action-card__container-background ui-9-box"></div>
      <div class="action-card__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UiCircleButton } from '@/app/ui-kit';

  @Component({
    components: { UiCircleButton },
    emits: ['backClick'],
  })
  export default class ActionCard extends Vue {
    @Prop()
    public heading: string;

    @Prop({ default: false })
    public isBackButtonShown: boolean;
  }
</script>

<style scoped lang="scss">
  .action-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    container-type: size;

    &__container {
      position: relative;
      width: 100%;
      height: 100%;
      @include UiPadding(2.3, left);
      @include UiPadding(2.3, right);
      @include UiPadding(1.8, top);
      @include UiPadding(4.5, bottom);
    }

    &__container-background {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      @include Ui9BoxWidth(UiSpacing(6));
      @include Ui9BoxHeight(UiSpacing(6));
      @include Ui9BoxTopLeft('/static/ui/card_1/card_1_top_left.webp');
      @include Ui9BoxTop('/static/ui/card_1/card_1_top.webp');
      @include Ui9BoxTopRight('/static/ui/card_1/card_1_top_right.webp');
      @include Ui9BoxLeft('/static/ui/card_1/card_1_left.webp');
      @include Ui9BoxCenter('/static/ui/card_1/card_1_center.webp');
      @include Ui9BoxRight('/static/ui/card_1/card_1_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/card_1/card_1_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/card_1/card_1_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/card_1/card_1_bottom_right.webp');
      @include UiDropShadow(2);
    }

    &__content {
      position: relative;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-image: url('/static/ui/bricks.webp');
      background-size: cover;
      background-position: center;
      @include UiBorderRadius(0.2);
    }

    &__title-panel {
      flex-shrink: 0;
      width: 100%;
      transform: translateY(50%);
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      @include UiPadding(8, left);
      @include UiPadding(8, right);
      height: UiSpacing(10);
      z-index: 1;
    }

    &__back {
      position: absolute;
      top: UiSpacing(10);
      left: 0;
      transform: translate(-25%, -25%);
      z-index: 1;
    }

    &__title-panel-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transform: translateY(-8%);
      height: auto;
      aspect-ratio: 2;
      @include Ui9BoxWidth(15%);
      @include Ui9BoxLeft('/static/ui/scroll/scroll_left.webp');
      @include Ui9BoxCenter('/static/ui/scroll/scroll_center.webp');
      @include Ui9BoxRight('/static/ui/scroll/scroll_right.webp');
      pointer-events: none;
      @include UiDropShadow(1);
    }

    &__title {
      position: relative;
      @include UiTextShadow(3);
      white-space: nowrap;
    }
  }
</style>
