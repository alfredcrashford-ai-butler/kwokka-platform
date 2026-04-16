<template>
  <div class="kwokka-avatar-image" @click="$emit('click', $event)">
    <div class="kwokka-avatar-image__border">
      <div class="kwokka-avatar-image__border-inner"></div>
    </div>
    <div class="kwokka-avatar-image__image" v-if="imageKey">
      <img class="kwokka-avatar-image__image-img" ref="image" />
    </div>
    <div class="kwokka-avatar-image__empty kwokka-avatar-block" v-styles="styles?.emptyImage" v-else></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { KwokkaAvatarImageStyles } from '@/styles/kwokka-avatar-styles';
  import { fetchImage } from '@/util';

  @Component({
    directives: { styles: stylesDirective },
    emits: ['click', 'ready'],
  })
  export default class KwokkaSimpleAvatarImage extends Vue {
    @Ref()
    public image: HTMLImageElement;

    @Prop()
    public styles: KwokkaAvatarImageStyles;

    @Prop({ default: '/assets/decorations' })
    public decorationsSrc: string;

    @Prop({ default: null })
    public imageKey!: string;

    @Watch('imageKey', { immediate: true })
    public async onBackgroundKeyChange(key: string) {
      if (!key) {
        this.$emit('ready');
        return;
      }

      const src = await fetchImage(`${this.decorationsSrc}/image/${key}.webp`);
      if (src) {
        this.image.src = src;
      }

      await new Promise((resolve) => (this.image.onload = resolve));

      this.$emit('ready');
    }
  }
</script>

<style>
  .kwokka-avatar-image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100%;
    max-width: 100%;
    height: 100%;
    width: 100%;
    aspect-ratio: 1;
    flex-shrink: 0;
    box-shadow: 0 0 0.4cqh 0.15cqh rgba(0, 0, 0, 0.5);
    margin-right: 5%;
    border-radius: 100%;
  }

  .kwokka-avatar-image__image {
    position: absolute;
    width: 80%;
    height: 80%;
    border-radius: 100%;
    box-shadow: inset 0 0 0.4cqh 0.15cqh rgba(0, 0, 0, 0.5);
  }

  .kwokka-avatar-image__image-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    pointer-events: none;
  }

  .kwokka-avatar-image__empty {
    position: absolute;
    top: 0;
    left: 0;
    --kwk-avatar--width: 100%;
    --kwk-avatar--height: 100%;
    --kwk-avatar--border-radius: 100%;
    --kwk-avatar--background-color: rgba(255, 255, 255, 0.25);
    --kwk-avatar--box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
  }

  .kwokka-avatar-image__border {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(#ffffff50, #00000050);
    border-radius: 100%;
    backdrop-filter: blur(2cqh);
  }

  .kwokka-avatar-image__border-inner {
    position: absolute;
    width: 90%;
    height: 90%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: linear-gradient(#00000050, #ffffff50);
    border-radius: 100%;
  }
</style>
