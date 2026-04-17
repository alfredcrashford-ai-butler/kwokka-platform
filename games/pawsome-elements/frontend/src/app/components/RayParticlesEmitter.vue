<template>
  <div class="ray-particles-emitter" :style="{ '--pwsm--ray-particles-emitter--dir': dir }">
    <div
      class="ray-particles-emitter__item"
      :style="{
        '--pwsm--ray-particles-emitter--i': i,
        '--pwsm--ray-particles-emitter--num': num,
        '--pwsm--ray-particles-emitter--start-radius': startRadius,
        '--pwsm--ray-particles-emitter--end-radius': endRadius,
        '--pwsm--ray-particles-emitter--duration': duration,
        '--pwsm--ray-particles-emitter--random': random1,
        '--pwsm--ray-particles-emitter--angle': angle * random2 - angle / 2,
      }"
      v-for="([random1, random2], i) in items"
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
  export default class RayParticlesEmitter extends Vue {
    @Prop({ required: true })
    public num: number;

    @Prop({ default: '1s' })
    public duration: string;

    @Prop({ default: 0 })
    public angle: number;

    @Prop({ default: 0 })
    public dir: number;

    @Prop({ default: 0 })
    public startRadius: number;

    @Prop({ default: 10 })
    public endRadius: number;

    public get items(): [number, number][] {
      return Array(this.num)
        .fill(null)
        .map(() => [RandomUtil.randomInRange(0, 1), RandomUtil.randomInRange(0, 1)]);
    }
  }
</script>

<style scoped lang="scss">
  .ray-particles-emitter {
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 50%;
    $dir: calc(var(--pwsm--ray-particles-emitter--dir) * 1deg);
    transform: translate3d(0, 0, 0) translate(-50%, -50%) rotateZ($dir);
    animation-iteration-count: infinite;
    transition: opacity linear 300ms;

    &__item {
      position: absolute;
      will-change: opacity, transform;

      @keyframes PwsmRayParticlesEmitterOpacity {
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

      @keyframes PwsmRayParticlesEmitterTrajectory {
        $rotate: calc(var(--pwsm--ray-particles-emitter--angle) * 1deg);
        0% {
          $translate: calc(-1 * var(--pwsm--ray-particles-emitter--start-radius) * min(1cqh, 1cqw));
          transform: translate3d(0, 0, 0) translate(-50%, -50%) rotateZ($rotate) translateY($translate);
        }
        100% {
          $translate: calc(-1 * var(--pwsm--ray-particles-emitter--end-radius) * min(1cqh, 1cqw));
          transform: translate3d(0, 0, 0) translate(-50%, -50%) rotateZ($rotate) translateY($translate);
        }
      }

      animation-name: PwsmRayParticlesEmitterOpacity, PwsmRayParticlesEmitterTrajectory;
      animation-iteration-count: inherit;
      animation-delay: calc(
        -1 * var(--pwsm--ray-particles-emitter--duration) * var(--pwsm--ray-particles-emitter--random)
      );
      animation-duration: var(--pwsm--ray-particles-emitter--duration);
      animation-fill-mode: both;
    }
  }
</style>
