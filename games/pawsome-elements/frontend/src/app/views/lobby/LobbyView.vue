<template>
  <MenuLayout class="lobby-view-animation">
    <div class="lobby-view" :class="{ 'lobby-view_action-selected': state !== states.Default }">
      <TitleCard
        class="lobby-view__title-card"
        :heading="$t('lobby.heading')"
        @backClick="$router.replace({ name: routeName.Play })"
      >
        <div class="lobby-view__grid">
          <LobbyCard
            v-for="gameInstance in gameInstances"
            :key="gameInstance.id"
            :lobby="lobby"
            :gameInstance="gameInstance"
            :class="{
              'lobby-view__lobby-card_is-active': gameInstance.id === selectedGameInstance?.id,
            }"
            @click="onGameInstanceClick(gameInstance)"
          />
        </div>
        <UiArrowButton
          class="lobby-view__grid-arrow-button"
          direction="left"
          :disabled="!page"
          @click="setPage(page - 1)"
        />
        <UiArrowButton
          class="lobby-view__grid-arrow-button lobby-view__grid-arrow-button_right"
          direction="right"
          :disabled="gameInstances?.length < gameCardsPerPage"
          @click="setPage(page + 1)"
        />
        <ActionPanel class="lobby-view__action-panel">
          <UiButton type="blue" width="block" @click="onCreateLobbyClick()">
            {{ $t('lobby.action.createLobby.button') }}
          </UiButton>
        </ActionPanel>
      </TitleCard>

      <ActionCard
        class="lobby-view__action-card"
        :heading="actionHeading"
        :isBackButtonShown="isPortrait"
        @backClick="onBackClick()"
      >
        <ActionCardContent
          v-if="state === states.CreateLobby"
          :heading="$t('cardSet.standard.title')"
          :buttonText="$t('lobby.action.createLobby.submit')"
          :buttonDisabled="!roomName"
          @submitClick="onCreateLobbySubmit()"
        >
          <div class="lobby-view__action-card-content">
            <div class="lobby-view__action-card-row">
              <UiInput
                :label="$t('lobby.action.createLobby.lobbyName')"
                :placeholder="$t('lobby.action.createLobby.lobbyNamePlaceholder')"
                v-model="roomName"
              />
            </div>
            <UiSwitch
              orientation="horizontal"
              :label="$t('lobby.action.createLobby.private')"
              v-model="isCreatedLobbyPrivate"
            />
          </div>
        </ActionCardContent>
        <ActionCardContent
          v-if="state === states.JoinPublicLobby"
          :heading="$t('cardSet.standard.title')"
          :buttonText="$t('lobby.action.joinPublicLobby.submit')"
          @submitClick="onJoinPublicLobbySubmit()"
          @backClick="onBackClick()"
        >
          <div class="lobby-view__action-card-content">
            <h3 class="lobby-view__action-card-subheading">{{ selectedGameInstance.lobbySettings.name }}</h3>
            <div class="lobby-view__players-count">
              <UiIcon name="users" size="sm" />
              <span>{{ selectedGameInstance.players?.length || 0 }} / {{ lobby.maxPlayers }}</span>
            </div>
          </div>
        </ActionCardContent>
        <div class="lobby-view__action-card-default-content" v-if="state === states.Default">
          <h3 class="lobby-view__action-card-subheading">{{ $t('lobby.action.defaultState.heading') }}</h3>
          <p class="lobby-view__action-card-caption">{{ $t('lobby.action.defaultState.caption') }}</p>
        </div>
      </ActionCard>
    </div>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import { GameEntity, GameInstanceEntityStatus, LobbyEntity } from '@kwokka/entities';
  import { RandomUtil } from '@kwokka/utils';
  import { MenuLayout, ActionCard, TitleCard, ActionPanel } from '@/app/components';
  import { LobbyCard, ActionCardContent } from './components';
  import { LobbyKey } from '@/game-data';
  import { LazyInject } from '@/ioc';
  import { KwokkaService, TrackerService } from '@/service';
  import { PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import { UiButton, UiIcon, UiArrowButton, UiSwitch, UiInput } from '@/app/ui-kit';
  import { RouteName } from '@/app/route-name';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';

  enum LobbyViewState {
    CreateLobby = 'create_lobby',
    JoinPublicLobby = 'join_public_lobby',
    Default = 'default',
  }

  @Component({
    components: {
      MenuLayout,
      TitleCard,
      ActionCard,
      ActionPanel,
      UiButton,
      ActionCardContent,
      UiArrowButton,
      LobbyCard,
      UiSwitch,
      UiInput,
      UiIcon,
    },
  })
  export default class LobbyView extends Vue {
    public state: LobbyViewState = LobbyViewState.Default;
    public gameInstances: PwsmGameInstanceEntity[] = [];
    public selectedGameInstance: PwsmGameInstanceEntity = null;
    public isCreatedLobbyPrivate: boolean = false;
    public roomName: string = this.generateRoomName();
    public readonly states = LobbyViewState;
    public readonly gameCardsPerPage = 6;
    public readonly routeName = RouteName;
    public lobby: LobbyEntity;
    public page: number = 0;
    private readonly tickIntervalMs = 3000;
    private fetchGameInstancesTickTimeout: number;
    private game: GameEntity;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(TrackerService)
    public trackerService: TrackerService;

    @Inject()
    public isPortrait: boolean;

    public async mounted(): Promise<void> {
      this.game = await this.kwokkaService.getGame();
      this.lobby = await this.kwokkaService.client.game.getLobbyByKey(LobbyKey.Room);
      this.tickGameInstanceFetch();
    }

    public beforeUnmount(): void {
      clearInterval(this.fetchGameInstancesTickTimeout);
    }

    private async tickGameInstanceFetch(): Promise<void> {
      clearInterval(this.fetchGameInstancesTickTimeout);
      const gameInstances = await this.fetchGameInstances(this.page * this.gameCardsPerPage, this.gameCardsPerPage);
      this.gameInstances = gameInstances;

      this.fetchGameInstancesTickTimeout = setTimeout(() => this.tickGameInstanceFetch(), this.tickIntervalMs);
    }

    private async fetchGameInstances(offset: number, limit: number): Promise<PwsmGameInstanceEntity[]> {
      const listResult = await this.kwokkaService.client.game.listGameInstances({
        filter: { gameId: this.game.id, lobbyId: this.lobby.id, status: GameInstanceEntityStatus.Initial },
        offset,
        limit,
      });
      const gameInstances = listResult.data;

      return gameInstances.map((el) => new PwsmGameInstanceEntity(el));
    }

    public setPage(page: number): void {
      this.page = page;
      this.tickGameInstanceFetch();
    }

    public get actionHeading(): string {
      if (this.state === LobbyViewState.CreateLobby) {
        return this.$t('lobby.action.createLobby.heading');
      }

      if (this.state === LobbyViewState.JoinPublicLobby) {
        return this.$t('lobby.action.joinPublicLobby.heading');
      }

      return this.$t('lobby.action.heading');
    }

    public onCreateLobbyClick(): void {
      this.state = LobbyViewState.CreateLobby;
      this.selectedGameInstance = null;
    }

    public onGameInstanceClick(gameInstance: PwsmGameInstanceEntity): void {
      this.state = LobbyViewState.JoinPublicLobby;
      this.selectedGameInstance = gameInstance;
    }

    public onBackClick(): void {
      this.state = LobbyViewState.Default;
      this.selectedGameInstance = null;
    }

    public async onCreateLobbySubmit(): Promise<void> {
      const gameInstance = await this.kwokkaService.createRoomMatch(!this.isCreatedLobbyPrivate, this.roomName);
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.RoomLobbyTypeCreated);
      this.$router.replace({ name: RouteName.Game, params: { id: gameInstance.id } });
    }

    public onJoinPublicLobbySubmit(): void {
      this.trackerService.event(TrackingCategory.Game, TrackingEvent.RoomLobbyTypeJoined);
      this.$router.replace({ name: RouteName.Game, params: { id: this.selectedGameInstance.id } });
    }

    public generateRoomName(): string {
      const adjectives = [
        'Fantastic',
        'Magical',
        'Secret',
        'Shiny',
        'Spooky',
        'Random',
        'Electric',
        'Destructive',
        'Kind',
        'Silly',
        'Misterious',
        'Gentle',
        'Fishy',
        'Cute',
        'Happy',
        'Smiley',
        'Mild',
        'Picky',
        'Wild',
        'Rare',
        'Mythical',
        'Legendary',
      ];
      const nouns = [
        'Dogs',
        'Cats',
        'Beasts',
        'Machines',
        'Magicians',
        'Monks',
        'Sorcerers',
        'Pets',
        'Robots',
        'Lizards',
        'Gang',
        'Group',
        'Bunch',
        'Pack',
        'Mice',
        'Snakes',
        'Bears',
        'Wolfs',
        'Foxes',
        'Ferrets',
      ];
      const adjective = RandomUtil.randomInArray(adjectives);
      const noun = RandomUtil.randomInArray(nouns);
      return `${adjective}${noun}`;
    }
  }
