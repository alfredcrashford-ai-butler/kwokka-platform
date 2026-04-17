<template>
  <div class="ui-tooltip-wrapper" @mouseenter="showTooltip()" @mouseleave="hideTooltip()">
    <slot></slot>
    <Teleport to="[data-app-tooltip-container]">
      <Transition>
        <div
          v-if="isVisible"
          :class="['ui-tooltip', positionClass]"
          v-html="message"
          :style="tooltipStyles"
          ref="tooltipElement"
        ></div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';

  @Component
  export default class UiTooltip extends Vue {
    @Prop({ required: true })
    public message!: string;

    @Prop({ default: 'top' })
    public position!: 'top' | 'right' | 'bottom' | 'left';

    @Ref()
    public tooltipElement: Element;

    public isVisible = false;
    public tooltipStyles: Record<string, string> = {};

    public showTooltip() {
      this.isVisible = true;
      this.updateTooltipPosition();
    }

    public hideTooltip() {
      this.isVisible = false;
    }

    public get positionClass() {
      return `ui-tooltip_position-${this.position}`;
    }

    private updateTooltipPosition() {
      this.$nextTick(() => {
        const wrapper = this.$el;
        const tooltip = this.tooltipElement;

        if (!wrapper || !tooltip) {
          return;
        }

        const wrapperRect = wrapper.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top = 0;
        let left = 0;

        if (['top', 'bottom'].includes(this.position)) {
          left = wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2;
        }

        if (['left', 'right'].includes(this.position)) {
          top = wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2;
        }

        if (this.position === 'top') {
          top = wrapperRect.top - tooltipRect.height;
        }

        if (this.position === 'bottom') {
          top = wrapperRect.bottom;
        }

        if (this.position === 'left') {
          left = wrapperRect.left - tooltipRect.width;
        }

        if (this.position === 'right') {
          left = wrapperRect.right;
        }

        // Prevent tooltip from overflowing viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width;
        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height;

        this.tooltipStyles = {
          top: `${top}px`,
          left: `${left}px`,
        };
      });
    }
  }
</script>

<style scoped lang="scss">
  .ui-tooltip-wrapper {
    width: 100%;
    height: 100%;
  }

  .ui-tooltip {
    position: absolute;
    background-color: UiColor(shade-900, 0.9);
    @include UiPadding(2);
    @include UiBorderRadius(1);
    @include UiTypographyParagraph2();
    pointer-events: none;
    max-width: UiSpacing(100);
    min-width: UiSpacing(40);
    width: fit-content;
    text-align: center;

    &.v-enter-to,
    &.v-leave-from {
      opacity: 1;
    }

    &.v-enter-from,
    &.v-leave-to {
      opacity: 0;
    }

    &.v-enter-active,
    &.v-leave-active {
      transition: opacity linear 200ms;
    }
  }
</style>
