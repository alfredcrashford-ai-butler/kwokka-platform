<template>
  <header class="ui-header">
    <div class="ui-header__fixed-header" :class="{ 'ui-header__fixed-header_is-scrolled': isScrolled }">
      <div class="ui-header__container">
        <slot></slot>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { ArrayUtil } from '@kwokka/utils';

  @Component
  export default class UiHeader extends Vue {
    public isScrolled = false;
    private intersectionObserver: IntersectionObserver;

    public mounted() {
      this.intersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          const firstEntry = ArrayUtil.first(entries);
          this.isScrolled = !firstEntry?.isIntersecting;
        },
        { threshold: 1, root: document.body },
      );
      this.intersectionObserver.observe(this.$el);
    }

    public beforeDestroy() {
      this.intersectionObserver?.disconnect();
    }
  }
</script>

<style lang="scss" scoped>
  .ui-header {
    height: $grid-step * 20; // 80px
    flex-shrink: 0;

    @include UiMediaMobile() {
      height: $grid-step * 12; // 48px
    }

    &__fixed-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      width: 100%;
      transition-property: background-color, border-bottom;
      transition-duration: 100ms;
      transition-timing-function: ease;

      &_is-scrolled {
        @include UiTheme() {
          background-color: UiColor(shade-800);
          border-bottom: 2px solid UiColor(shade-100);
        }
      }
    }

    &__container {
      @include UiLayout();

      display: flex;
      align-items: center;
      justify-content: center;
      height: $grid-step * 20; // 80px

      @include UiMediaMobile() {
        height: $grid-step * 12; // 48px
      }
    }
  }
</style>
