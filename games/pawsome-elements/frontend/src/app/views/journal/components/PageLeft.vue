<template>
  <div class="page-left">
    <ul class="page-left__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="page-left__list-item"
        :class="{
          'page-left__list-item_is-disabled': activeItem === item || item.locked,
          'page-left__list-item_is-active': activeItem === item,
        }"
      >
        <button
          class="page-left__list-item-button"
          :disabled="activeItem === item || item.locked"
          @click="$emit('select', item)"
        >
          <UiIcon name="lock" size="sm" class="page-left__list-item-lock" v-if="item.locked" />
          {{ item.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { PageItem } from './page-item';
  import { UiIcon } from '@/app/ui-kit';

  @Component({
    components: {
      UiIcon,
    },
    emits: ['select'],
  })
  export default class PageLeft extends Vue {
    @Prop({ default: null })
    public activeItem: PageItem;

    @Prop({ default: null })
    public items: PageItem[];
  }
</script>

<style scoped lang="scss">
  .page-left {
    &__list {
      list-style-position: inside;
      list-style-type: circle;
    }

    &__list-item {
      @include UiMargin(2, bottom);
      @include UiTypographyHeading6();
      &_is-disabled {
        opacity: 0.5;
      }

      &_is-active {
        list-style-type: disc;
      }
    }

    &__list-item-button {
      @include UiButtonAppearance();
      display: inline-flex;
      align-items: center;
      @include UiGap(1);
    }

    &__list-item-lock {
      filter: none;
    }
  }
</style>
