<template>
  <Interaction :isShown="isShown">
    <div
      class="hydrant-interaction"
      :class="{
        'hydrant-interaction_arcane': cardId === cardIds.ArcaneHydrant,
        'hydrant-interaction_filth': cardId === cardIds.FilthHydrant,
        'hydrant-interaction_nature': cardId === cardIds.NatureHydrant,
      }"
    >
      <div
        v-for="(bubble, i) in bubbles"
        :key="bubble.uuid"
        class="hydrant-interaction__bubble-container"
        :style="{
          animationDelay: `${bubble.appearDelay}ms`,
          left: `${bubble.x}px`,
          top: `${bubble.y}px`,
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
        }"
      >
        <div
          class="hydrant-interaction__bubble-floating-container"
          :style="{
            animationDuration: `${interactionDuration}ms`,
          }"
        >
          <transition leave-active-class="hydrant-interaction__bubble_leave">
            <div
              v-if="isShown && !bubble.isClicked"
              class="hydrant-interaction__bubble"
              :style="{
                pointerEvents: bubble.isClicked ? 'none' : undefined,
              }"
              role="button"
              @pointerdown="onBubbleClick(i)"
            ></div>
          </transition>
        </div>
      </div>

      <!-- TOP LEFT DECORATION BUBBLES -->

      <HydrantDecoBubble
        delay="0ms"
        :isShown="isShown"
        :scale="1"
        :size="bubbleSize"
        :style="{ left: '0', top: '0' }"
      />
      <HydrantDecoBubble
        delay="700ms"
        :isShown="isShown"
        :scale="0.6"
        :size="bubbleSize"
        :style="{ left: '8%', top: '-2%' }"
      />
      <HydrantDecoBubble
        delay="200ms"
        :isShown="isShown"
        :scale="0.3"
        :size="bubbleSize"
        :style="{ left: '8.5%', top: '9%' }"
      />
      <HydrantDecoBubble
        delay="500ms"
        :isShown="isShown"
        :scale="0.4"
        :size="bubbleSize"
        :style="{ left: '1%', top: '17%' }"
      />

      <!-- TOP RIGHT DECORATION BUBBLES -->
      <HydrantDecoBubble
        delay="300ms"
        :isShown="isShown"
        :scale="0.7"
        :size="bubbleSize"
        :style="{ right: '0', top: '0' }"
      />
      <HydrantDecoBubble
        delay="1000ms"
        :isShown="isShown"
        :scale="0.4"
        :size="bubbleSize"
        :style="{ right: '5%', top: '-1%' }"
      />
      <HydrantDecoBubble
        delay="500ms"
        :isShown="isShown"
        :scale="0.25"
        :size="bubbleSize"
        :style="{ right: '1%', top: '12%' }"
      />

      <!-- BOTTOM RIGHT DECORATION BUBBLES -->
      <HydrantDecoBubble
        delay="500ms"
        :isShown="isShown"
        :scale="1"
        :size="bubbleSize"
        :style="{ right: '0', bottom: '0' }"
      />
      <HydrantDecoBubble
        delay="1200ms"
        :isShown="isShown"
        :scale="0.6"
        :size="bubbleSize"
        :style="{ right: '8%', bottom: '-2%' }"
      />
      <HydrantDecoBubble
        delay="700ms"
        :isShown="isShown"
        :scale="0.3"
        :size="bubbleSize"
        :style="{ right: '8.5%', bottom: '9%' }"
      />
      <HydrantDecoBubble
        delay="1000ms"
        :isShown="isShown"
        :scale="0.4"
        :size="bubbleSize"
        :style="{ right: '1%', bottom: '17%' }"
      />
      <HydrantDecoBubble
        delay="900ms"
        :isShown="isShown"
        :scale="0.4"
        :size="bubbleSize"
        :style="{ right: '25%', bottom: '1%' }"
      />
      <HydrantDecoBubble
        delay="500ms"
        :isShown="isShown"
        :scale="0.25"
        :size="bubbleSize"
        :style="{ right: '22%', bottom: '0%' }"
      />
      <HydrantDecoBubble
        delay="1200ms"
        :isShown="isShown"
        :scale="0.2"
        :size="bubbleSize"
        :style="{ right: '29%', bottom: '0%' }"
      />

      <!-- BOTTOM LEFT DECORATION BUBBLES -->
      <HydrantDecoBubble
        delay="1000ms"
        :isShown="isShown"
        :scale="0.7"
        :size="bubbleSize"
        :style="{ left: '0', bottom: '0' }"
      />
      <HydrantDecoBubble
        delay="1700ms"
        :isShown="isShown"
        :scale="0.4"
        :size="bubbleSize"
        :style="{ left: '5%', bottom: '-1%' }"
      />
      <HydrantDecoBubble
        delay="1200ms"
        :isShown="isShown"
        :scale="0.25"
        :size="bubbleSize"
        :style="{ left: '1%', bottom: '12%' }"
      />
      <HydrantDecoBubble
        delay="700ms"
        :isShown="isShown"
        :scale="0.4"
        :size="bubbleSize"
        :style="{ left: '25%', bottom: '1%' }"
      />
      <HydrantDecoBubble
        delay="400ms"
        :isShown="isShown"
        :scale="0.25"
        :size="bubbleSize"
        :style="{ left: '22%', bottom: '0%' }"
      />
      <HydrantDecoBubble
        delay="200ms"
        :isShown="isShown"
        :scale="0.2"
        :size="bubbleSize"
        :style="{ left: '29%', bottom: '0%' }"
      />

      <Suggestion class="hydrant-interaction__suggestion">
        {{ $t(`card.${cardId}.suggestion`) }}
      </Suggestion>
    </div>
  </Interaction>
