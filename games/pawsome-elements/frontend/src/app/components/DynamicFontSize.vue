<template>
  <span class="dynamic-font-size">
    <span class="dynamic-font-size__container" :style="{ '--dynamic-font-size-scale': scale }" v-html="text"> </span>
  </span>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { NumberUtil } from '@kwokka/utils';

  @Component
  export default class DynamicFontSize extends Vue {
    @Prop({ required: true })
    public minScale: number;

    @Prop({ required: true })
    public maxScale: number;

    @Prop({ required: true })
    public minContentLength: number;

    @Prop({ required: true })
    public maxContentLength: number;

    @Prop({ required: true })
    public text: string;

    public get scale(): number {
      const clampedContentLength = NumberUtil.clamp(this.contentLength, +this.minContentLength, +this.maxContentLength);
      return NumberUtil.minmax(
        clampedContentLength,
        +this.minContentLength,
        +this.maxContentLength,
        +this.maxScale,
        +this.minScale,
      );
    }

    public get contentLength(): number {
      return this.text?.length || 0;
    }
  }
</script>

<style scoped lang="scss">
  .dynamic-font-size {
    font-size: inherit;
    line-height: 1;

    &__container {
      font-size: calc(1em * var(--dynamic-font-size-scale, 1));
    }
  }
</style>
