<template>
  <div class="game-view">
    <component
      v-if="game && controller && lobby && controller.gameInstance?.hasPlayer(playerId)"
      :is="activeComponent"
      :game="game"
      :connection="connection"
      :controller="controller"
      :gameInstance="controller.gameInstance"
      :lobby="lobby"
      :playerId="playerId"
    ></component>
    <LoadingGameView v-else />

    <DisconnectDialog ref="disconnectDialog" @reconnect="onReconnect()" @toMainMenu="onMainMenuRedirect()" />
  </div>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { GameEntity, LobbyEntity } from '@kwokka/entities';
  import { DisconnectReasonCode, type DisconnectReason, type GameConnection } from '@kwokka/sdk-js';
  import { LazyInject } from '@/ioc';
  import { ErrorTrackerService, KwokkaService, LoggerService, NotificationService, SoundService } from '@/service';
  import { ErrorCode, RouteUtil } from '@/util';
  import { PwsmGameController, PwsmDisconnectReasonCode } from './controller';
  import { LobbyKey } from '@/game-data';
  import { PwsmGameInstanceEntity } from '@/game-data/game-instance/pwsm-game-instance.entity';
  import RoomGameView from './views/RoomGameView.vue';
  import PracticeGameView from './views/PracticeGameView.vue';
  import LoadingGameView from './views/LoadingGameView.vue';
  import QuickMatchGameView from './views/QuickMatchGameView.vue';
  import RankedMatchGameView from './views/RankedMatchGameView.vue';
  import DisconnectDialog from './components/DisconnectDialog.vue';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      DisconnectDialog,
      LoadingGameView,
    },
  })
  export default class GameView extends Vue {
    @Ref()
    public disconnectDialog: DisconnectDialog;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService: ErrorTrackerService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(SoundService)
    public soundService: SoundService;

    public activeComponent: typeof Vue = LoadingGameView;
    public controller: PwsmGameController = null;
    public connection: GameConnection;
    public game: GameEntity = null;
    public lobby: LobbyEntity = null;

    private componentsByLobbyKey = {
      [LobbyKey.Room]: markRaw(RoomGameView),
      [LobbyKey.Practice]: markRaw(PracticeGameView),
      [LobbyKey.QuickMatch]: markRaw(QuickMatchGameView),
      [LobbyKey.RankedMatch]: markRaw(RankedMatchGameView),
    };

    public get playerId(): string {
      return this.kwokkaService?.client?.profile?.myProfile?.accountId;
    }

    public mounted(): void {
      this.connect();
    }

    public beforeUnmount(): void {
      this.controller.setDisconnectHandler(null);
      this.connection?.close();
    }

    public onReconnect(): void {
      this.connect();
    }

    public onMainMenuRedirect(): void {
      this.navigateToMain();
    }

    private async connect(): Promise<void> {
      const gameInstance = await this.kwokkaService.client.game.getGameInstanceById(this.gameInstanceId);
      if (!gameInstance) {
        this.logger.error(`Could not fetch gameInstance, id: ${this.gameInstanceId}`);
        this.notificationService.show({ type: 'error', text: this.$t('game.unexpectedError') });
        this.navigateToMain();
      }

      const pwsmGameInstance = new PwsmGameInstanceEntity(gameInstance);

      const [game, lobby] = await Promise.all([
        this.kwokkaService.client.game.getGameById(pwsmGameInstance.gameId),
        this.kwokkaService.client.game.getLobbyById(pwsmGameInstance.lobbyId),
      ]);
      if (!game || !lobby) {
        this.logger.error(`Lobby or game not found for game instance, id: ${this.gameInstanceId}`);
        this.notificationService.show({ type: 'error', text: this.$t('game.unexpectedError') });
        this.navigateToMain();
      }

      this.controller = new PwsmGameController(
        pwsmGameInstance,
        this.logger,
        (code: string, message: string) => this.onError(code, message),
        (reason: DisconnectReason) => this.onDisconnected(reason),
      );
      this.connection = await this.kwokkaService.connect(this.controller, this.gameInstanceId);
      this.game = game;
      this.lobby = lobby;
      this.activeComponent = this.componentsByLobbyKey[lobby.key];
      if (!this.activeComponent) {
        this.logger.error(`Failed to find component for lobby: ${lobby.key}`);
        this.notificationService.show({ type: 'error', text: this.$t('game.unexpectedError') });
        this.navigateToMain();
      }
    }

    private get gameInstanceId(): string {
      return RouteUtil.getQueryParam(this.$route.params.id);
    }

    private onDisconnected(reason: DisconnectReason): void {
      if (reason.code === DisconnectReasonCode.Unknown) {
        this.errorTrackerService.captureMessage(
          `MainGameController disconnected due to unknown reason, message: ${reason.message}.`,
        );
      }

      // TODO: this throws error when leaving the game after finish
      if ([DisconnectReasonCode.ApplicationOffline, DisconnectReasonCode.Unknown].includes(reason.code as any)) {
        this.disconnectDialog.showWithReconnect(reason);
        return;
      }

      if (reason.code === PwsmDisconnectReasonCode.Leave) {
        return;
      }

      // TODO: this throws error when leaving the game after finish
      this.disconnectDialog.showWithoutReconnect(reason);
    }

    private onError(code: string, message: string): void {
      if ([ErrorCode.ForbiddenGameStatus, ErrorCode.Forbidden].includes(code as any)) {
        this.soundService.playUiFail();
        return;
      }

      this.errorTrackerService.captureMessage(`Error in MainGameController, code: ${code}, message: ${message}`);
      this.notificationService.showErrors([{ code, message } as any]);
    }

    private navigateToMain(): void {
      this.$router.replace({ name: RouteName.Main });
    }
  }
</script>

<style scoped lang="scss">
  .game-view {
    height: 100%;
    width: 100%;
  }
</style>
