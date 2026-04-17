<template>
  <MenuLayout>
    <div class="abandoned-game-state"></div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component } from 'vue-facing-decorator';
  import { CommonGameComponent } from '../components/common-game-component';
  import MenuLayout from '@/app/components/MenuLayout.vue';

  @Component({
    components: {
      MenuLayout,
    },
  })
  export default class AbandonedGameState extends CommonGameComponent {}
</script>

<style scoped lang="scss">
  .abandoned-game-state {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
</style>
