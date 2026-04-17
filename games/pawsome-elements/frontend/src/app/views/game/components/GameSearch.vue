<template>
  <div class="game-search">
    <div class="game-search__background">
      <Transition>
        <div
          class="game-search__image"
          :key="image"
          :style="{ backgroundImage: `url('/static/game_search/${image}')` }"
        ></div>
      </Transition>

      <div class="game-search__info">
        <h1 class="game-search__heading">{{ $t('game.search.heading') }}</h1>
        <UiLoader />
        <Stopwatch class="game-search__stopwatch" ref="stopwatch" />
      </div>

      <UiButton class="game-search__cancel-button" type="red" @click="cancelDialog.show()">
        <UiIcon name="x" />
        {{ $t('game.search.cancel') }}
      </UiButton>
    </div>

    <UiDialog
      ref="cancelDialog"
      :text="$t('game.search.cancelDialog.text')"
      :primaryButtonText="$t('game.search.cancelDialog.primaryButtonText')"
      :secondaryButtonText="$t('game.search.cancelDialog.secondaryButtonText')"
      @primaryButtonClick="$emit('cancel')"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { ArrayUtil } from '@kwokka/utils';
  import { UiLoader, UiButton, UiIcon, UiDialog } from '@/app/ui-kit';
  import { MenuLayout, Stopwatch } from '@/app/components';

  const IMAGE_CHANGE_INTERVAL_MS = 6000;

  @Component({
    components: {
      MenuLayout,
      UiIcon,
      UiButton,
      UiDialog,
      UiLoader,
      Stopwatch,
    },
    emits: ['cancel'],
  })
  export default class GameSearch extends Vue {
    @Ref()
    public cancelDialog: UiDialog;

    @Ref()
    public stopwatch: Stopwatch;

    public imageIndex: number = 0;
    public readonly images = ArrayUtil.shuffle([
      'search_screen_1.webp',
      'search_screen_2.webp',
      'search_screen_3.webp',
      'search_screen_4.webp',
      'search_screen_5.webp',
    ]);
    private imageChangeInterval: number;
    public image: string = this.images[this.imageIndex];

    public mounted(): void {
      this.stopwatch.start();
      this.image = this.images[this.imageIndex];
      this.imageChangeInterval = setInterval(() => {
        this.imageIndex += 1;
        if (this.imageIndex >= this.images.length) {
          this.imageIndex = 0;
        }
        this.image = this.images[this.imageIndex];
      }, IMAGE_CHANGE_INTERVAL_MS);
    }

    public beforeUnmount(): void {
      clearInterval(this.imageChangeInterval);
    }
  }
</script>

<style scoped lang="scss">
  .game-search {
    position: relative;
    width: 100%;
    height: 100%;
    @include UiTavernBackground();

    &__background {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: UiColor(shade-900);
      animation-name: UiAnimationFadeIn;
      animation-duration: 1000ms;
      animation-timing-function: ease;
      animation-fill-mode: both;
      opacity: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      @include UiPadding(10);
    }

    &__image {
      position: absolute;
      height: 100%;
      width: 100%;
      transition: 5000ms opacity ease;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      animation-timing-function: ease;
      animation-fill-mode: both;

      @include UiInlineAnimation(10000ms) {
        0% {
          transform: scale(1.02) translate(-1%, -1%);
        }
        100% {
          transform: scale(1.1) translate(3%, 3%);
        }
      }

      &.v-enter-to,
      &.v-leave-from {
        opacity: 1;
      }

      &.v-enter-from,
      &.v-leave-to {
        opacity: 0;
      }
    }

    &__info {
      position: relative;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      @include UiGap(4);
    }

    &__heading {
      @include UiTextShadow(2);
      @include UiTypographyHeading1();
    }

    &__stopwatch {
      @include UiTextShadow(2);
    }

    &__cancel-button {
      position: relative;
    }
  }
</style>
