<template>
  <div class="kwokka-avatar kwokka-avatar-block" v-styles="styles?.avatar" @click="$emit('click', $event)">
    <div class="kwokka-avatar__background">
      <img class="kwokka-avatar__background-img" ref="backgroundImage" />
      <div
        class="kwokka-avatar__background-empty kwokka-avatar-block"
        v-styles="styles?.emptyBackground"
        v-if="!backgroundKey"
      ></div>
      <slot name="background"></slot>
    </div>
    <span class="kwokka-avatar__name kwokka-avatar-block" v-styles="styles?.avatarName">
      <DynamicFontSize
        class="kwokka-avatar__name-text"
        :minScale="0.6"
        :maxScale="1.2"
        :minContentLength="8"
        :maxContentLength="15"
        :text="name"
      />
    </span>
    <div class="kwokka-avatar__image-container">
      <KwokkaSimpleAvatarImage :decorationsSrc="decorationsSrc" :imageKey="imageKey" @ready="onImageReady()">
        <slot name="image"></slot>
      </KwokkaSimpleAvatarImage>
    </div>
    <div v-if="badgeKey" class="kwokka-avatar__badge">
      <img class="kwokka-avatar__badge-img" ref="badgeImage" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { FunctionUtil } from '@kwokka/utils';
  import DynamicFontSize from '@/components/DynamicFontSize.vue';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { KwokkaAvatarStyles } from '@/styles/kwokka-avatar-styles';
  import KwokkaSimpleAvatarImage from './KwokkaSimpleAvatarImage.vue';
  import { fetchImage } from '@/util';

  const READY_DEBOUNCE_MS = 100;

  @Component({
    components: { DynamicFontSize, KwokkaSimpleAvatarImage },
    directives: { styles: stylesDirective },
    emits: ['click', 'ready'],
  })
  export default class KwokkaSimpleAvatar extends Vue {
    private imageReadyPromiseResolve: () => any;
    private imageReadyPromise = new Promise<void>((resolve) => (this.imageReadyPromiseResolve = resolve));

    @Ref()
    public backgroundImage: HTMLImageElement;

    @Ref()
    public badgeImage: HTMLImageElement;

    @Prop()
    public styles: KwokkaAvatarStyles;

    @Prop({ default: '/assets/decorations' })
    public decorationsSrc: string;

    @Prop({ default: null })
    public name!: string;

    @Prop({ default: null })
    public imageKey!: string;

    @Prop({ default: null })
    public backgroundKey!: string;

    @Prop({ default: null })
    public badgeKey!: string;

    public created(): void {
      this.load = FunctionUtil.debounce(this.load.bind(this), READY_DEBOUNCE_MS);
    }

    public mounted(): void {
      this.load();
    }

    @Watch('backgroundKey')
    @Watch('badgeKey')
    public async onBackgroundKeyChange() {
      this.load();
    }

    public async load(): Promise< void> {
      const loadPromises = [];
      const fetchPromises = [];

      if (this.backgroundKey) {
        fetchPromises.push(this.fetchBackground());
        loadPromises.push(new Promise((resolve) => (this.backgroundImage.onload = resolve)));
      }

      if (this.badgeKey) {
        fetchPromises.push(this.fetchBadge());
        loadPromises.push(new Promise((resolve) => (this.badgeImage.onload = resolve)));
      }

      await Promise.all(fetchPromises);
      await Promise.all(loadPromises);
      await this.imageReadyPromise;

      this.$emit('ready');
    };

    public async fetchBackground() {
      if (!this.backgroundKey) {
        return;
      }

      const src = await fetchImage(`${this.decorationsSrc}/background/${this.backgroundKey}.webp`);
      if (src) {
        this.backgroundImage.src = src;
      }
    }

    public async fetchBadge() {
      if (!this.badgeKey) {
        return;
      }

      const src = await fetchImage(`${this.decorationsSrc}/badge/${this.badgeKey}.webp`);
      if (src) {
        this.badgeImage.src = src;
      }
    }

    public onImageReady(): void {
      this.imageReadyPromiseResolve();
    }
  }
</script>

<style>
  .kwokka-avatar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    --kwk-avatar--width: 100%;
    --kwk-avatar--color: #fff;
    --kwk-avatar--font-family: sans-serif;
    --kwk-avatar--font-size: 40px;
    --kwk-avatar--line-height: 1;
    aspect-ratio: 3;
    container-type: inline-size;
  }

  .kwokka-avatar__name {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 5%;
    --kwk-avatar--font-size: 10cqw;
  }

  .kwokka-avatar__name-text {
    overflow: hidden;
    text-overflow: ellipsis;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }

  .kwokka-avatar__background {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.5));
  }

  .kwokka-avatar__background-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .kwokka-avatar__background-empty {
    position: absolute;
    top: 0;
    left: 0;
    --kwk-avatar--width: 100%;
    --kwk-avatar--height: 100%;
    --kwk-avatar--background-color: rgba(255, 255, 255, 0.25);
    --kwk-avatar--border-radius: 16px;
    --kwk-avatar--box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
  }

  .kwokka-avatar__image-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    aspect-ratio: 1;
    flex-shrink: 0;
    margin-right: 5%;
  }

  .kwokka-avatar__badge {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    aspect-ratio: 5 / 1;
    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.5));
  }

  .kwokka-avatar__badge-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
