<template>
  <MenuLayout class="journal-view-animation">
    <div class="journal-view">
      <div class="journal-view__container" :class="{ 'journal-view__container_with-mobile-offset': !!pageItem }">
        <div class="journal-view__bg-image"></div>

        <div class="journal-view__page journal-view__page_left">
          <div class="journal-view__page-background"></div>
          <div class="journal-view__page-container">
            <UiCircleButton
              class="journal-view__back"
              icon="arrow-left"
              @click="$router.replace({ name: routeName.Main })"
            />
            <div class="journal-view__tabs">
              <JournalTab
                v-for="tab in tabs"
                :key="tab.id"
                :color="tab.color"
                :disabled="tab.disabled"
                :isActive="tab.id === activeTab.id"
                :icon="tab.icon"
                @click="onTabChange(tab)"
              />
            </div>

            <h1 class="journal-view__heading">&#8766; {{ $t('journal.heading') }} &#8766;</h1>
            <hr class="journal-view__divider" />
            <h2 class="journal-view__sub-heading">{{ $t(`journal.${activeTab.id}.heading`) }}</h2>

            <div class="journal-view__tab-container-left">
              <component :is="activeTab.pageLeft" @select="pageItem = $event" ref="activeTabLeftPage"></component>
            </div>
          </div>
        </div>

        <div class="journal-view__page journal-view__page_right">
          <div class="journal-view__page-background"></div>
          <div class="journal-view__page-container">
            <FadeTransition>
              <UiCircleButton
                v-if="!!pageItem"
                class="journal-view__back ui-hide_landscape"
                icon="arrow-left"
                @click="resetPageItem()"
              />
            </FadeTransition>
            <component :is="activeTab.pageRight" :activeItem="pageItem"></component>
          </div>
        </div>
      </div>
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { SoundService } from '@/service';
  import { UiCircleButton, UiIcon } from '@/app/ui-kit';
  import { MenuLayout } from '@/app/components';
  import {
    TutorialPageLeft,
    TutorialPageRight,
    AboutPageLeft,
    AboutPageRight,
    JournalTab,
    NotesPageLeft,
    NotesPageRight,
  } from './components';
  import type { PageItem } from './components/page-item';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';
  import { RouteName } from '@/app/route-name';

  enum JournalTabId {
    Quest = 'quest',
    Notes = 'notes',
    Tutorial = 'tutorial',
    About = 'about',
  }

  type JournalTabData = {
    id: JournalTabId;
    color: string;
    disabled?: boolean;
    pageLeft: typeof Vue;
    pageRight: typeof Vue;
    icon: string;
  };

  @Component({
    components: {
      MenuLayout,
      UiIcon,
      UiCircleButton,
      JournalTab,
      FadeTransition,
    },
  })
  export default class JournalView extends Vue {
    @Ref()
    public activeTabLeftPage: any;

    public readonly routeName = RouteName;
    public readonly tabs: JournalTabData[] = [
      {
        id: JournalTabId.Tutorial,
        color: 'yellow',
        icon: 'graduation-cap',
        pageLeft: markRaw(TutorialPageLeft),
        pageRight: markRaw(TutorialPageRight),
      },
      {
        id: JournalTabId.Notes,
        color: 'red',
        icon: 'books',
        pageLeft: markRaw(NotesPageLeft),
        pageRight: markRaw(NotesPageRight),
      },
      {
        id: JournalTabId.About,
        color: 'blue',
        icon: 'question-mark',
        pageLeft: markRaw(AboutPageLeft),
        pageRight: markRaw(AboutPageRight),
      },
    ];
    public activeTab: JournalTabData = this.tabs[0];
    public pageItem: PageItem = null;
    private openSoundTimeout: number = null;

    @LazyInject(SoundService)
    private soundService: SoundService;

    public mounted(): void {
      this.openSoundTimeout = setTimeout(() => this.soundService.playBookOpen(), 500);
    }

    public beforeUnmount(): void {
      this.soundService.playBookClose();
      clearTimeout(this.openSoundTimeout);
    }

    public onTabChange(tab: JournalTabData): void {
      if (this.activeTab === tab) {
        return;
      }

      this.activeTab = tab;
      const oldPageItem = this.pageItem;
      this.pageItem = null;
      if (oldPageItem === this.pageItem) {
        this.soundService.playBookPage();
      }
    }

    public resetPageItem(): void {
      this.pageItem = null;
      this.activeTabLeftPage?.resetActiveItem?.();
    }

    @Watch('pageItem')
    public onPageItemChange(): void {
      this.soundService.playBookPage();
    }
  }
