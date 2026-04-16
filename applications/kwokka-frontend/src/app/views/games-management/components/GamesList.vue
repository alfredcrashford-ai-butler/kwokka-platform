<template>
  <div class="games-list">
    <UiHeading class="games-list__heading">{{ $t('gamesManagement.games.title') }}</UiHeading>
    <div class="games-list__row">
      <p>{{ $t('gamesManagement.games.description') }}</p>
      <UiButton @click="onAddClick">{{ $t('gamesManagement.games.addGame') }}</UiButton>
    </div>

    <div class="games-list__grid">
      <template v-for="item in displayGames" :key="item.id">
        <GameCard class="games-list__card" :game="item.value" v-if="item.value" />
        <div v-else class="games-list__empty-card"></div>
      </template>
    </div>
    <UiPagination
      :isPrevDisabled="page <= 0"
      :isNextDisabled="games.length < itemsPerPage"
      :page="page"
      @next="setPage(page + 1)"
      @prev="setPage(page - 1)"
    />
  </div>

  <AddEditGameDialog ref="addEditDialog" @confirm="onAddConfirm($event)" />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { GameEntity } from '@kwokka/entities';
  import { UuidUtil } from '@kwokka/utils';
  import { LazyInject } from '@/ioc';
  import { GameApi } from '@/api/play/game/game.api';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiPagination from '@/app/ui-kit/UiPagination.vue';
  import GameCard from './GameCard.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import AddEditGameDialog from '../../../components/AddEditGameDialog.vue';

  type DisplayGame = {
    id: string;
    value: GameEntity;
  };

  @Component({
    components: {
      UiPagination,
      UiHeading,
      UiButton,
      GameCard,
      AddEditGameDialog,
    },
  })
  export default class GamesList extends Vue {
    @Ref()
    public addEditDialog: AddEditGameDialog;

    @LazyInject(GameApi)
    public gameApi: GameApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public games: GameEntity[] = [];
    public page: number = 0;
    public readonly itemsPerPage = 6;

    public created(): void {
      this.fetchGames();
    }

    public onAddClick(): void {
      this.addEditDialog.show();
    }

    public get displayGames(): DisplayGame[] {
      const filling = new Array(this.itemsPerPage - this.games.length).fill(null);
      return [...this.games, ...filling].map((el) => ({ value: el, id: el?.id || UuidUtil.generate(6) }));
    }

    public mounted(): void {
      this.fetchGames();
    }

    public setPage(page: number): void {
      this.page = page;
      this.fetchGames();
    }

    public async onAddConfirm(game: GameEntity): Promise<void> {
      await this.createGame(game);
      this.addEditDialog.hide();
      this.setPage(0);
    }

    private async createGame(game: GameEntity): Promise<void> {
      try {
        await this.gameApi.create(game);
        this.notificationService.show({ text: this.$t('gamesManagement.games.createdSuccessfully'), type: 'success' });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async fetchGames(): Promise<void> {
      try {
        const response = await this.gameApi.list(this.itemsPerPage * this.page, this.itemsPerPage);
        this.games = response.data;
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }
  }
</script>

<style scoped lang="scss">
  .games-list {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include UiMargin(4, bottom);
    }

    &__grid {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax($grid-step * 70, 1fr));
      @include UiGap(3);
    }

    &__card {
      aspect-ratio: 16 / 9;
    }

    &__empty-card {
      @include UiBorderRadius(md);
      @include UiTheme() {
        border: 1px solid UiColor(shade-100);
        background-color: UiColor(shade-400);
      }
      aspect-ratio: 16 / 9;
      opacity: 0.5;
    }

    &__divider {
      border-bottom: 1px solid rgba(#fff, 0.65);
    }
  }
</style>
