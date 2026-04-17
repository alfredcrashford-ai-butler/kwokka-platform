<template>
  <div class="interaction-renderer" :inert="!isInteractionShown">
    <!-- <HydrantInteraction
      :interactionDuration="gameInstance.lobbySettings.hydrantMaxDuration"
      :cardId="interactionCardId"
      :isShown="isHydrantInteractionShown"
      @interact="$emit('interact', $event)"
    /> -->
    <!-- <SoundboardInteraction
      :cardId="interactionCardId"
      :isShown="isSoundboardInteractionShown"
      @interact="$emit('interact', $event)"
    /> -->
    <BallOfFortuneInteraction
      :cardId="interactionCardId"
      :gameInstance="gameInstance"
      :isShown="isBallOfFortuneShown"
      @interact="$emit('interact', $event)"
    />

    <div class="interaction-renderer__timer" :class="{ 'interaction-renderer__timer_is-hidden': !isTimerShown }">
      <div class="interaction-renderer__timer-bar" :style="{ '--pwsm--interaction-timer-scale': timerScale }"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
  import { FunctionUtil } from '@kwokka/utils';
  import HydrantInteraction from './standard/HydrantInteraction.vue';
  import SoundboardInteraction from './standard/SoundboardInteraction.vue';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import { CardId } from '@/game-data/card';
  import BallOfFortuneInteraction from './standard/BallOfFortuneInteraction.vue';
  import { TimerUtil } from '@/util';

  @Component({
    components: {
      HydrantInteraction,
      SoundboardInteraction,
      BallOfFortuneInteraction,
    },
    emits: ['interact', 'open', 'close'],
  })
  export default class InteractionRenderer extends Vue {
    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public playerId: string;

    @Prop({ required: true })
    public turnDuration: number;

    public totalTimeMs: number = null;
    public timeLeftMs: number = null;
    public onTimerTick: (timePassed: number, timeLeft: number) => any = null;
    private cleanupTimer: () => any = null;

    public created(): void {
      this.onTimerTick = FunctionUtil.throttle((timePassed: number, timeLeft: number) => {
        this.totalTimeMs ??= timeLeft;
        this.timeLeftMs = timeLeft;
      }, 100);
    }

    public beforeDestroy(): void {
      this.cleanupTimer?.();
    }

    public get timerScale(): number {
      return !this.totalTimeMs ? 1 : this.timeLeftMs / this.totalTimeMs;
    }

    public get interactionCardId(): CardId {
      return this.gameInstance.state.publicState?.interaction?.cardId;
    }

    public get interactionState(): any {
      return this.gameInstance.state.publicState?.interaction?.state;
    }

    public get isTimerShown(): boolean {
      if (this.totalTimeMs === null) {
        return false;
      }

      return this.isInteractionShown;
    }

    public get isInteractionShown(): boolean {
      return this.isHydrantInteractionShown || this.isSoundboardInteractionShown || this.isBallOfFortuneShown;
    }

    public get isHydrantInteractionShown(): boolean {
      const hasUserInteracted = Boolean(this.interactionState?.[this.playerId]);
      const isHydrant = this.gameInstance.isHydrantInteraction();
      return !hasUserInteracted && isHydrant;
    }

    public get isSoundboardInteractionShown(): boolean {
      const hasUserInteracted = Boolean(this.interactionState?.[this.playerId]);
      const isSoundboard = this.gameInstance.isSoundboardInteraction();
      return !hasUserInteracted && isSoundboard;
    }

    public get isBallOfFortuneShown(): boolean {
      const isPlayer = this.interactionState?.playerId === this.playerId;
      const isBallOfFortune = this.gameInstance.isBallOfFortuneInteraction();
      return isPlayer && isBallOfFortune;
    }

    public onTimerEnd = () => {
      this.totalTimeMs = null;
    };

    @Watch('gameInstance.state.publicState.interaction.cardId')
    public handleInteractionChange(newCardId: string, oldCardId: string): void {
      if (newCardId && newCardId !== oldCardId) {
        this.cleanupTimer?.();
        this.cleanupTimer = TimerUtil.startTimer(this.turnDuration, this.onTimerEnd, this.onTimerTick);
      }
    }

    @Watch('isInteractionShown')
    public onShownChange(isShown: boolean): void {
      this.$emit(isShown ? 'open' : 'close');
    }
  }
</script>

<style lang="scss" scoped>
  .interaction-renderer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &__timer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      pointer-events: none;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      @include UiGap(1);
      align-items: center;

      &_is-hidden {
        opacity: 0;
      }
    }

    &__timer-num {
      @include UiTextShadow(1);
    }

    &__timer-bar {
      width: 100%;
      height: UiSpacing(1);
      background-color: UiColor(shade-100, 0.5);
      transform: scaleX(var(--pwsm--interaction-timer-scale));
      transition: transform linear 100ms;
      transform-origin: left;
    }
  }
</style>
