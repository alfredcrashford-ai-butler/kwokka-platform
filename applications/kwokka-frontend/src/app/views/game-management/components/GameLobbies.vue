<template>
  <div class="game-lobbies">
    <UiHeading class="game-lobbies__heading">{{ $t('gameManagement.lobbies.title') }}</UiHeading>
    <div class="game-lobbies__row">
      <p>{{ $t('gameManagement.lobbies.description') }}</p>
      <UiButton @click="onAddClick">{{ $t('gameManagement.lobbies.addLobby') }}</UiButton>
    </div>

    <div class="game-lobbies__grid" v-if="lobbies?.length">
      <template v-for="item in displayLobbies" :key="item.id">
        <LobbyCard
          v-if="item.value"
          class="game-lobbies__card"
          :lobby="item.value"
          :game="game"
          @click="onLobbyCardClick(item.value)"
        />
        <div v-else class="game-lobbies__empty-card"></div>
      </template>
    </div>
    <UiPagination
      :isPrevDisabled="page <= 0"
      :isNextDisabled="lobbies.length < itemsPerPage"
      :page="page"
      @next="setPage(page + 1)"
      @prev="setPage(page - 1)"
    />

    <AddEditLobbyDialog ref="addEditDialog" @confirm="onAddEditConfirm($event)" @delete="onDeleteConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { GameEntity, LobbyEntity } from '@kwokka/entities';
  import { ObjectUtil, UuidUtil } from '@kwokka/utils';
  import { LobbyApi } from '@/api/play/lobby/lobby.api';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiPagination from '@/app/ui-kit/UiPagination.vue';
  import LobbyCard from './LobbyCard.vue';
  import AddEditLobbyDialog from './AddEditLobbyDialog.vue';

  type DisplayLobby = {
    id: string;
    value: LobbyEntity;
  };

  @Component({
    components: {
      UiHeading,
      UiButton,
      UiPagination,
      LobbyCard,
      AddEditLobbyDialog,
    },
  })
  export default class GameLobbies extends Vue {
    public lobbies: LobbyEntity[] = [];
    public page: number = 0;
    public readonly itemsPerPage = 6;

    @Prop({ required: true })
    public game: GameEntity;

    @Ref()
    public addEditDialog: AddEditLobbyDialog;

    @LazyInject(LobbyApi)
    public lobbyApi: LobbyApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public get displayLobbies(): DisplayLobby[] {
      const filling = new Array(this.itemsPerPage - this.lobbies.length).fill(null);
      return [...this.lobbies, ...filling].map((el) => ({ value: el, id: el?.id || UuidUtil.generate(6) }));
    }

    public mounted() {
      this.fetchItems();
    }

    public onAddClick(): void {
      const lobby = new LobbyEntity({
        gameId: this.game.id,
        minPlayers: 0,
        maxPlayers: 0,
        key: '',
        config: {},
      });
      this.addEditDialog.show(lobby);
    }

    public onLobbyCardClick(lobby: LobbyEntity): void {
      this.addEditDialog.show(lobby);
    }

    public async onDeleteConfirm(lobby: LobbyEntity): Promise<void> {
      try {
        await this.lobbyApi.delete(lobby.id);
        this.notificationService.show({
          text: this.$t('gameManagement.lobbies.deletedSuccessfully'),
          type: 'success',
        });
        this.fetchItems();
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }

    public async onAddEditConfirm(lobby: LobbyEntity): Promise<void> {
      if (lobby.id) {
        await this.updateLobby(lobby);
      } else {
        await this.createLobby(lobby);
      }

      this.addEditDialog.hide();
      this.setPage(0);
    }

    public setPage(page: number) {
      this.page = page;
      this.fetchItems();
    }

    private async updateLobby(lobby: LobbyEntity): Promise<void> {
      try {
        const fields = ['key', 'minPlayers', 'maxPlayers', 'config', 'availableSince', 'availableTill'];
        const updateParams = ObjectUtil.take(lobby, fields);
        await this.lobbyApi.update(lobby.id, updateParams);
        this.notificationService.show({
          text: this.$t('gameManagement.lobbies.updatedSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async createLobby(lobby: LobbyEntity): Promise<void> {
      try {
        await this.lobbyApi.create(lobby);
        this.notificationService.show({
          text: this.$t('gameManagement.lobbies.createdSuccessfully'),
          type: 'success',
        });
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        throw e;
      }
    }

    private async fetchItems(): Promise<void> {
      try {
        const response = await this.lobbyApi.list(this.itemsPerPage * this.page, this.itemsPerPage);
        this.lobbies = response.data;
      } catch (e: any) {
        this.notificationService.showErrors([e]);
      }
    }
  }
</script>

<style scoped lang="scss">
  .game-lobbies {
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
  }
</style>
