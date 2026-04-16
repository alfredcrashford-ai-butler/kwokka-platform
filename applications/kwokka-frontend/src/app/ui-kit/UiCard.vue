<template>
  <div class="ui-card" @click="onClick" @keydown="onKeydown">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Vue } from 'vue-facing-decorator';

  @Component
  export default class UiCard extends Vue {
    @Emit('click')
    public onClick(event: Event): Event {
      return event;
    }

    @Emit('keydown')
    public onKeydown(event: Event): Event {
      return event;
    }
  }
</script>

<style scoped lang="scss">
  .ui-card {
    @include UiBorderRadius(xl);

    @include UiTheme() {
      background-color: UiColor(shade-700);
      border: 2px solid UiColor(shade-100);
    }
  }
</style>
