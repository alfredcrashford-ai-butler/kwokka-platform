<template>
  <SecondLevelLayout :title="$t('gamesManagement.title')" backUrl="/main">
    <DetailContainer v-if="items" :items="items" />
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Vue } from 'vue-facing-decorator';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import DetailContainer, { type DetailContainerItem } from '@/app/components/DetailContainer.vue';
  import GamesList from './components/GamesList.vue';
  import GamesMonitoring from './components/GamesMonitoring.vue';

  @Component({
    components: {
      SecondLevelLayout,
      DetailContainer,
    },
  })
  export default class GamesManagementView extends Vue {
    public items: DetailContainerItem[] = null;

    public mounted(): void {
      this.items = markRaw([
        {
          id: 'games',
          labelTranslationKey: 'gamesManagement.games.title',
          component: GamesList,
        },
        {
          id: 'monitoring',
          labelTranslationKey: 'gamesManagement.monitoring.title',
          component: GamesMonitoring,
        },
      ]);
    }
  }
</script>
