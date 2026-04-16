<template>
  <section class="ui-carousel" :class="[`ui-carousel_direction-${direction}`]">
    <div
      ref="backdrop"
      class="ui-carousel__overlay-container"
      :class="{
        'ui-overlay': isFullscreen,
        'ui-carousel__overlay-container_is-fullscreen': isFullscreen,
      }"
      @click="onBackdropClick($event)"
    >
      <div
        class="ui-carousel__container"
        :class="{
          'ui-carousel__container_is-fullscreen': isFullscreen,
        }"
        :style="{ aspectRatio }"
      >
        <transition enter-active-class="ui-carousel__image_enter" leave-active-class="ui-carousel__image_leave">
          <UiResponsiveImage
            class="ui-carousel__image"
            :mode="isFullscreen ? 'contain' : 'cover'"
            role="button"
            :src="currentImageUrl"
            :key="currentIndex"
            @click="onImageClick"
          />
        </transition>

        <UiButton
          class="ui-carousel__button"
          width="shrink"
          shape="circled"
          type="transparent"
          size="lg"
          @click="onLeftButtonClick"
        >
          <UiIcon name="arrow-left"/>
        </UiButton>

        <div class="ui-carousel__indicator-wrapper">
          <div
            v-for="(url, index) in imagesUrls"
            :key="url + index"
            class="ui-carousel__indicator"
            :class="{
              'ui-carousel__indicator_is-highlighted': currentIndex === index,
            }"
          />
        </div>

        <UiButton
          class="ui-carousel__button"
          width="shrink"
          shape="circled"
          type="transparent"
          size="lg"
          @click="onRightButtonClick"
        >
          <UiIcon name="arrow-right"/>
        </UiButton>
      </div>
    </div>
  </section>
</template>


<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiResponsiveImage from '@/app/ui-kit/UiResponsiveImage.vue';

  @Component({
    components: {
      UiResponsiveImage,
      UiIcon,
      UiButton,
    },
  })
  export default class UiCarousel extends Vue {

    @Ref()
    public backdrop: HTMLDivElement;

    @Prop()
    public imagesUrls: string[];

    @Prop({ default: '16 / 9' })
    public aspectRatio: string;

    public currentIndex = 0;

    public direction: 'left' | 'right' = 'left';

    public isFullscreen: boolean = false;

    public get currentImageUrl(): string {
      return this.imagesUrls[this.currentIndex];
    }

    public onLeftButtonClick() {
      this.direction = 'left';
      if (this.currentIndex === 0) {
        this.currentIndex = this.imagesUrls.length - 1;
      } else {
        this.currentIndex -= 1;
      }
    }

    public onRightButtonClick() {
      this.direction = 'right';
      if (this.currentIndex === this.imagesUrls.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex += 1;
      }
    }

    public onImageClick() {
      this.isFullscreen = !this.isFullscreen;
    }

    public onBackdropClick(event: Event) {
      if (event.target === this.backdrop) {
        this.isFullscreen = false;
      }
    }

  }
</script>

<style lang="scss" scoped>
  .ui-carousel {
    @include UiBorderRadius(lg);
    width: 100%;
    height: 100%;
    --ui-carousel-cursor: zoom-in;

    &_direction-left {
      --ui-carousel-transition-animation-in: UiTransitionSlideInLeft;
      --ui-carousel-transition-animation-out: UiTransitionSlideOutRight;
    }

    &_direction-right {
      --ui-carousel-transition-animation-in: UiTransitionSlideInRight;
      --ui-carousel-transition-animation-out: UiTransitionSlideOutLeft;
    }

    &__overlay-container {
      width: 100%;
      height: 100%;
      transition: background-color 100ms linear;
      border-radius: inherit;

      &_is-fullscreen {
        border-radius: 0;
      }
    }

    &__container {
      @include UiPadding(4);
      @include UiPadding(2, bottom);
      @include UiPadding(2, top);
      border-radius: inherit;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;

      &_is-fullscreen {
        $padding: $grid-step * 4;
        width: calc(100% - #{$padding * 2});
        max-height: 90%;
        height: auto;

        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;

        border-radius: 0;
        --ui-carousel-cursor: zoom-out;

        @include UiMediaMobile() {
          $padding: $grid-step * 2;
          width: calc(100% - #{$padding * 2});
        }
      }
    }

    &__image {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      animation-duration: 500ms;
      animation-timing-function: ease-in-out;
      cursor: var(--ui-carousel-cursor);

      &_enter {
        animation-name: var(--ui-carousel-transition-animation-in);
      }

      &_leave {
        animation-name: var(--ui-carousel-transition-animation-out);
      }
    }

    &__indicator {
      $size: $grid-step * 2;
      width: $size;
      height: $size;
      border-radius: $size / 2;
      opacity: 0.75;

      @include UiTheme() {
        background-color: UiColor(shade-100);
      }

      &_is-highlighted {
        opacity: 1;
      }
    }

    &__indicator-wrapper {
      @include UiGap(2, false);
      @include UiPadding(2, null, false);
      @include UiBorderRadius(lg);
      display: flex;
      align-items: center;
      align-self: flex-end;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.65);
    }

    &__button {
      background-color: rgba(0, 0, 0, 0.35);
    }
  }
</style>
