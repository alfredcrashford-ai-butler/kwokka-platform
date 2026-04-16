<template>
  <div
    class="ui-panel"
    :class="[
      colorClass,
    ]"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-facing-decorator';

  export type UiPanelColor = 'transparent' | 'yellow' | 'orange' | 'blue' | 'cyan' | 'pink' | 'red';

  @Component
  export default class UiPanel extends Vue {

    private static readonly defaultColor: UiPanelColor = 'blue';

    @Prop()
    public color?: UiPanelColor;

    public get colorClass() {
      const color = this.color || UiPanel.defaultColor;
      return `ui-panel_color-${color}`;
    }

    @Emit('click')
    public onClick(event: Event): Event {
      return event;
    }

  }
</script>

<style scoped lang="scss">
  .ui-panel {
    @include UiBorderRadius(xl);
    background-color: var(--ui-panel-color);
    @include UiTheme() {
      border: 2px solid UiColor(shade-100);
    }

    &_color-yellow {
      @include UiTheme() {
        --ui-panel-color: #{UiColor(yellow-500)};
      }
    }

    &_color-orange {
      @include UiTheme() {
        --ui-panel-color: #{UiColor(orange-500)};
      }
    }

    &_color-blue {
      @include UiTheme() {
        --ui-panel-color: #{UiColor(blue-500)};
      }
    }

    &_color-cyan {
      @include UiTheme() {
        --ui-panel-color: #{UiColor(cyan-500)};
      }
    }

    &_color-pink {
      @include UiTheme() {
        --ui-panel-color: #{UiColor(pink-500)};
      }
    }

    &_color-red {
      @include UiTheme() {
        --ui-panel-color: #{UiColor(red-500)};
      }
    }

  }
</style>
