<template>
  <div class="game">
    <div class="game__game-container" data-game-container ref="gameContainer"></div>

    <div class="game__profiles" v-if="isGameReady">
      <UserAvatar
        ref="userAvatars"
        v-for="(player, i) in lobbyPlayers"
        :key="player.id"
        :accountId="player.id"
        :config="player.config"
        @ready="onProfileReady(player, i)"
      />
    </div>

    <InteractionRenderer
      :gameInstance="gameInstance"
      :turnDuration="turnDuration"
      :playerId="playerId"
      :cardBack="cardBack"
      @interact="onInteract($event)"
      @open="game?.setInteractiveLock('interaction', true)"
      @close="game?.setInteractiveLock('interaction', false)"
    />

    <PauseRenderer
      :gameInstance="gameInstance"
      @open="game?.setInteractiveLock('pause', true)"
      @close="game?.setInteractiveLock('pause', false)"
    />

    <GameSettings
      data-game-settings
      @leave="$emit('leave', $event)"
      @open="game?.setInteractiveLock('settings', true)"
      @close="game?.setInteractiveLock('settings', false)"
    />

    <Transition>
      <GameLoader v-if="!isGameReady" />
    </Transition>

    <div class="game__fps-meter" id="fps-meter"></div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Ref, Watch, Prop, Provide } from 'vue-facing-decorator';
  import { GameInstanceEntityStatus } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { SoundService, TranslationService } from '@/service';
  import type { LobbyPlayer, PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import type { ArenaItemKey, CardBackItemKey, CardSkinItemKey } from '@/game-data/item-key';
  import { PwsmGame } from '@/game';
  import type { CardState } from '@/game-data/card';
  import { GameLoader, GameSettings, InteractionRenderer, PauseRenderer } from './components';
  import UserAvatar from '../UserAvatar.vue';

  @Component({
    components: {
      PauseRenderer,
      UserAvatar,
      InteractionRenderer,
      GameLoader,
      GameSettings,
    },
    emits: [
      'skipTurn',
      'interactCard',
      'skillClick',
      'playSkill',
      'playCard',
      'playCardInOthersTurn',
      'leave',
      'ready',
    ],
  })
  export default class Game extends Vue {
    public lobbyPlayers: LobbyPlayer[] = null;
    public profilesLoadedHandler: (result: Record<string, string>) => any;
    public isGameReady = false;
    private playCardSoundTimeout: number;
    public game: PwsmGame;

    @Ref()
    public gameContainer: HTMLElement;

    @Ref()
    public userAvatars: UserAvatar[];

    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public turnDuration: number;

    @Prop({ required: true })
    public playerId: string;

    @Prop({ default: null })
    public cardBack: CardBackItemKey;

    @Prop({ default: [] })
    @Provide()
    public cardSkins: CardSkinItemKey[];

    @Prop({ default: null })
    public arena: ArenaItemKey;

    @Prop({ default: {} })
    public connectivity: Record<string, boolean>;

    @LazyInject(SoundService)
    private soundService: SoundService;

    @LazyInject(TranslationService)
    private translationService: TranslationService;

    @Watch('gameInstance')
    public onGameInstanceChange(gameInstance: PwsmGameInstanceEntity) {
      this.game?.setGameState(gameInstance);
    }

    @Watch('turnDuration')
    public onTurnDurationChange(turnDuration: number): void {
      this.game?.setTurnDuration(turnDuration);
    }

    @Watch('gameInstance.state.publicState.turnEndAt')
    public onTurnEndAtChange(): void {
      this.game?.setTurnDuration(this.turnDuration);
    }

    @Watch('$i18n.locale')
    public async onLocaleChange(): Promise<void> {
      this.game?.setTranslations(await this.translationService.getCurrentLocaleMessages());
    }

    @Watch('connectivity')
    public async onConnectivityChange(connectivity: Record<string, boolean>): Promise<void> {
      this.game?.setConnectivity(connectivity);
    }

    @Watch('gameInstance.status')
    public onStatusChange(newStatus: GameInstanceEntityStatus, oldStatus: GameInstanceEntityStatus): void {
      if (newStatus !== oldStatus && newStatus === GameInstanceEntityStatus.Finished) {
        this.soundService.playGameEnd();
        this.soundService.playGameEndMusic();
      }
    }

    public mounted(): void {
      this.setupGame();
    }

    public beforeUnmount(): void {
      this.game.destroy();
      clearTimeout(this.playCardSoundTimeout);
      this.soundService.fadeOutGameMusic();
    }

    public async setupGame(): Promise<void> {
      this.lobbyPlayers = this.gameInstance.players;
      this.game = new PwsmGame(this.gameContainer, {
        items: {
          arena: this.arena,
          cardBack: this.cardBack,
          cardSkins: this.cardSkins,
        },
        gameInstance: this.gameInstance,
        translations: await this.translationService.getCurrentLocaleMessages(),
        playerId: this.playerId,
        turnDuration: this.turnDuration,
        onCardPlay: (cardState: CardState) => this.onCardPlay(cardState),
        onInteract: (data: any) => this.onInteract(data),
        onSkillPlay: (data: any) => this.onSkillPlay(data),
        onCardDraw: () => this.soundService.playCardDraw(),
        onCardStateChange: () => this.soundService.playCardEffect(),
        onSkillClick: () => this.onSkillClicked(),
        onSkillPlayed: () => this.onSkillPlayed(),
        onReady: () => this.onReady(),
        onSkipTurn: () => this.onSkipTurnClick(),
        onCardPlayed: () => this.onCardPlayed(),
        onSkillPlayCancel: () => this.onSkillPlayCancel(),
      });
    }

    private onCardPlay(card: CardState): void {
      if (this.gameInstance.isPlayersTurn(this.playerId)) {
        this.onDropCardInMyTurn(card);
      } else {
        this.onDropCardInOthersTurn(card);
      }
    }

    private onDropCardInMyTurn(card: CardState): void {
      if (this.gameInstance.canPlayCard(card)) {
        this.$emit('playCard', card);
      } else {
        this.soundService.playCardPlayFail();
      }
    }

    private onSkillPlayCancel(): void {
      this.soundService.playCardPlayFail();
    }

    private onDropCardInOthersTurn(card: CardState): void {
      if (this.gameInstance.canPlayCardInOthersTurn(card)) {
        this.$emit('playCardInOthersTurn', card);
      } else {
        this.soundService.playCardPlayFail();
      }
    }

    public onProfileReady(lobbyPlayer: LobbyPlayer, i: number): void {
      this.$nextTick(async () => {
        const ref = this.userAvatars[i];
        const texture = await ref.toPng();
        this.game.setProfileTexture(lobbyPlayer.id, texture);
      });
    }

    private onReady(): void {
      this.soundService.playGameStart();
      if (!this.gameInstance.isFinished) {
        this.soundService.playGameMusic();
      } else {
        this.soundService.playGameEndMusic();
      }
      this.isGameReady = true;
      this.$emit('ready');
    }

    private onCardPlayed(): void {
      // slight delay to align with animation
      this.playCardSoundTimeout = setTimeout(() => this.soundService.playCardPlay(), 250);
    }

    private onSkipTurnClick(): void {
      this.$emit('skipTurn');
    }

    private onInteract(data: any): void {
      this.$emit('interactCard', data);
    }

    private onSkillPlay(data: any): void {
      this.$emit('playSkill', data);
    }

    private onSkillClicked(): void {
      this.soundService.playMagicOverlay();
      this.$emit('skillClick');
    }

    private onSkillPlayed(): void {
      this.soundService.playSkillPlay();
    }
  }
</script>

<style scoped lang="scss">
  .game {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    user-select: none;
    background-color: UiColor(shade-900);

    &__fps-meter {
      position: fixed;
      right: 0;
      top: 0;
      font-size: 12px;
      font-family: monospace;
      opacity: 0.5;
    }

    &__game-container {
      width: 100%;
      height: 100%;
    }

    &__settings {
      position: absolute;
      left: UiSpacing(2);
      top: UiSpacing(2);
    }

    &__profiles {
      position: fixed;
      z-index: -1;
      width: 50%;
    }
  }
</style>
