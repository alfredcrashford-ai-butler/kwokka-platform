<template>
  <PageLeft :activeItem="activeItem" :items="items" @select="onSelect($event)" />
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import PageLeft from './PageLeft.vue';
  import type { PageItem } from './page-item';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';

  enum ItemId {
    Basics = 'basics',
    Spells = 'spells',
    Essence1 = 'essence1',
    Essence2 = 'essence2',
    CardElements = 'card_elements',
    CardEffects = 'card_effects',
    TransformCardEffect = 'transform_card_effect',
    Ranked = 'ranked',
    CardSetStandard = 'card_set_standard',
  }

  @Component({
    components: {
      PageLeft,
    },
    emits: ['select'],
  })
  export default class TutorialPageLeft extends Vue {
    public items = [];
    public activeItem: PageItem = null;

    @LazyInject(TrackerService)
    public readonly tracker: TrackerService;

    public mounted(): void {
      this.items = [
        { id: ItemId.Basics, label: this.$t('journal.tutorial.basics.heading') },
        { id: ItemId.Spells, label: this.$t('journal.tutorial.spells.heading') },
        { id: ItemId.Essence1, label: this.$t('journal.tutorial.essence1.heading') },
        { id: ItemId.Essence2, label: this.$t('journal.tutorial.essence2.heading') },
        { id: ItemId.CardElements, label: this.$t('journal.tutorial.cardElements.heading') },
        { id: ItemId.CardEffects, label: this.$t('journal.tutorial.cardEffects.heading') },
        { id: ItemId.TransformCardEffect, label: this.$t('journal.tutorial.transformCardEffect.heading') },
        { id: ItemId.Ranked, label: this.$t('journal.tutorial.ranked.heading') },
        { id: ItemId.CardSetStandard, label: `${this.$t('cardSet.title')}: ${this.$t('cardSet.standard.title')}` },
      ];
    }

    public onSelect(item: PageItem): void {
      this.tracker.event(TrackingCategory.Journal, TrackingEvent.JournalTutorialPageClick, { item });
      this.activeItem = item;
      this.$emit('select', item);
    }

    public resetActiveItem(): void {
      this.activeItem = null;
    }
  }
</script>