</script>

<style lang="scss">
  .lobby-view-animation {
    &.v-enter-active {
      transition-duration: 650ms;

      .lobby-view__title-card {
        animation-name: UiAnimationSlideInLeft, UiAnimationFadeIn;
        animation-timing-function: ease-out, linear;
        animation-duration: 500ms, 250ms;
      }

      .lobby-view__action-card {
        animation-name: UiAnimationSlideInRight, UiAnimationFadeIn;
        animation-timing-function: ease-out, linear;
        animation-duration: 400ms, 200ms;
        animation-delay: 250ms;
      }
    }

    &.v-leave-active {
      transition-duration: 500ms;

      .lobby-view__title-card {
        animation-name: UiAnimationSlideOutLeft, UiAnimationFadeOut;
        animation-timing-function: ease, linear;
        animation-duration: 500ms;
      }

      .lobby-view__action-card {
        animation-name: UiAnimationSlideOutRight, UiAnimationFadeOut;
        animation-timing-function: ease, linear;
        animation-duration: 500ms;
      }
    }
  }
</style>

<style scoped lang="scss">
  .lobby-view {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    @include UiGap(2);

    &_action-selected {
      @include UiMediaPortrait() {
        .lobby-view__title-card {
          opacity: 0;
          visibility: hidden;
          transform: translateX(-100%);
        }

        .lobby-view__action-card {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
      }
    }

    &__title-card {
      flex-shrink: 0;
      flex-basis: 60%;
      animation-fill-mode: both;
      transition:
        all ease-in-out 400ms,
        transform ease-out 400ms,
        opacity linear 200ms;

      @include UiMediaPortrait() {
        position: absolute;
        flex-basis: auto;
        flex-grow: 1;
        flex-shrink: 0;
        transform: translateX(0);
        width: 100%;
        height: 100%;
      }
    }

    &__action-card {
      flex-shrink: 0;
      flex-basis: 40%;
      animation-fill-mode: both;
      transition:
        all ease-in-out 400ms,
        transform ease-out 400ms,
        opacity linear 200ms;

      @include UiMediaPortrait() {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        visibility: hidden;
        flex-basis: auto;
        flex-grow: 1;
        flex-shrink: 0;
        transform: translateX(100%);
      }
    }

    &__action-card-default-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      @include UiGap(4);
    }

    &__action-card-subheading {
      @include UiTypographyHeading3();
      @include UiTextShadow(3);
    }

    &__action-card-caption {
      @include UiTextShadow(2);
      @include UiTypographyHeading6();
      text-align: center;
      max-width: UiSpacing(100);
    }

    &__action-card-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      @include UiGap(2);
    }

    &__grid {
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr 1fr 1fr;
      height: 100%;
      @include UiGap(4);
      @include UiPadding(2, top);
      @include UiPadding(2, left);
      @include UiPadding(2, right);
      @include UiPadding(18, bottom);

      @include UiMediaPortrait() {
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr;
      }
    }

    &__grid-arrow-button {
      position: absolute;
      top: 50%;
      left: calc(-1 * UiSpacing(2));
      transform: translateY(-50%);
      z-index: 1;

      &_right {
        left: auto;
        right: calc(-1 * UiSpacing(2));
      }
    }

    &__action-panel {
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 1;
      transform: translateY(10%) translateX(-50%);
      max-width: 90%;
      min-width: UiSpacing(60);
      @include UiMediaPortrait() {
        width: 100%;
        min-width: auto;
        max-width: auto;
      }
    }

    &__lobby-card {
      &_is-active {
        opacity: 0.6;
        pointer-events: none;
      }
    }

    &__players-count {
      display: flex;
      align-items: center;
      justify-content: center;
      @include UiGap(2);
      @include UiTextShadow(2);
      @include UiTypographyHeading6();
    }
  }
</style>
