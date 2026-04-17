<template>
  <MenuLayout class="main-view-animation">
    <div class="main-view">
      <div class="main-view__primary">
        <div class="main-view__emblem"></div>
        <div class="main-view__menu">
          <button v-ui-sound class="main-view__menu-button main-view__menu-button_var-1" @click="onPlayClick()">
            <span class="main-view__menu-button-text">{{ $t('main.play') }}</span>
          </button>
          <button v-ui-sound class="main-view__menu-button main-view__menu-button_var-2" @click="onPracticeClick()">
            <span class="main-view__menu-button-text">{{ $t('main.practice') }}</span>
          </button>
          <button v-ui-sound class="main-view__menu-button main-view__menu-button_var-3" @click="onShopClick()">
            <span class="main-view__menu-button-text">{{ $t('main.shop') }}</span>
          </button>
          <button v-ui-sound class="main-view__menu-button main-view__menu-button_var-5" @click="onAtlasClick()">
            <span class="main-view__menu-button-text">{{ $t('main.atlas') }}</span>
          </button>
          <button v-ui-sound class="main-view__menu-button main-view__menu-button_var-5" @click="onJournalClick()">
            <span class="main-view__menu-button-text">{{ $t('main.journal') }}</span>
          </button>
        </div>
      </div>

      <div class="main-view__top-right">
        <UserAvatarSettings class="main-view__avatar" />
        <EssencePanel />
      </div>

      <Settings class="main-view__bottom-right">
        <AppSettings />
        <AudioSettings />
        <UiButton size="xl" type="red" width="block" @click="onSignOutClick()">{{ $t('main.signOut') }}</UiButton>
        <LegalInfo />
      </Settings>

      <div></div>
      <MainBottomSection class="main-view__bottom" />
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { TrackerService, ConfigService, KwokkaService, TranslationService } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { UiButton } from '@/app/ui-kit';
  import { RouteName } from '@/app/route-name';
  import {
    UserAvatarSettings,
    EssencePanel,
    MenuLayout,
    Settings,
    AppSettings,
    AudioSettings,
    LegalInfo,
  } from '@/app/components';
  import MainBottomSection from './components/MainBottomSection.vue';
  import { ActiveSkillItemKey } from '@/game-data';
  import { TraitKey } from '@/game-data/trait-key';
  import { ItemTradeKey } from '@/game-data/item-trade-key';

  @Component({
    components: {
      MenuLayout,
      UserAvatarSettings,
      Settings,
      AudioSettings,
      AppSettings,
      UiButton,
      EssencePanel,
      MainBottomSection,
      LegalInfo,
    },
  })
  export default class MainView extends Vue {
    @LazyInject(TranslationService)
    private translationService: TranslationService;

    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    @LazyInject(TrackerService)
    public trackerService!: TrackerService;

    public mounted(): void {
      this.kwokkaService.unlockFirstSpell();
    }

    public onSignOutClick() {
      const isConfirmed = confirm(this.translationService.localize('main.signOutConfirmation'));
      if (isConfirmed) {
        this.kwokkaService.client.uninitialize();
        window.open(this.configService.frontendConfig.rootUrl, '_self');
      }
    }

    public onPlayClick(): void {
      this.trackerService.event(TrackingCategory.Menu, TrackingEvent.PlayClick);
      this.$router.replace({ name: RouteName.Play });
    }

    public onPracticeClick(): void {
      this.trackerService.event(TrackingCategory.Menu, TrackingEvent.PracticeStartClick);
      this.$router.replace({ name: RouteName.Practice });
    }

    public onAtlasClick(): void {
      this.trackerService.event(TrackingCategory.Menu, TrackingEvent.AtlasClick);
      this.$router.replace({ name: RouteName.Atlas });
    }

    public onShopClick(): void {
      this.trackerService.event(TrackingCategory.Menu, TrackingEvent.ShopClick);
      this.$router.replace({ name: RouteName.Shop });
    }

    public onJournalClick(): void {
      this.trackerService.event(TrackingCategory.Menu, TrackingEvent.JournalClick);
      this.$router.replace({ name: RouteName.Journal });
    }
  }
</script>

