<template>
  <div class="results-card ui-overlay">
    <div class="results-card__container ui-container">
      <ActionCard :heading="heading" class="results-card__card">
        <div class="results-card__content">
          <slot></slot>
        </div>
      </ActionCard>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import ActionCard from '@/app/components/ActionCard.vue';

  @Component({
    components: {
      ActionCard,
    },
    emits: ['transitionEnd'],
  })
  export default class ResultsCard extends Vue {
    @Prop({ required: true })
    public heading: string;

    public mounted(): void {
      setTimeout(() => this.$emit('transitionEnd'), 4000);
    }
  }
</script>

<style scoped lang="scss">
  .results-card {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    animation-name: UiAnimationFadeIn;
    animation-duration: 500ms;
    animation-timing-function: linear;
    animation-delay: 3s;
    animation-fill-mode: both;

    &__container {
      display: flex;
      align-items: center;
      justify-content: center;
      animation-name: UiAnimationScaleIn;
      animation-timing-function: UiTransition(spring);
      animation-duration: 1000ms;
      animation-delay: 3s;
      animation-fill-mode: both;
    }

    &__card {
      height: 95%;
      width: 95%;
      @include UiMediaLandscape() {
        max-width: UiSpacing(80);
      }
    }

    &__content {
      @include UiPadding(10, top);
      height: 100%;
    }
  }
</style>
