<template>
  <FadeTransition>
    <div class="pause-renderer" v-if="isShown">
      <h3 class="pause-renderer__title">{{ $t('game.pause.title') }}</h3>
      <p class="pause-renderer__caption">{{ $t(`game.pause.reason.${pauseReason}`) }}</p>
    </div>
  </FadeTransition>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance/pwsm-game-instance.entity';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';

  @Component({
    components: {
      FadeTransition,
    },
    emits: ['open', 'close'],
  })
  export default class PauseRenderer extends Vue {
    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    public get isShown(): boolean {
      return this.gameInstance.isPaused;
    }

    public get pauseReason(): string {
      return this.gameInstance.state.publicState.pause.reason || 'unknown';
    }

    @Watch('isShown')
    public onShownChange(isShown: boolean): void {
      this.$emit(isShown ? 'open' : 'close');
    }
  }
</script>

<style scoped lang="scss">
  .pause-renderer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    @include UiGap(10);
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(UiSpacing(1));

    &__title {
      @include UiTypographyHeading1();
    }

    &__caption {
      @include UiTypographyHeading5();
    }
  }
</style>
