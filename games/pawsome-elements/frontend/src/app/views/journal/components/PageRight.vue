<template>
  <div class="page-right">
    <div class="page-right__background"></div>
    <div class="page-right__container">
      <template v-if="activeItem">
        <h3 class="page-right__heading">&#8766; {{ activeItem.label }} &#8766;</h3>
        <hr class="page-right__divider" />
      </template>
      <div class="page-right__content" v-if="activeItem">
        <slot :name="activeItem?.id"></slot>
      </div>
      <div class="page-right__placeholder" v-else>
        <div class="page-right__placeholder-img"></div>
        <p>{{ $t('journal.rightPagePlaceholder') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { PageItem } from './page-item';

  @Component
  export default class PageRight extends Vue {
    @Prop({ default: null })
    public activeItem: PageItem;
  }
</script>

<style scoped lang="scss">
  .page-right {
    width: 100%;
    height: 100%;

    &__heading {
      @include UiTypographyHeading1();
      text-align: center;
    }

    &__divider {
      width: 80%;
      border-bottom: 2px dashed rgba(0, 0, 0, 0.5);
      @include UiMargin(4, top);
      @include UiMargin(4, bottom);
      margin-left: auto;
      margin-right: auto;
    }

    &__content {
      width: 100%;
      height: 100%;
      @include UiPadding(4, left);
      @include UiPadding(4, right);
    }

    &__placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      text-align: center;
      flex-direction: column;

      @include UiGap(2);
    }

    &__placeholder-img {
      background-image: url('/static/journal/book_outline.webp');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: 65%;
      aspect-ratio: 1;
      opacity: 0.25;
    }
  }
</style>
