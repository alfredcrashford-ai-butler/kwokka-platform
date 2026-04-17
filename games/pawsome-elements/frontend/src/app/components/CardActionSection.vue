<template>
  <div class="card-action-section">
    <div class="card-action-section__button-decoration card-action-section__button-decoration_inverse"></div>
    <CaptionPanel class="card-action-section__button-panel">
      <UiTooltip v-if="buttonTooltip" :message="buttonTooltip">
        <UiButton width="block" :disabled="buttonDisabled" @click="$emit('buttonClick', $event)">
          {{ buttonText }}
        </UiButton>
      </UiTooltip>
      <UiButton v-else width="block" :disabled="buttonDisabled" @click="$emit('buttonClick', $event)">
        {{ buttonText }}
      </UiButton>
    </CaptionPanel>
    <div class="card-action-section__button-decoration"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UiTooltip, UiButton } from '@/app/ui-kit';
  import CaptionPanel from './CaptionPanel.vue';

  @Component({
    emits: ['buttonClick'],
    components: {
      UiButton,
      UiTooltip,
      CaptionPanel,
    },
  })
  export default class CardActionSection extends Vue {
    @Prop({ required: true })
    public buttonText: string;

    @Prop({ default: false })
    public buttonDisabled: boolean;

    @Prop({ default: null })
    public buttonTooltip: string;
  }
</script>

<style scoped lang="scss">
  .card-action-section {
    display: flex;
    width: 100%;
    flex-shrink: 0;

    &__button-decoration {
      position: relative;
      max-width: UiSpacing(14);
      width: 100%;

      &_inverse {
        transform: rotateY(180deg);
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        aspect-ratio: 1;
        background-image: url('/static/ui/card_1/card_decoration.webp');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
    }

    &__button-panel {
      flex-grow: 1;
      width: 100%;
      background-color: UiColor(secondary-900);
      border-radius: UiSpacing(1) UiSpacing(1) 0 0;
    }
  }
</style>
