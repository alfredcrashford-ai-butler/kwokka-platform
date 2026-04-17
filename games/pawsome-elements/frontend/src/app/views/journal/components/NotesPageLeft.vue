<template>
  <PageLeft :activeItem="activeItem" :items="items" @select="onSelect($event)" />
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { TrackerService, KwokkaService, TranslationService } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import PageLeft from './PageLeft.vue';
  import type { PageItem } from './page-item';

  @Component({
    components: {
      PageLeft,
    },
    emits: ['select'],
  })
  export default class NotesPageLeft extends Vue {
    public items: PageItem[] = [];
    public activeItem: PageItem = null;

    @LazyInject(KwokkaService)
    public readonly kwokkaService: KwokkaService;

    @LazyInject(TranslationService)
    public readonly translationService: TranslationService;

    @LazyInject(TrackerService)
    public readonly tracker: TrackerService;

    public async mounted(): Promise<void> {
      await this.loadNotes();
    }

    private async loadNotes(): Promise<void> {
      try {
        const notesItems = await this.kwokkaService.getNotesItems();
        const notesItemInstances = await this.kwokkaService.getNotesItemsInstances();
        this.items = notesItems.map((noteItem) => ({
          id: noteItem.key,
          label: this.translationService.localize(`journal.notes.${noteItem.key}.title`),
          locked: !notesItemInstances.some((el) => el?.itemId === noteItem.id && el?.quantity),
        }));
      } catch (error) {
        this.items = [];
      }
    }

    public onSelect(item: PageItem): void {
      this.tracker.event(TrackingCategory.Journal, TrackingEvent.JournalNotesPageClick, { id: item.id });
      this.activeItem = item;
      this.$emit('select', item);
    }
  }
</script>