<style lang="scss">
  .main-view-animation {
    @keyframes MainViewBottomSectionTransform {
      from {
        transform: translateX(-50%) translateY(100%);
      }
      to {
        transform: translateX(-50%) translateY(0);
      }
    }

    .main-view__primary,
    .main-view__top-right,
    .main-view__bottom-right,
    .main-view__bottom {
      animation-fill-mode: both;
    }

    &.v-enter-active {
      transition-duration: 2.5s;

      .main-view__primary {
        animation-duration: 1s;
        animation-timing-function: ease-out;
        @include UiInlineAnimation() {
          from {
            transform: translateX(-200%);
          }
          to {
            transform: translateX(0);
          }
        }
      }

      .main-view__emblem {
        @include UiInlineAnimation() {
          from {
            transform: translateY(5%) rotateZ(-180deg);
          }
          to {
            transform: translateY(5%) rotateZ(0);
          }
        }
        animation-duration: 1s;
        animation-timing-function: ease-out;
      }

      .main-view__menu-button {
        animation-duration: 1s;
        animation-timing-function: UiTransition(spring), linear;
        animation-name: UiAnimationSlideInLeft, UiAnimationFadeIn;
        animation-fill-mode: backwards;

        &:nth-child(1) {
          animation-delay: 700ms;
        }

        &:nth-child(2) {
          animation-delay: 775ms;
        }

        &:nth-child(3) {
          animation-delay: 850ms;
        }

        &:nth-child(4) {
          animation-delay: 925ms;
        }

        &:nth-child(5) {
          animation-delay: 1000ms;
        }
      }

      .main-view__top-right {
        > * {
          animation-name: UiAnimationFadeIn, UiAnimationSlideInRight;
          animation-timing-function: linear, UiTransition(spring);
          animation-duration: 1s;
          animation-fill-mode: backwards;

          &:nth-child(1) {
            animation-delay: 700ms;
          }

          &:nth-child(2) {
            animation-delay: 775ms;
          }

          &:nth-child(3) {
            animation-delay: 850ms;
          }
        }
      }

      .main-view__bottom-right {
        animation-name: UiAnimationFadeIn, UiAnimationSlideInRight;
        animation-timing-function: linear, UiTransition(spring);
        animation-duration: 1s;
        animation-fill-mode: backwards;
        animation-delay: 1s;
      }

      .main-view__bottom {
        animation-name: UiAnimationFadeIn, MainViewBottomSectionTransform;
        animation-timing-function: linear, UiTransition(spring);
        animation-duration: 1s;
        animation-delay: 1.5s;
      }
    }

    &.v-leave-active {
      $duration: 500ms;
      transition-duration: $duration;

      .main-view__primary {
        animation-duration: $duration;
        animation-name: UiAnimationSlideOutLeft, UiAnimationFadeOut;
        animation-timing-function: ease, linear;
      }

      .main-view__top-right {
        animation-name: UiAnimationFadeOut, UiAnimationSlideOutRight;
        animation-timing-function: ease, linear;
        animation-duration: $duration;
      }

      .main-view__bottom-right {
        animation-name: UiAnimationFadeOut, UiAnimationSlideOutRight;
        animation-timing-function: ease, linear;
        animation-duration: $duration;
      }

      .main-view__bottom {
        animation-name: UiAnimationFadeOut, MainViewBottomSectionTransform;
        animation-timing-function: linear, ease;
        animation-duration: $duration;
        animation-direction: normal, reverse;
      }
    }
  }
</style>

<style scoped lang="scss">
  .main-view {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__primary {
      position: relative;
      height: fit-content;
      display: flex;
      flex-direction: column;
      justify-content: center;
      aspect-ratio: 320 / 464;
      will-change: transform;

      @include UiMediaLandscape() {
        height: 100%;
      }

      @include UiMediaPortrait() {
        width: 100%;
      }
    }

    &__emblem {
      position: absolute;
      background-image: url('/static/ui/emblem.webp');
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 110%;
      aspect-ratio: 1;
      right: 80%;
      transform: translateY(5%);
      z-index: 1;
      pointer-events: none;
      @include UiDropShadow(2);
      will-change: transform;
    }

    &__menu {
      display: flex;
      flex-direction: column;
      @include UiGap(2);
    }

    &__menu-button {
      position: relative;
      @include UiButtonAppearance();
      width: 100%;
      aspect-ratio: 630 / 120;
      z-index: 0;
      transition:
        transform ease-in-out 100ms,
        filter linear 100ms;
      will-change: transform, opacity, filter;

      &:hover:not(:disabled),
      &:focus-visible:not(:disabled) {
        transform: scale(1.05);
      }

      &:nth-child(1) {
        left: -20%;
      }

      &:nth-child(2) {
        left: -5%;
      }

      &:nth-child(3) {
        left: 5%;
      }

      &:nth-child(4) {
        left: -5%;
      }

      &:nth-child(5) {
        left: -20%;
      }

      &_var-1::before {
        background-image: url('/static/ui/button_horizontal_1.webp');
        aspect-ratio: 630 / 136.5;
      }

      &_var-2::before {
        background-image: url('/static/ui/button_horizontal_2.webp');
        aspect-ratio: 634.5 / 123;
      }

      &_var-3::before {
        background-image: url('/static/ui/button_horizontal_3.webp');
        aspect-ratio: 634.5 / 123;
      }

      &_var-4::before {
        background-image: url('/static/ui/button_horizontal_4.webp');
        aspect-ratio: 634.5 / 123;
      }

      &_var-5::before {
        background-image: url('/static/ui/button_horizontal_5.webp');
        aspect-ratio: 644 / 210.5;
      }

      &::before {
        content: '';
        position: absolute;
        min-width: 100%;
        min-height: 100%;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        right: 0;
        top: 0;
        z-index: -1;
        pointer-events: none;
        @include UiDropShadow(2);
      }
    }

    &__menu-button-text {
      @include UiTypographyHeading1();
      @include UiTextShadow(3);
    }

    &__top-right {
      position: absolute;
      right: 0;
      top: 0;
      width: fit-content;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      @include UiGap(2);
    }

    &__bottom-right {
      position: absolute;
      right: 0;
      bottom: 0;
      width: fit-content;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      @include UiGap(2);
    }

    &__avatar {
      position: relative;
      width: UiSpacing(55);

      @include UiMediaPortrait() {
        width: UiSpacing(65);
      }
    }

    &__bottom {
      position: absolute;
      bottom: UiSpacing(2);
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
