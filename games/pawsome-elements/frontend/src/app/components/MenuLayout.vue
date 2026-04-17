<template>
  <div class="menu-layout">
    <div class="menu-layout__container ui-container">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component
  export default class MenuLayout extends Vue {}
</script>

<style scoped lang="scss">
  .menu-layout {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @include UiTavernBackground();

    &__container {
      @include UiPadding(2);
    }
  }
</style>
