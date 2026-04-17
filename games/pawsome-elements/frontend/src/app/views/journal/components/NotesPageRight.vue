<template>
  <PageRight :activeItem="activeItem">
    <template v-slot:pwsm_comic_origins_1>
      <div class="notes-page-right" v-html="$t('journal.notes.pwsm_comic_origins_1.content')"></div>
    </template>

    <template v-slot:pwsm_comic_origins_2>
      <div class="notes-page-right" v-html="$t('journal.notes.pwsm_comic_origins_2.content')"></div>
    </template>

    <template v-slot:pwsm_comic_origins_3>
      <div class="notes-page-right" v-html="$t('journal.notes.pwsm_comic_origins_3.content')"></div>
    </template>

    <template v-slot:pwsm_comic_origins_4>
      <div class="notes-page-right" v-html="$t('journal.notes.pwsm_comic_origins_4.content')"></div>
    </template>

    <template v-slot:pwsm_comic_origins_5>
      <div class="notes-page-right" v-html="$t('journal.notes.pwsm_comic_origins_5.content')"></div>
    </template>

    <template v-slot:pwsm_comic_origins_6>
      <div class="notes-page-right" v-html="$t('journal.notes.pwsm_comic_origins_6.content')"></div>
    </template>
  </PageRight>
</template>

<script lang="ts">
  import { RouteName } from '@/app/route-name';
  import { PawsomeElementsCardSet } from '@/game-data/game-instance';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { PageItem } from './page-item';
  import PageRight from './PageRight.vue';

  @Component({
    components: { PageRight },
  })
  export default class NotesPageRight extends Vue {
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
  .notes-page-right {
    display: flex;
    flex-direction: column;
    @include UiGap(2);

    :deep(b) {
      font-weight: 900;
    }

    :deep(i) {
      font-style: italic;
    }

    :deep(.right) {
      text-align: right;
      align-self: flex-end;
    }
  }
</style>
