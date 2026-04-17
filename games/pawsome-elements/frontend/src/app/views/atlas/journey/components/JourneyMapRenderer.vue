<template>
  <div class="journey-map-renderer" :style="{ '--pwsm--map-items': itemsPerPage, '--pwsm--map-current-page': page }">
    <div
      class="journey-map-renderer__map"
      v-for="(n, i) in maxPage + 2"
      :key="i"
      :style="{ '--pwsm--map-page': i }"
    ></div>
    <JourneyMapItem
      v-for="(item, i) in items"
      class="journey-map-renderer__item"
      :class="{
        'journey-map-renderer__item_even': i % 2 === 0,
        'journey-map-renderer__item_odd': i % 2 !== 0,
      }"
      :key="item.tradeKey"
      :item="item.item"
      :itemTrade="item.trade"
      :position="i % 2 === 0 ? 'bottom' : 'top'"
      :num="i + 1"
      :isSelected="item.isSelected"
      :isActive="item.isActive"
      :isHighlighted="item.isHighlighted"
      :isCostShown="item.isCostShown"
      @click="$emit('select', item)"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { JourneyMap } from '@/game-data';
  import { ItemEntity, ItemTradeEntity } from '@kwokka/entities';
  import JourneyMapItem from './JourneyMapItem.vue';

  export type JourneyMapDisplayItem = {
    item?: ItemEntity;
    trade?: ItemTradeEntity;
    tradeKey: string;
    isCostShown: boolean;
    isActive: boolean;
    isHighlighted: boolean;
    isSelected: boolean;
  };

  @Component({
    components: {
      JourneyMapItem,
    },
    emits: ['select'],
  })
  export default class JourneyMapRenderer extends Vue {
    @Prop({ required: true })
    public map: JourneyMap;

    @Prop({ required: true })
    public page: number;

    @Prop({ required: true })
    public maxPage: number;

    @Prop({ required: true })
    public itemsPerPage: number;

    @Prop({ required: true })
    public items: JourneyMapDisplayItem[];
  }
</script>

<style scoped lang="scss">
  .journey-map-renderer {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: flex-start;
    transform: translateX(calc(-1 * var(--pwsm--map-current-page) * 100%));
    transition: transform ease 2s;

    &__map {
      position: absolute;
      background-image: url('/static/atlas/journey_map.webp');
      background-size: 100% auto;
      width: 100%;
      height: 150%;
      z-index: -1;
      transform: translateX(calc(var(--pwsm--map-page) * 100%));
    }

    & > * {
      flex-shrink: 0;
      flex-basis: calc(100% / var(--pwsm--map-items));
    }

    &__item {
      &_even:after {
        background-image: url('/static/atlas/path_up.webp');
      }

      &_odd:after {
        background-image: url('/static/atlas/path_down.webp');
      }

      &:nth-last-child(1):after {
        display: none;
      }

      &:after {
        content: '';
        pointer-events: none;
        height: calc(100% - UiSpacing(5));
        width: 100%;
        left: 50%;
        position: absolute;
        background-size: 100% 100%;
        z-index: -1;
      }
    }
  }
</style>
