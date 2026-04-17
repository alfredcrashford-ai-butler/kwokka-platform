<template>
  <hr
    class="ui-divider"
    :class="{
      'ui-divider_dir-horizontal': direction === 'horizontal',
      'ui-divider_dir-vertical': direction === 'vertical',
    }"
  />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class UiDivider extends Vue {
    @Prop({ default: 'horizontal' })
    public direction: 'horizontal' | 'vertical';
  }
</script>

<style scoped lang="scss">
  .ui-divider {
    position: relative;
    container-type: size;
    flex-shrink: 0;
    top: 0;
    left: 0;

    &_dir-horizontal {
      height: UiSpacing(2);
      width: 100%;

      &::before {
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
      }
    }

    &_dir-vertical {
      width: UiSpacing(2);
      height: 100%;

      &::before {
        width: 100cqh;
        height: UiSpacing(2);
        transform: translate(-50%, -50%) rotate(90deg);
      }
    }

    &::before {
      content: '';
      position: absolute;
      background-image: url('/static/ui/card_1/card_divider.webp');
      background-size: 100% 100%;
      top: 50%;
      left: 50%;
    }
  }
</style>
