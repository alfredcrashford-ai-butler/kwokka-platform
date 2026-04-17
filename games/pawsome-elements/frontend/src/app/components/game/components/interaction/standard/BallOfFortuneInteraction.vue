<template>
  <Interaction :isShown="isShown">
    <div class="ball-of-fortune-interaction">
      <div class="ball-of-fortune-interaction__background"></div>
      <div class="ball-of-fortune-interaction__circle-background"></div>
      <div class="ball-of-fortune-interaction__cards">
        <div
          class="ball-of-fortune-interaction__card ball-of-fortune-interaction__card_left"
          v-ui-sound
          @click="onCardClick(leftCard)"
        >
          <GameCard :data="leftCard" />
        </div>
        <div
          class="ball-of-fortune-interaction__card ball-of-fortune-interaction__card_right"
          v-ui-sound
          @click="onCardClick(rightCard)"
        >
          <GameCard :data="rightCard" />
        </div>
      </div>
      <Suggestion class="ball-of-fortune-interaction__suggestion">
        {{ $t('card.ball_of_fortune.suggestion') }}
      </Suggestion>
    </div>
  </Interaction>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
  import { SoundService } from '@/service';
  import { LazyInject } from '@/ioc';
  import type { PwsmGameInstanceEntity, SelectionInteractionState } from '@/game-data/game-instance';
  import type { CardState } from '@/game-data/card';
  import { GameCard } from '@/app/components/game-card';
  import Interaction from '../Interaction.vue';
  import Suggestion from '../../Suggestion.vue';

  @Component({
    components: {
      GameCard,
      Interaction,
      Suggestion,
    },
    emits: ['interact'],
  })
  export default class BallOfFortuneInteraction extends Vue {
    @Prop({ required: true })
    public isShown: boolean;

    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @LazyInject(SoundService)
    public soundService: SoundService;

    public get leftCard(): CardState {
      const state = this.gameInstance.state.publicState.interaction?.state as SelectionInteractionState;
      return state?.options?.[0];
    }

    public get rightCard(): CardState {
      const state = this.gameInstance.state.publicState.interaction?.state as SelectionInteractionState;
      return state?.options?.[1];
    }

    public onCardClick(card: CardState): void {
      this.$emit('interact', card.cardId);
    }

    @Watch('isShown')
    public onIsShownChange(isShown: boolean) {
      if (isShown) {
        this.soundService.playMagicOverlay();
      }
    }
  }
</script>

<style scoped lang="scss">
  .ball-of-fortune-interaction {
    height: 100%;
    width: 100%;
    @include UiPadding(4);

    &__background {
      position: absolute;
      top: 0;
      left: 0;
      background-image: radial-gradient(transparent 0, UiColor(purple-500) 150%);
      width: 100%;
      height: 100%;
    }

    &__circle-background {
      position: absolute;
      top: 0;
      left: 0;
      background-image: url('/static/elements/circle_bg.webp');
      background-position: center;
      background-size: cover;
      opacity: 0.5;
      width: 100%;
      height: 100%;
      @include UiInlineAnimation() {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(2);
        }
        100% {
          transform: scale(1);
        }
      }
      animation-duration: 40s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }

    &__cards {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      perspective: 20cm;
      animation-name: UiAnimationScaleIn, UiAnimationFadeIn;
      animation-duration: 1000ms, 300ms;
      animation-fill-mode: both;
      animation-timing-function: UiTransition(spring), linear;
    }

    &__card {
      @include UiButtonAppearance();
      aspect-ratio: 2 / 3;

      @include UiMediaMaxAspectRatio(3, 2) {
        width: 100%;
      }

      @include UiMediaMinAspectRatio(3, 2) {
        height: 100%;
      }

      &_left {
        transform: rotateX(3deg) rotateY(15deg) rotateZ(-8deg);

        @include UiMediaPortrait() {
          transform: translateY(-20%) rotateX(-11deg) rotateY(15deg) rotateZ(-4deg);
        }
      }

      &_right {
        transform: rotateX(-4deg) rotateY(-15deg) rotateZ(7deg);

        @include UiMediaPortrait() {
          transform: translateY(20%) rotateX(12deg) rotateY(-15deg) rotateZ(15deg);
        }
      }
    }

    &__suggestion {
      position: absolute;
      top: UiSpacing(4);
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
