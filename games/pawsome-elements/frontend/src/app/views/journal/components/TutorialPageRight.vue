<template>
  <PageRight :activeItem="activeItem">
    <template v-slot:basics>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/journal/basics_screenshot.webp"
            :alt="$t('journal.tutorial.basics.heading')"
            inert
            mode="cover"
          />
        </div>
        <p v-html="$t('journal.tutorial.basics.rulesParagraph')"></p>
        <p v-html="$t('journal.tutorial.basics.tutorialCaption')"></p>
        <UiButton type="secondary" @click="onStartTutorialClick()">
          {{ $t('journal.tutorial.basics.startTutorial') }}
        </UiButton>
      </div>
    </template>

    <template v-slot:spells>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/journal/spells_screenshot.webp"
            :alt="$t('journal.tutorial.spells.heading')"
            inert
            mode="cover"
          />
        </div>
        <p v-html="$t('journal.tutorial.spells.paragraph1')"></p>
        <p v-html="$t('journal.tutorial.spells.paragraph2')"></p>
        <p v-html="$t('journal.tutorial.spells.paragraph3')"></p>
      </div>
    </template>

    <template v-slot:essence1>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/essence.webp"
            :alt="$t('journal.tutorial.essence1.heading')"
            inert
            mode="cover"
          />
        </div>
        <p v-html="$t('journal.tutorial.essence1.paragraph1')"></p>
        <p v-html="$t('journal.tutorial.essence1.paragraph2')"></p>
        <p v-html="$t('journal.tutorial.essence1.paragraph3')"></p>
      </div>
    </template>

    <template v-slot:essence2>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/journal/essence_activation.webp"
            :alt="$t('journal.tutorial.essence2.heading')"
            inert
            mode="contain"
          />
        </div>
        <p v-html="$t('journal.tutorial.essence2.paragraph1')"></p>
        <p v-html="$t('journal.tutorial.essence2.paragraph2')"></p>
      </div>
    </template>

    <template v-slot:card_elements>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/journal/card_elements.webp"
            :alt="$t('journal.tutorial.cardElements.heading')"
            inert
            mode="contain"
          />
        </div>
        <p v-html="$t('journal.tutorial.cardElements.paragraph1')"></p>
        <p v-html="$t('journal.tutorial.cardElements.paragraph2')"></p>
        <p v-html="$t('journal.tutorial.cardElements.paragraph3')"></p>
      </div>
    </template>

    <template v-slot:card_effects>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/journal/card_effects.webp"
            :alt="$t('journal.tutorial.cardEffects.heading')"
            inert
            mode="contain"
          />
        </div>
        <p v-html="$t('journal.tutorial.cardEffects.paragraph1')"></p>
        <p v-html="$t('journal.tutorial.cardEffects.paragraph2')"></p>
      </div>
    </template>

    <template v-slot:transform_card_effect>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/journal/transform_icon.webp"
            :alt="$t('journal.tutorial.transformCardEffect.heading')"
            inert
            mode="contain"
          />
        </div>
        <p v-html="$t('journal.tutorial.transformCardEffect.paragraph1')"></p>
      </div>
    </template>

    <template v-slot:ranked>
      <div class="tutorial-page-right">
        <RatingContainer>
          <h3>xxxx</h3>
          <p>{{ $t('journal.tutorial.ranked.yourRating') }}</p>
        </RatingContainer>
        <p v-html="$t('journal.tutorial.ranked.paragraph1')"></p>
        <p v-html="$t('journal.tutorial.ranked.paragraph2')"></p>
        <UiButton type="secondary" @click="onRankedLearnMoreClick()">
          {{ $t('journal.tutorial.ranked.learnMore') }}
        </UiButton>
      </div>
    </template>

    <template v-slot:card_set_standard>
      <div class="tutorial-page-right">
        <div class="tutorial-page-right__img-frame">
          <UiResponsiveImage
            class="tutorial-page-right__img"
            src="/static/card_set/standard.webp"
            :alt="$t('cardSet.standard.title')"
            inert
            mode="cover"
          />
        </div>
        <p>{{ $t('cardSet.standard.shortDescription') }}</p>
        <UiButton type="secondary" @click="onSeeAllCardsClick(cardSets.Standard)">
          {{ $t('journal.tutorial.cardSet.seeAllCards') }}
        </UiButton>
      </div>
    </template>
  </PageRight>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import PageRight from './PageRight.vue';
  import type { PageItem } from './page-item';
  import { UiButton, UiResponsiveImage } from '@/app/ui-kit';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service';
  import { PawsomeElementsCardSet } from '@/game-data/game-instance';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { RouteName } from '@/app/route-name';
  import { RatingContainer } from '@/app/components';

  @Component({
    components: { PageRight, UiButton, UiResponsiveImage, RatingContainer },
  })
  export default class TutorialPageRight extends Vue {
    @Prop({ default: null })
    public activeItem: PageItem;

    public readonly cardSets = PawsomeElementsCardSet;

    @LazyInject(TrackerService)
    public readonly tracker: TrackerService;

    public onStartTutorialClick(): void {
      this.tracker.event(TrackingCategory.Journal, TrackingEvent.JournalTutorialStart);
      this.$router.replace({ name: RouteName.Tutorial });
    }

    public onSeeAllCardsClick(cardSet: PawsomeElementsCardSet): void {
      this.tracker.event(TrackingCategory.Journal, TrackingEvent.JournalCardSetView, { cardSet });
      this.$router.replace({ name: RouteName.CardSet, query: { cardSet, backTo: RouteName.Journal } });
    }

    public onRankedLearnMoreClick(): void {
      this.tracker.event(TrackingCategory.Journal, TrackingEvent.JournalRankedLearnMoreClick);
      this.$router.replace({ name: RouteName.RankedMatch });
    }
  }
</script>

<style scoped lang="scss">
  .tutorial-page-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @include UiGap(4);

    &__img {
      width: 100%;
      height: 100%;
      @include UiBorderRadius(0.5);
    }

    &__img-frame {
      width: 80%;
      aspect-ratio: 16/9;
      @include UiPadding(2);
      border-left: 2px solid rgba(0, 0, 0, 0.25);
      border-right: 2px solid rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }
  }
</style>
