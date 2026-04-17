<template>
  <Transition
    mode="out-in"
    name="fade-transition"
    :style="{ transitionDuration: `${duration}ms` }"
    :duration="duration"
  >
    <slot></slot>
  </Transition>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class FadeTransition extends Vue {
    @Prop({ default: 300 })
    public duration: number;
  }
</script>

<style scoped lang="scss">
  .fade-transition {
    &-enter-active,
    &-leave-active {
      transition-property: opacity;
      transition-timing-function: ease;
    }

    &-enter-to,
    &-leave-from {
      opacity: 1;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
  }
</style>
