<template>
  <MenuLayout>
    <div class="practice-start-game-state">
      <UiLoader />
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component } from 'vue-facing-decorator';
  import { CommonGameComponent } from '../components/common-game-component';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import { UiLoader } from '@/app/ui-kit';

  @Component({
    components: {
      UiLoader,
      MenuLayout,
    },
  })
  export default class PracticeStartGameState extends CommonGameComponent {
    public mounted(): void {
      this.controller.sendStartGameAction();
    }
  }
</script>

<style scoped lang="scss">
  .practice-start-game-state {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
