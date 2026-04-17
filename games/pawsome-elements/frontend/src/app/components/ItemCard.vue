<template>
  <div
    class="item-card"
    tabindex="0"
    @click="$emit('click', $event)"
    @keypress.enter="$emit('click', $event)"
    @keypress.space="$emit('click', $event)"
  >
    <div class="item-card__inner ui-9-box">
      <h3 class="item-card__heading">
        <DynamicFontSize :minScale="0.5" :maxScale="1" :minContentLength="4" :maxContentLength="24" :text="heading" />
      </h3>

      <div class="item-card__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import DynamicFontSize from '@/app/components/DynamicFontSize.vue';
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component({
    emits: ['click'],
    components: {
      DynamicFontSize,
    },
  })
  export default class ItemCard extends Vue {
    @Prop({ required: true })
    public heading: string;

    @Prop({ default: false })
    public disabled: boolean;
  }
</script>

<style scoped lang="scss">
  .item-card {
    container-type: size;
    @include UiButtonAppearance();

    &__inner {
      --heading-size: #{UiSpacing(10)};
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      @include UiDropShadow(2);
      @include UiGap(2);
      @include UiPadding(3, left);
      @include UiPadding(3, right);
      @include UiPadding(3, bottom);
      @include Ui9BoxWidth(var(--heading-size));
      @include Ui9BoxHeight(var(--heading-size));
      @include Ui9BoxTopLeft('/static/ui/card_2/card_2_top_left.webp');
      @include Ui9BoxTop('/static/ui/card_2/card_2_top.webp');
      @include Ui9BoxTopRight('/static/ui/card_2/card_2_top_right.webp');
      @include Ui9BoxLeft('/static/ui/card_2/card_2_left.webp');
      @include Ui9BoxCenter('/static/ui/card_2/card_2_center.webp');
      @include Ui9BoxRight('/static/ui/card_2/card_2_right.webp');
      @include Ui9BoxBottomLeft('/static/ui/card_2/card_2_bottom_left.webp');
      @include Ui9BoxBottom('/static/ui/card_2/card_2_bottom.webp');
      @include Ui9BoxBottomRight('/static/ui/card_2/card_2_bottom_right.webp');
      @include UiDropShadow(2);
    }

    &__heading {
      @include UiTextShadow(3);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--heading-size);
      flex-shrink: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__content {
      flex-shrink: 0;
      width: 100%;
      flex-grow: 1;
    }
  }
</style>
