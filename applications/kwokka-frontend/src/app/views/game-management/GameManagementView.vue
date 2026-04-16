<template>
  <SecondLevelLayout :title="$t('gameManagement.title')" backUrl="/games-management">
    <DetailContainer v-if="items && game" :items="items" :props="{ game }" :emits="{ gameUpdated }" />
    <UiLoader v-else />
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Vue } from 'vue-facing-decorator';
  import type { GameEntity } from '@kwokka/entities';
  import { GameApi } from '@/api/play/game/game.api';
  import { LoggerService } from '@/service/logger/logger.service';
  import { LazyInject } from '@/ioc';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import DetailContainer, { type DetailContainerItem } from '@/app/components/DetailContainer.vue';
  import GameDetails from './components/GameDetails.vue';
  import GameMonitoring from './components/GameMonitoring.vue';
  import GameLobbies from './components/GameLobbies.vue';

  @Component({
    components: {
      UiLoader,
      SecondLevelLayout,
      DetailContainer,
    },
  })
  export default class GameManagementView extends Vue {
    public items: DetailContainerItem[] = null;
    public game: GameEntity = null;

    @LazyInject(GameApi)
    public gameApi: GameApi;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    public async created(): Promise<void> {
      if (!this.$route.params.id) {
        this.redirectWithErrorMessage();
      }

      try {
        this.game = await this.gameApi.getById(this.$route.params.id as string);
      } catch (error: any) {
        this.redirectWithErrorMessage(error);
      }
      this.$route.params.id;
    }

    private redirectWithErrorMessage(error?: any): void {
      this.logger.error(error);
      this.$router.replace({ name: 'games-management' });
    }

    public mounted(): void {
      this.items = markRaw([
        {
          id: 'gameDetails',
          labelTranslationKey: 'gameManagement.details.title',
          component: GameDetails,
        },
        {
          id: 'lobbies',
          labelTranslationKey: 'gameManagement.lobbies.title',
          component: GameLobbies,
        },
        {
          id: 'monitoring',
          labelTranslationKey: 'gameManagement.monitoring.title',
          component: GameMonitoring,
        },
      ]);
    }

    public gameUpdated(game: GameEntity): void {
      this.game = game;
    }
  }
</script>
