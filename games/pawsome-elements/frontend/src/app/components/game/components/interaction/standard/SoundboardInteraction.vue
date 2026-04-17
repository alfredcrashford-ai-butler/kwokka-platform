<template>
  <Interaction
    :isShown="isShown"
    :style="{
      '--pwsm--animation-duration': `${animationDuration}ms`,
    }"
  >
    <div class="soundboard-interaction">
      <div class="soundboard-interaction__board-outer-container" v-if="isShown">
        <div class="soundboard-interaction__board-container">
          <div class="soundboard-interaction__board">
            <div class="soundboard-interaction__button-container" v-for="button in buttons" :key="button.id">
              <button
                class="soundboard-interaction__button"
                :style="{
                  '--pwsm--button-color': button.color,
                }"
                :disabled="button.isSelected"
                @pointerdown="onButtonClick(button)"
              >
                <span class="soundboard-interaction__button-text">{{ button.order }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="soundboard-interaction__board-container-back"></div>
      </div>

      <Suggestion class="soundboard-interaction__suggestion">
        {{ $t(`card.${cardId}.suggestion`) }}
      </Suggestion>
    </div>
  </Interaction>
</template>

<script lang="ts">
  import { ArrayUtil, UuidUtil } from '@kwokka/utils';
  import { Component, Prop, Watch, Vue } from 'vue-facing-decorator';
  import { SoundService } from '@/service';
  import { LazyInject } from '@/ioc';
  import type { CardId } from '@/game-data/card';
  import Interaction from '../Interaction.vue';
  import Suggestion from '../../Suggestion.vue';

  interface SoundboardButtonConfig {
    color: string;
    id: string;
  }

  interface SoundboardButton extends SoundboardButtonConfig {
    order: number;
    isSelected: boolean;
  }

  @Component({
    components: {
      Interaction,
      Suggestion,
    },
    emits: ['interact'],
  })
  export default class SoundboardInteraction extends Vue {
    public static buttonsSet: SoundboardButtonConfig[] = [
      { color: '#DB2B39', id: UuidUtil.generate(8) },
      { color: '#7DCD85', id: UuidUtil.generate(8) },
      { color: '#279AF1', id: UuidUtil.generate(8) },
      { color: '#F3A712', id: UuidUtil.generate(8) },
    ];

    @Prop({ required: true })
    public isShown: boolean;

    @Prop({ required: true })
    public cardId: CardId;

    @LazyInject(SoundService)
    public soundService: SoundService;

    public readonly animationDuration = 500;
    public buttons: SoundboardButton[] = [];

    public get areAllButtonsSelected(): boolean {
      return !this.buttons.find((el) => !el.isSelected);
    }

    public mounted(): void {
      if (this.isShown) {
        this.showButtons();
      }
    }

    @Watch('isShown')
    public onIsShownChange(isShown: boolean) {
      if (isShown) {
        this.soundService.playMagicOverlay();
        this.showButtons();
      } else {
        this.hideButtons();
      }
    }

    public showButtons(): void {
      this.generateButtons();
    }

    public hideButtons(): void {
      this.buttons = [];
    }

    public onButtonClick(button: SoundboardButton): void {
      const nextOrder = this.getOrderOfButtonToClick();
      if (nextOrder === button.order) {
        // eslint-disable-next-line no-param-reassign
        button.isSelected = true;
        this.soundService.playUiSelect();
        if (this.areAllButtonsSelected) {
          this.$emit('interact', null);
        }
      } else {
        this.soundService.playUiFail();
      }
    }

    public getOrderOfButtonToClick(): number {
      const lastSelectedButton = this.buttons.reduce(
        (max, button) => (button.order > max && button.isSelected ? button.order : max),
        0,
      );
      return lastSelectedButton + 1;
    }

    private generateButtons(): void {
      const buttonsSetCopy = [...SoundboardInteraction.buttonsSet];
      const buttons = buttonsSetCopy.map((button: SoundboardButtonConfig, i: number) => ({
        ...button,
        order: i + 1,
        isSelected: false,
      }));
      this.buttons = ArrayUtil.shuffle(buttons);
    }
  }
</script>

<style scoped lang="scss">
  .soundboard-interaction {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    position: relative;
    perspective: 20cm;

    &__board-outer-container {
      width: 100%;
      height: fit-content;
      position: relative;
      transform-style: preserve-3d;

      @include UiInlineAnimation(1000ms) {
        from {
          transform: scale(3) rotateX(-270deg);
        }
        to {
          transform: scale(1) rotateX(0deg);
        }
      }

      animation-timing-function: UiTransition(bounce);
      animation-fill-mode: both;
    }

    &__board-container-back {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      transform: rotateX(180deg);
    }

    &__board-container,
    &__board-container-back {
      width: 100%;
      background-image: url('/static/elements/soundboard_board.webp');
      background-color: rgba(0, 0, 0, 0.5);
      background-size: cover;
      background-position: center;
      background-blend-mode: luminosity;
      @include UiBorderRadius(4);
      border: 4px solid rgba(0, 0, 0, 0.75);
      backface-visibility: hidden;
    }

    &__board-container {
      position: relative;
      @include UiPadding(10);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__board {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      width: 100%;
      max-width: UiSpacing(75);
      @include UiGap(10);
    }

    &__button {
      position: relative;
      @include UiButtonAppearance();
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-image:
        url('/static/elements/soundboard_button.webp'), radial-gradient(var(--pwsm--button-color) 0, transparent 300%);
      background-position: center;
      background-size:
        calc(100% + 4px) calc(100% + 4px),
        contain;
      background-repeat: no-repeat;
      background-blend-mode: luminosity;

      transition: opacity ease-in-out 100ms;

      &::before {
        $offset: 4%;
        content: '';
        position: absolute;
        width: calc(100% + #{$offset * 2});
        height: calc(100% + #{$offset * 2});
        background-image: url('/static/elements/soundboard_button_border.webp');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        left: -$offset;
        top: -$offset;
        pointer-events: none;
        z-index: 1;
      }
    }

    &__button-container {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;

      @include UiInlineAnimation() {
        from: {
          opacity: 0;
          transform: scale(0.5);
        }
        to: {
          opacity: 1;
          transform: scale(1);
        }
      }
      animation-duration: var(--pwsm--animation-duration);
      animation-delay: 200ms;
      animation-fill-mode: both;
      animation-timing-function: UiTransition(bounce);
    }

    &__button-text {
      opacity: 0.75;
      line-height: 100%;
      font-size: 75px;
    }

    &__suggestion {
      position: absolute;
      top: UiSpacing(4);
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
