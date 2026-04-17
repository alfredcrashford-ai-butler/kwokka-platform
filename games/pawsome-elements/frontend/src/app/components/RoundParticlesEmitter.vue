<template>
  <div class="round-particles-emitter">
    <div
      class="round-particles-emitter__item"
      :style="{
        '--pwsm--round-particles-emitter--i': i,
        '--pwsm--round-particles-emitter--num': num,
        '--pwsm--round-particles-emitter--start-radius': startRadius,
        '--pwsm--round-particles-emitter--end-radius': endRadius,
        '--pwsm--round-particles-emitter--duration': duration,
        '--pwsm--round-particles-emitter--random': random,
        '--pwsm--round-particles-emitter--spin': spin,
      }"
      v-for="(random, i) in items"
      :key="i"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { RandomUtil } from '@kwokka/utils';
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class RoundParticlesEmitter extends Vue {
    @Prop({ required: true })
    public num: number;

    @Prop({ default: '1s' })
    public duration: string;

    @Prop({ default: 0 })
    public startRadius: number;

    @Prop({ default: 10 })
    public endRadius: number;

    @Prop({ default: 0 })
    public spin: number;

    public get items(): number[] {
      return Array(this.num)
        .fill(null)
        .map(() => RandomUtil.randomInRange(0, 1));
    }
  }
</script>

<style scoped lang="scss">
  .round-particles-emitter {
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(0, 0, 0) translate(-50%, -50%);

    &__item {
      position: absolute;
      will-change: opacity, transform;

      @keyframes PwsmRoundParticlesEmitterOpacity {
        0% {
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes PwsmRoundParticlesEmitterTrajectory {
        $rotate-from: calc(
          (var(--pwsm--round-particles-emitter--i) / var(--pwsm--round-particles-emitter--num)) * 360deg
        );
        $rotate-to: calc(
          (var(--pwsm--round-particles-emitter--i) / var(--pwsm--round-particles-emitter--num)) * 360deg +
            var(--pwsm--round-particles-emitter--spin) * 1deg
        );
        0% {
          $translate: calc(-1 * var(--pwsm--round-particles-emitter--start-radius) * min(1cqh, 1cqw));
          transform: translate3d(0, 0, 0) translate(-50%, -50%) rotateZ($rotate-from) translateY($translate);
        }
        50% {
          $translate: calc(-1 * var(--pwsm--round-particles-emitter--end-radius) * min(1cqh, 1cqw));
          transform: translate3d(0, 0, 0) translate(-50%, -50%) rotateZ($rotate-to) translateY($translate);
        }

        100% {
          $translate: calc(-1 * var(--pwsm--round-particles-emitter--end-radius) * min(1cqh, 1cqw));
          transform: translate3d(0, 0, 0) translate(-50%, -50%) rotateZ($rotate-to) translateY($translate);
        }
      }

      animation-name: PwsmRoundParticlesEmitterOpacity, PwsmRoundParticlesEmitterTrajectory;
      animation-iteration-count: infinite;
      animation-delay: calc(
        -1 * var(--pwsm--round-particles-emitter--duration) * var(--pwsm--round-particles-emitter--random)
      );
      animation-duration: var(--pwsm--round-particles-emitter--duration);
    }
  }
</style>
