<template>
  <component :is="tag" class="essence">
    <div class="essence__glowing" v-if="isGlowing"></div>
    <div class="essence__img"></div>
  </component>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class Essence extends Vue {
    @Prop({ default: false })
    public isGlowing: boolean;

    @Prop({ default: 'div' })
    public tag: string;
  }
</script>

<style scoped lang="scss">
  .essence {
    position: relative;
    aspect-ratio: 1;

    &__img {
      position: absolute;
      left: -30%;
      top: -30%;
      aspect-ratio: 1;
      width: 160%;
      height: 160%;
      background-image: url('/static/essence_sm.webp');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      pointer-events: none;
    }

    &__glowing {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 20%;
      height: 20%;
      border-radius: 50%;
      background-color: UiColor(shade-100);
      box-shadow: 0 0 UiSpacing(2) UiSpacing(2) UiColor(shade-100);
      @include UiInlineAnimation(3s) {
        0% {
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          transform: translate(-50%, -50%) scale(1.5);
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
        }
      }
      animation-iteration-count: infinite;
    }
  }
</style>
