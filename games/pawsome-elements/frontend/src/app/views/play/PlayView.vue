<template>
  <MenuLayout class="play-view-animation">
    <div class="play-view">
      <TitleCard class="play-view__title-card" :heading="$t('play.heading')" @backClick="onBackClick()">
        <div class="play-view__container">
          <GameTypeCard
            :heading="$t('play.quickMatch.title')"
            :caption="$t('play.quickMatch.caption')"
            imageSrc="/static/game_type/quick_match.webp"
            class="play-view__card play-view__card_order-1"
            @click="onQuickMatchClick()"
          />

          <GameTypeCard
            :heading="$t('play.rankedMatch.title')"
            :caption="$t('play.rankedMatch.caption')"
            imageSrc="/static/game_type/ranked_match.webp"
            class="play-view__card play-view__card_order-2"
            @click="onRankedMatchClick()"
          />

          <GameTypeCard
            :heading="$t('play.lobby.title')"
            :caption="$t('play.lobby.caption')"
            imageSrc="/static/game_type/lobby.webp"
            class="play-view__card play-view__card_order-3"
            @click="onLobbyClick()"
          />
        </div>
      </TitleCard>
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import GameTypeCard from './components/GameTypeCard.vue';
  import TitleCard from '@/app/components/TitleCard.vue';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      MenuLayout,
      TitleCard,
      GameTypeCard,
    },
  })
  export default class PlayView extends Vue {
    public onBackClick(): void {
      this.$router.replace({ name: RouteName.Main });
    }

    public onLobbyClick(): void {
      this.$router.replace({ name: RouteName.Lobby });
    }

    public onRankedMatchClick(): void {
      this.$router.replace({ name: RouteName.RankedMatch });
    }

    public onQuickMatchClick(): void {
      this.$router.replace({ name: RouteName.QuickMatch });
    }
  }
</script>

<style lang="scss">
  .play-view-animation {
    &.v-enter-active {
      transition-duration: 1.3s;

      .play-view__title-card {
        animation-name: UiAnimationSlideInTop, UiAnimationFadeIn;
        animation-timing-function: UiTransition(spring), linear;
        animation-fill-mode: backwards;
        animation-duration: 1.3s, 500ms;
      }
    }

    &.v-leave-active {
      transition-duration: 500ms;

      .play-view__title-card {
        animation-name: UiAnimationSlideOutTop, UiAnimationFadeOut;
        animation-timing-function: ease, linear;
        animation-duration: 500ms;
      }
    }
  }
</style>

<style scoped lang="scss">
  .play-view {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include UiMediaPortrait() {
      align-items: flex-end;
    }

    &__title-card {
      width: 100%;
      height: 80%;
      will-change: transform;
      animation-fill-mode: both;

      @include UiMediaPortrait() {
        height: 100%;
      }
    }

    &__container {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      align-items: center;
      perspective: 20cm;

      @include UiGap(4);
      @include UiPadding(4);
      @include UiMediaPortrait() {
        grid-template-columns: 1fr;
      }
    }

    &__card {
      height: 100%;
      backface-visibility: hidden;
      transform-style: preserve-3d;
      animation-fill-mode: backwards;
      animation-name: UiAnimationFlipInLeft;
      animation-duration: 500ms;
      animation-timing-function: ease-out;
      will-change: transform;

      &_order-1 {
        animation-delay: 0.5s;
      }
      &_order-2 {
        animation-delay: 0.75s;
      }
      &_order-3 {
        animation-delay: 1s;
      }
    }
  }
</style>
