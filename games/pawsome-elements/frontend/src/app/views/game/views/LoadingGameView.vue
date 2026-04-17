<template>
  <MenuLayout>
    <div class="loading-game-view">
      <UiLoader />
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';

  @Component({
    components: {
      MenuLayout,
      UiLoader,
    },
  })
  export default class LoadingGameView extends Vue {}
</script>

<style scoped lang="scss">
  .loading-game-view {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
