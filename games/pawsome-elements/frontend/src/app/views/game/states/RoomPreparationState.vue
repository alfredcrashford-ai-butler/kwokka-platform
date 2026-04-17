<template>
  <MenuLayout>
    <div class="room-preparation-state">
      <TitleCard
        :heading="gameInstance.lobbySettings.name"
        class="room-preparation-state__card"
        @backClick="onBackClick()"
      >
        <div class="room-preparation-state__card-content">
          <div class="room-preparation-state__card-set ui-hide_landscape">
            <UiResponsiveImage
              class="room-preparation-state__card-set-image"
              src="/static/card_set/standard.webp"
              mode="cover"
            />
            <ActionPanel class="room-preparation-state__card-set-name" size="sm">
              <span class="room-preparation-state__card-set-name-text">
                {{ $t('cardSet.title') }}: {{ $t(`cardSet.${gameInstance.lobbySettings.cardSet}.title`) }}
              </span>
            </ActionPanel>
          </div>
          <div class="room-preparation-state__main-section">
            <div class="room-preparation-state__players">
              <div class="room-preparation-state__player" v-for="player in players" :key="player.id">
                <UserAvatar :accountId="player.id" :config="player.config" />
                <UiCircleButton
                  v-if="isPlayerHost && player.id !== gameInstance.lobbySettings.hostAccountId"
                  class="room-preparation-state__player-kick-button"
                  icon="x"
                  size="sm"
                  @click="kickDialog.show(player.id)"
                />
              </div>
              <div
                class="room-preparation-state__player"
                v-for="n in lobby.maxPlayers - (players?.length || 0)"
                :key="n"
              >
                <div class="room-preparation-state__player-empty">
                  <CaptionPanel>
                    <span class="room-preparation-state__player-empty-text">{{
                      $t('game.roomPreparation.emptySlot')
                    }}</span>
                  </CaptionPanel>
                </div>
              </div>
            </div>
            <UiButton v-if="isPlayerHost" type="secondary" @click="onAddBotClick()" :disabled="!canAddBot">{{
              $t('game.roomPreparation.addBot')
            }}</UiButton>
          </div>
          <UiDivider class="ui-hide_portrait" direction="vertical" />
          <div class="room-preparation-state__info">
            <div class="room-preparation-state__card-set ui-hide_portrait">
              <UiResponsiveImage
                class="room-preparation-state__card-set-image"
                src="/static/card_set/standard.webp"
                mode="cover"
              />
              <ActionPanel class="room-preparation-state__card-set-name" size="sm">
                <span class="room-preparation-state__card-set-name-text">
                  {{ $t('cardSet.title') }}: {{ $t(`cardSet.${gameInstance.lobbySettings.cardSet}.title`) }}
                </span>
              </ActionPanel>
            </div>
            <div class="room-preparation-state__settings">
              <span class="room-preparation-state__settings-row">
                {{ $t('game.roomPreparation.invitationLinkCaption') }}
              </span>

              <div class="room-preparation-state__settings-row">
                <UiInput :readonly="true" :modelValue="invitationLinkDisplay" />
                <UiButton type="secondary" @click="onCopyClick()">
                  {{ $t('game.roomPreparation.copy') }}
                  <UiIcon name="copy" />
                </UiButton>
              </div>

              <UiSwitch
                v-if="isPlayerHost"
                orientation="horizontal"
                class="room-preparation-state__settings-row"
                :label="$t('game.roomPreparation.hostPrivateLabel')"
                :modelValue="gameInstance.lobbySettings.visibility === 'private'"
                @update:modelValue="onPrivateUpdate($event)"
              />
              <span class="room-preparation-state__settings-row" v-else>
                {{ $t('game.roomPreparation.visibility') }}:
                {{ $t(`game.roomPreparation.${gameInstance.lobbySettings.visibility}`) }}
              </span>
            </div>

            <p class="room-preparation-state__settings-row">
              <span>{{ $t('game.roomPreparation.min') }}</span>
              <UiIcon name="users" />
              <span>
                <span :class="{ 'room-preparation-state__entry_red': players.length < lobby.minPlayers }">
                  {{ players.length }}
                </span>
                <span>/{{ lobby.minPlayers }}</span>
              </span>
            </p>

            <CardActionSection
              :buttonText="$t(`game.roomPreparation.${isPlayerHost ? 'hostSubmit' : 'guestSubmit'}`)"
              :buttonDisabled="isStartDisabled"
              :buttonTooltip="startButtonTooltip"
              @buttonClick="onStartClick()"
            />
          </div>
        </div>
      </TitleCard>
    </div>

    <KickPlayerDialog v-if="isPlayerHost" ref="kickDialog" @confirm="onKickConfirm($event)" />

    <UiDialog
      ref="leaveDialog"
      :title="$t('game.roomPreparation.leaveDialog.title')"
      :text="$t('game.roomPreparation.leaveDialog.text')"
      :primaryButtonText="$t('game.roomPreparation.leaveDialog.primaryButtonText')"
      :secondaryButtonText="$t('game.roomPreparation.leaveDialog.secondaryButtonText')"
      @primaryButtonClick="onLeaveConfirm()"
    />
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Watch } from 'vue-facing-decorator';
  import { MenuLayout, TitleCard, ActionPanel, UserAvatar, CaptionPanel, CardActionSection } from '@/app/components';
  import type { LobbyPlayer, PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import { ClipboardUtil } from '@/util';
  import { LazyInject } from '@/ioc';
  import { NotificationService, SoundService } from '@/service';
  import { CommonGameComponent, KickPlayerDialog } from '../components';
  import {
    UiResponsiveImage,
    UiButton,
    UiSwitch,
    UiCircleButton,
    UiDialog,
    UiDivider,
    UiIcon,
    UiInput,
  } from '@/app/ui-kit';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      MenuLayout,
      TitleCard,
      UiResponsiveImage,
      ActionPanel,
      UserAvatar,
      CaptionPanel,
      CardActionSection,
      UiSwitch,
      UiInput,
      UiIcon,
      UiButton,
      UiDialog,
      UiCircleButton,
      UiDivider,
      KickPlayerDialog,
    },
  })
  export default class RoomPreparationState extends CommonGameComponent {
    @Ref()
    public leaveDialog: UiDialog;

    @Ref()
    public kickDialog: KickPlayerDialog;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(SoundService)
    private soundService: SoundService;

    @Prop({ required: true })
    declare public gameInstance: PwsmGameInstanceEntity;

    public created(): void {
      this.soundService.playMenuMusic();
    }

    @Watch('gameInstance.lobbySettings.visibility')
    public onVisibilityChange(newValue: 'public' | 'private'): void {
      if (this.isPlayerHost) {
        this.notificationService.show({
          type: 'info',
          text: this.$t(`game.roomPreparation.visibilityChanged.${newValue}`),
        });
      }
    }

    @Watch('playerCount')
    public onPlayerCountChange(newValue: number, oldValue: number): void {
      if (newValue > oldValue) {
        this.soundService.playPlayerRoomJoin();
      } else {
        this.soundService.playPlayerRoomLeave();
      }
    }

    public get invitationLinkDisplay(): string {
      return location.href.replace(/^https*-?:\/\//g, '');
    }

    public get players(): LobbyPlayer[] {
      return this.gameInstance.players;
    }

    public get isStartDisabled(): boolean {
      return this.players.length < this.lobby.minPlayers || !this.isPlayerHost;
    }

    public get startButtonTooltip(): string {
      if (!this.isPlayerHost) {
        return this.$t('game.roomPreparation.guestTooltip');
      }

      if (this.playerCount < this.lobby.minPlayers) {
        return this.$t('game.roomPreparation.hostTooltip', { n: this.lobby.minPlayers });
      }

      return null;
    }

    public get canAddBot(): boolean {
      return this.players.length < this.lobby.maxPlayers;
    }

    public onBackClick(): void {
      this.leaveDialog.show();
    }

    public onAddBotClick(): void {
      this.controller.sendAddBotAction();
    }

    public onKickConfirm(playerId: string): void {
      this.controller.sendKickPlayerAction(playerId);
    }

    public onStartClick(): void {
      this.controller.sendStartGameAction();
    }

    public onLeaveConfirm(): void {
      // this.controller.sendLeaveAction();
      this.$router.replace({ name: RouteName.Lobby });
    }

    public onCopyClick(): void {
      ClipboardUtil.copyTextToClipboard(location.href);
      this.notificationService.show({ type: 'info', text: this.$t('general.copied') });
    }

    public onPrivateUpdate(isPrivate: boolean): void {
      this.controller.sendUpdateRoomVisibilityAction(isPrivate);
    }
  }
</script>

<style scoped lang="scss">
  .room-preparation-state {
    width: 100%;
    height: 100%;

    &__card {
      height: 100%;
      max-height: 100%;
    }

    &__card-content {
      display: flex;
      width: 100%;
      height: 100%;

      @include UiMediaPortrait() {
        flex-direction: column;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      flex-basis: 40%;

      @include UiMediaPortrait() {
        flex-basis: unset;
        flex-grow: 1;
      }
    }

    &__card-set {
      display: flex;
      position: relative;
      @include UiMargin(4, bottom);
    }

    &__card-set-image {
      width: 100%;
      max-height: UiSpacing(90);
      height: auto;
      aspect-ratio: 16 / 9;
      pointer-events: none;
    }

    &__card-set-name {
      position: absolute;
      left: 50%;
      bottom: 0;
      @include UiTypographyHeading5();
      width: calc(100% + UiSpacing(6));
      transform: translateX(-50%) translateY(50%);
      z-index: 1;
    }

    &__card-set-name-text {
      @include UiTextShadow(3);
    }

    &__main-section {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      @include UiGap(4);
      @include UiMediaPortrait() {
        width: 100%;
      }

      @include UiMediaLandscape() {
        flex-grow: 1;
      }
    }

    &__players {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: fit-content;
      align-self: center;
      @include UiGap(4);
      @include UiPadding(4);
      width: 100%;
    }

    &__player {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__player-empty {
      width: 100%;
      aspect-ratio: 3;
      @include UiTypographyHeading6();
      @include UiPadding(4, left);
      @include UiPadding(4, right);
      @include UiPadding(2, top);
      @include UiPadding(2, bottom);

      > * {
        width: 100%;
        height: 100%;
        @include UiBoxShadow(2);
      }
    }

    &__player-empty-text {
      @include UiTextShadow(2);
    }

    &__settings {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      @include UiGap(2);
      align-self: center;
      align-items: center;
      @include UiPadding(1, left);
      @include UiPadding(1, right);

      @include UiMediaPortrait() {
        flex-grow: 1;
        flex-shrink: 0;
      }
    }

    &__settings-row {
      display: flex;
      align-items: center;
      justify-content: center;
      @include UiGap(1);
      @include UiTextShadow(2);
      text-align: center;
      @include UiTypographyHeading6();
    }

    &__player-kick-button {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      transform: translateX(25%) translateY(-25%);
    }

    &__entry {
      &_red {
        color: UiColor(negative-500);
      }
    }
  }
</style>