</script>

<style lang="scss">
  .journal-view-animation {
    --pwsm--spacing-unit-increased: calc(var(--pwsm--spacing-unit) * 1.4);

    &.v-enter-active {
      $duration: 2s;
      transition-duration: $duration;

      .journal-view__container {
        transition-duration: calc($duration / 2);
        transition-timing-function: ease;
        transition-property: opacity, transform;
      }

      .journal-view__bg-image {
        transition-timing-function: steps(1);
        transition-duration: calc($duration * 0.35);
        transition-property: background-image, transform;
      }

      .journal-view__page {
        transition-delay: calc($duration / 2);
        transition-duration: calc($duration / 2);
        transition-timing-function: ease;
        transition-property: opacity;
      }
    }

    &.v-leave-active {
      $duration: 500ms;
      transition-duration: $duration;

      .journal-view__container {
        transition-duration: $duration;
        transition-timing-function: ease;
        transition-property: opacity, transform;
      }

      .journal-view__bg-image {
        transition-timing-function: steps(1);
        transition-duration: calc($duration * 0.2);
        transition-property: background-image, transform;
      }

      .journal-view__page {
        transition-duration: calc($duration * 0.2);
        transition-timing-function: ease;
        transition-property: opacity;
      }
    }

    &.v-enter-to,
    &.v-leave-from {
      .journal-view__container {
        opacity: 1;
        transform: scale(1);
      }

      .journal-view__bg-image {
        background-image: url('/static/journal/book_opened.webp');
        @include UiMediaPortrait() {
          transform: translateX(0);
        }
      }

      .journal-view__page {
        opacity: 1;
      }
    }

    &.v-leave-to,
    &.v-enter-from {
      .journal-view__container {
        opacity: 0;
        transform: scale(0.8);
      }

      .journal-view__bg-image {
        background-image: url('/static/journal/book_closed.webp');
        @include UiMediaPortrait() {
          transform: translateX(-25%);
        }
      }

      .journal-view__page {
        opacity: 0;
      }
    }
  }
</style>

<style scoped lang="scss">
  .journal-view {
    position: relative;
    width: 100%;
    height: 100%;
    color: UiColor(shade-900);
    --pwsm-journal-mobile-active-offset: 105%;
    font-size: var(--pwsm--font-size);

    @include UiMediaPortrait() {
      --pwsm--spacing-unit: var(--pwsm--spacing-unit-increased);
      --pwsm--font-size: calc(var(--pwsm--spacing-unit) * 4 * 0.75);
    }

    &__heading {
      text-align: center;
    }

    &__container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: transform ease 500ms;

      @include UiMediaPortrait() {
        &_with-mobile-offset {
          transform: translateX(calc(-1 * var(--pwsm-journal-mobile-active-offset)));
        }
      }
    }

    &__bg-image {
      position: absolute;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      @include UiDropShadow(3);
      background-image: url('/static/journal/book_opened.webp');

      @include UiMediaPortrait() {
        left: -11%;
        width: 228%;
      }
    }

    &__page {
      position: absolute;
      top: 7%;
      height: 85%;

      &_left {
        left: 11.6%;
        width: 37%;
      }

      &_right {
        right: 12.6%;
        width: 38%;
      }

      @include UiMediaPortrait() {
        top: 14%;
        height: 71%;

        &_left {
          left: 0%;
          width: 100%;
        }

        &_right {
          left: var(--pwsm-journal-mobile-active-offset);
          width: 100%;
        }
      }
    }

    &__back {
      position: absolute;
      left: 0;
      top: 0;
      // transform: translate(-50%, -50%);
    }

    &__tabs {
      position: absolute;
      left: 0;
      top: 15%;
      display: flex;
      flex-direction: column;
      width: fit-content;
      align-items: flex-start;
    }

    &__divider {
      @include UiMargin(4, top);
      @include UiMargin(4, bottom);
      width: 70%;
      border-bottom: 2px dashed rgba(0, 0, 0, 0.5);
      margin-left: auto;
      margin-right: auto;
    }

    &__sub-heading {
      @include UiTypographyHeading4();
      @include UiMargin(4, bottom);
      @include UiPadding(18, left);
    }

    &__tab-container-left {
      @include UiPadding(18, left);
    }

    &__page-background {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.4);
      filter: blur(UiSpacing(3));
    }

    &__page-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
</style>
