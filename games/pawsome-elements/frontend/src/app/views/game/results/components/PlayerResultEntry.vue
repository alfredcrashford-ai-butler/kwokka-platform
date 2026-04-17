<template>
  <div class="player-result-entry">
    <div class="player-result-entry__avatar">
      <template v-if="index === 1">
        <div class="player-result-entry__wing player-result-entry__wing_left"></div>
        <div class="player-result-entry__wing player-result-entry__wing_right"></div>
      </template>

      <UserAvatarImage :accountId="playerId" :imageKey="imageKey" />

      <div class="player-result-entry__index" :data-index="index">
        <div class="player-result-entry__index-text">{{ index }}</div>
      </div>
    </div>

    <div class="player-result-entry__name" :data-index="index">
      <span v-if="name">{{ name }}</span>
      <UserAvatarName :accountId="playerId" v-else />
      <span v-if="isCurrentPlayer">{{ $t('general.you') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance/pwsm-game-instance.entity';
  import { UserAvatarImage, UserAvatarName } from '@/app/components';
  import { DecorationEntityType } from '@kwokka/entities';
  import type { ProfileConfig } from '@/game-data/game-instance';

  @Component({
    components: {
      UserAvatarImage,
      UserAvatarName,
    },
  })
  export default class PlayerResultEntry extends Vue {
    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public playerId: string;

    @Prop({ required: true })
    public index: number;

    @Prop({ default: false })
    public isCurrentPlayer: boolean;

    public get isWon(): boolean {
      return this.index === 1;
    }

    public get cards(): number {
      return this.gameInstance.state.publicState.playerCardCount[this.playerId];
    }

    public get botConfig(): ProfileConfig {
      return this.gameInstance.getBotConfig(this.playerId);
    }

    public get name(): string {
      return this.botConfig?.name;
    }

    public get imageKey(): string {
      return this.botConfig?.decorations?.[DecorationEntityType.Image];
    }
  }
</script>

<style scoped lang="scss">
  .player-result-entry {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: fit-content;
    flex-direction: column;

    &__avatar {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
    }

    &__index {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 1;
      background-image: url('/static/ui/medal/medal.webp');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      width: 40%;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      &[data-index='1'] {
        background-image: url('/static/ui/medal/medal_gold.webp');
      }

      &[data-index='2'] {
        background-image: url('/static/ui/medal/medal_silver.webp');
      }

      &[data-index='3'] {
        background-image: url('/static/ui/medal/medal_bronze.webp');
      }
    }

    &__index-text {
      @include UiTypographyParagraph2();
      color: rgba(0, 0, 0, 0.5);
    }

    &__wing {
      position: absolute;
      background-image: url('/static/ui/wing.webp');
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      height: 90%;
      aspect-ratio: 71/75;

      &_left {
        left: -25%;
        bottom: 0;
        transform: rotateY(180deg);
      }

      &_right {
        right: -25%;
        bottom: 0;
      }
    }

    &__name {
      @include UiTextShadow(2);
      text-align: center;
      white-space: nowrap;

      &[data-index='1'] {
        color: UiColor('gold');
      }

      &[data-index='2'] {
        color: UiColor('silver');
      }

      &[data-index='3'] {
        color: UiColor('bronze');
      }
    }
  }
</style>
