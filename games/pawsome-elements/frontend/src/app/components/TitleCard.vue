<template>
  <div class="title-card">
    <div class="title-card__title-panel ui-9-box">
      <h1 class="title-card__title">{{ heading }}</h1>
    </div>
    <div class="title-card__container">
      <div class="title-card__back-button" v-if="isBackButtonShown">
        <UiCircleButton icon="arrow-left" @click="$emit('backClick', $event)" />
      </div>

      <div class="title-card__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiCircleButton from '@/app/ui-kit/UiCircleButton.vue';

  @Component({
    emits: ['backClick'],
    components: {
      UiCircleButton,
    },
  })
  export default class TitleCard extends Vue {
    @Prop()
    public heading: string;

    @Prop({ default: true })
    public isBackButtonShown: boolean;
  }
</script>

<style scoped lang="scss">
  .title-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    container-type: size;
    $title-panel-height: #{UiSpacing(10)};

    &__container {
      position: relative;
      background-image: url('/static/ui/bricks.webp');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      flex-grow: 1;
      width: 100%;
      height: calc(100% - #{$title-panel-height});
      @include UiBoxShadow(2);
      @include UiBorderRadius(5);

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

    &__content {
      width: 100%;
      height: 100%;
      @include UiPadding(1.8);
    }

    &__back-button {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-25%, -25%);
      z-index: 1000;
    }

    &__title-panel {
      position: relative;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      @include Ui9BoxWidth(UiSpacing(8));
      @include Ui9BoxLeft('/static/ui/title_panel/title_panel_left.webp');
      @include Ui9BoxCenter('/static/ui/title_panel/title_panel_center.webp');
      @include Ui9BoxRight('/static/ui/title_panel/title_panel_right.webp');
      @include UiPadding(8, left);
      @include UiPadding(8, right);
      height: $title-panel-height;
      min-width: 50%;
    }

    &__title {
      @include UiTextShadow(3);
      white-space: nowrap;
    }
  }
</style>
