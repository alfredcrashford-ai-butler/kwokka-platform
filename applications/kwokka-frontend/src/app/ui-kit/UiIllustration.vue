<template>
  <!-- eslint-disable max-len -->
  <div class="ui-illustration">
    <svg v-if="option === 1" viewBox="0 0 130 37" xmlns="http://www.w3.org/2000/svg">
      <rect y="21" width="96" height="16" rx="4" fill="#EF8134"/>
      <rect x="50" y="7" width="46" height="12" rx="4" fill="#D55476"/>
      <rect x="98" width="32" height="32" rx="4" fill="#56A7BA"/>
    </svg>
    <svg v-if="option === 2" viewBox="0 0 148 29" xmlns="http://www.w3.org/2000/svg">
      <rect x="120" y="28.5" width="120" height="8" rx="4" transform="rotate(-180 120 28.5)" fill="#EF8134"/>
      <rect x="120" y="8.5" width="120" height="8" rx="4" transform="rotate(-180 120 8.5)" fill="#EF8134"/>
      <rect x="120" y="16.5" width="80" height="4" rx="2" transform="rotate(-180 120 16.5)" fill="#D55476"/>
      <path d="M148 24.5C148 25.6046 147.105 26.5 146 26.5H132C127.582 26.5 124 22.9183 124 18.5V4.5C124 3.39543 124.895 2.5 126 2.5H140C144.418 2.5 148 6.08172 148 10.5V24.5Z" fill="#56A7BA"/>
    </svg>
  </div>
  <!-- eslint-enable max-len -->
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class UiIllustration extends Vue {

    @Prop() public option: number;

  }
</script>

<style scoped lang="scss">
  .ui-illustration {
    width: 100%;
    height: auto;
  }
</style>