</template>

<script lang="ts">
  import { Component, Prop, Watch, Vue } from 'vue-facing-decorator';
  import { RandomUtil, UuidUtil } from '@kwokka/utils';
  import { CardId } from '@/game-data/card';
  import { LazyInject } from '@/ioc';
  import { SoundService } from '@/service';
  import Interaction from '../Interaction.vue';
  import HydrantDecoBubble from './HydrantDecoBubble.vue';
  import Suggestion from '../../Suggestion.vue';

  @Component({
    components: {
      Interaction,
      HydrantDecoBubble,
      Suggestion,
    },
    emits: ['interact'],
  })
  export default class HydrantInteraction extends Vue {
    public readonly bubbleCount = 5;
    public readonly bubblePaddingScreenMultiplierX = 0.1;
    public readonly bubblePaddingScreenMultiplierY = 0.3;
    public readonly bubbleSizeScreenMultiplier = 0.15;
    public readonly appearDelay = 50;
    public bubbles = [];
    public bubbleSize: number = 0;
    public readonly cardIds = CardId;

    @Prop({ required: true })
    public isShown: boolean;

    @Prop({ required: true })
    public interactionDuration: number;

    @Prop({ required: true })
    public cardId: CardId;

    @LazyInject(SoundService)
    public soundService: SoundService;

    public mounted(): void {
      if (this.isShown) {
        this.showBubbles();
      }
    }

    public get areAllBubblesClicked(): boolean {
      return this.bubbles.length > 0 && this.bubbles.every((el) => el.isClicked);
    }

    @Watch('isShown')
    public onIsShownChange(isShown: boolean) {
      if (isShown) {
        this.showBubbles();
      } else {
        this.hideBubbles();
      }
    }

    public showBubbles(): void {
      this.generateBubbles();
      this.soundService.playBubbles();
    }

    public hideBubbles(): void {
      this.bubbles = [];
    }

    public onBubbleClick(index: number): void {
      const bubble = this.bubbles[index];
      if (!bubble) {
        return;
      }

      bubble.isClicked = true;
      this.soundService.playBubblePop();

      if (this.areAllBubblesClicked) {
        this.$emit('interact', null);
      }
    }

    private generateBubbles(): void {
      const rect = this.$el.getBoundingClientRect();
      const screenSize = Math.min(rect.width, rect.height);
      const size = this.bubbleSizeScreenMultiplier * screenSize;
      this.bubbleSize = size;
      const paddingX = rect.width * this.bubblePaddingScreenMultiplierX;
      const paddingY = rect.height * this.bubblePaddingScreenMultiplierY;
      const bubbles = Array(this.bubbleCount)
        .fill({})
        .map((_, i) => ({
          uuid: UuidUtil.generate(6),
          isClicked: false,
          appearDelay: i * this.appearDelay,
          x: RandomUtil.randomInRange(paddingX, rect.width - paddingX - size),
          y: RandomUtil.randomInRange(paddingY, rect.height - paddingY - size),
        }));
      this.bubbles = bubbles;
    }
  }
</script>

<style scoped lang="scss">
  .hydrant-interaction {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(transparent 0, var(--pwsm--hydrant-button-color) 150%);

    &_arcane {
      --pwsm--hydrant-button-color: #{UiColor(element-arcane)};
    }

    &_nature {
      --pwsm--hydrant-button-color: #{UiColor(element-nature)};
    }

    &_filth {
      --pwsm--hydrant-button-color: #{UiColor(element-filth)};
    }

    &__bubble-container {
      position: absolute;
      animation-timing-function: UiTransition(bounce);
      animation-fill-mode: both;
      pointer-events: none;
      @include UiInlineAnimation(500ms) {
        0% {
          opacity: 0;
          transform: scale(0.5);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    }

    &__bubble-floating-container {
      animation-timing-function: ease-out;
      animation-fill-mode: both;
      width: 100%;
      height: 100%;
      @include UiInlineAnimation() {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-100%);
        }
      }
    }

    &__bubble {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      opacity: 0.6;
      cursor: pointer;
      background-image:
        url('/static/elements/bubble.webp'), radial-gradient(var(--pwsm--hydrant-button-color) 0, transparent 120%);
      background-position: center;
      background-size: cover;
      background-blend-mode: luminosity;
      pointer-events: all;

      &_leave {
        @include UiInlineAnimation(100ms) {
          from {
            opacity: 0.6;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(2.5);
          }
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
