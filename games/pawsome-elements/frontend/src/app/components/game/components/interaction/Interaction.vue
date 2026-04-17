<template>
  <div class="interaction" :class="{ 'interaction_is-shown': isShown }">
    <transition :duration="500">
      <div class="interaction__content" v-if="isShown">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class Interaction extends Vue {
    @Prop({ required: true })
    public isShown: boolean;
  }
</script>

<style scoped lang="scss">
  .interaction {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    opacity: 0;
    pointer-events: none;
    visibility: hidden;

    transition-property: opacity, visibility;
    transition-duration: 200ms;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(6px);
      transform: translate3d(0, 0, 0);
    }

    &_is-shown {
      opacity: 1;
      pointer-events: initial;
      visibility: visible;
    }

    &__content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
</style>
