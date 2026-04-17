<template>
  <div class="action-card-content">
    <div class="action-card-content__card-set">
      <UiResponsiveImage class="action-card-content__image" src="/static/card_set/standard.webp" mode="cover" />
      <div class="action-card-content__card-set-name-container">
        <UiArrowButton direction="left" size="sm" disabled />
        <h4 class="action-card-content__card-set-name">{{ heading }}</h4>
        <UiArrowButton direction="right" size="sm" disabled />
      </div>
    </div>
    <UiDivider />
    <div class="action-card-content__container">
      <div class="action-card-content__content">
        <slot></slot>
      </div>
      <CardActionSection
        class="action-card-content__action-section"
        :buttonText="buttonText"
        :buttonDisabled="buttonDisabled"
        @buttonClick="$emit('submitClick', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { CardActionSection } from '@/app/components';
  import { UiResponsiveImage, UiCircleButton, UiArrowButton, UiDivider } from '@/app/ui-kit';

  @Component({
    components: {
      UiResponsiveImage,
      UiCircleButton,
      UiArrowButton,
      UiDivider,
      CardActionSection,
    },
    emits: ['submitClick'],
  })
  export default class ActionCardContent extends Vue {
    @Prop({ required: true })
    public heading: string;

    @Prop({ required: true })
    public buttonText: string;

    @Prop({ default: false })
    public buttonDisabled: boolean;
  }
</script>

<style scoped lang="scss">
  .action-card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    --action-card-divider-size: #{UiSpacing(2)};

    &__card-set {
      position: relative;
      flex-basis: calc((100% - var(--action-card-divider-size)) / 2);
      z-index: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }

    &__card-set-name-container {
      display: flex;
      align-items: center;
      justify-content: center;
      @include UiGap(4);
      @include UiPadding(2, bottom);
    }

    &__card-set-name {
      @include UiTextShadow(3);
      text-align: center;
    }

    &__image {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
      pointer-events: none;
    }

    &__back-button {
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

    &__container {
      flex-basis: calc((100% - var(--action-card-divider-size)) / 2);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__content {
      flex-grow: 1;
    }

    &__action-section {
      flex-shrink: 0;
    }
  }
</style>
