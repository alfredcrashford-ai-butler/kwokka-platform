<template>
  <ItemCard v-ui-sound class="lobby-card" :heading="gameInstance.lobbySettings.name" @click="$emit('click', $event)">
    <div class="lobby-card__content">
      <div class="lobby-card__card-set">
        <UiResponsiveImage class="lobby-card__card-set-image" src="/static/card_set/standard.webp" mode="cover" />
        <p class="lobby-card__card-set-name">{{ $t('cardSet.standard.title') }}</p>
      </div>
      <div class="lobby-card__players-count">
        <UiIcon name="users" size="sm" />
        <span>{{ gameInstance.players?.length || 0 }} / {{ lobby.maxPlayers }}</span>
      </div>
    </div>
  </ItemCard>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiResponsiveImage from '@/app/ui-kit/UiResponsiveImage.vue';
  import ItemCard from '@/app/components/ItemCard.vue';
  import type { PwsmGameInstanceEntity } from '@/game-data/game-instance';
  import type { LobbyEntity } from '@kwokka/entities';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    emits: ['click'],
    components: {
      UiResponsiveImage,
      ItemCard,
      UiIcon,
    },
  })
  export default class LobbyCard extends Vue {
    @Prop({ required: true })
    public gameInstance: PwsmGameInstanceEntity;

    @Prop({ required: true })
    public lobby: LobbyEntity;
  }
</script>

<style scoped lang="scss">
  .lobby-card {
    z-index: 1;

    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      @include UiGap(1);
    }

    &__card-set {
      position: relative;
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
    }

    &__card-set-image {
      width: 100%;
      height: 100%;
      @include UiBorderRadius(2);
      border: UiSpacing(0.6) solid UiColor(secondary-900);
    }

    &__card-set-name {
      position: absolute;
      bottom: UiSpacing(2);
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 100%;
      @include UiTextShadow(2);
      @include UiTypographyHeading5();
    }

    &__players-count {
      display: flex;
      align-items: center;
      justify-content: center;
      @include UiGap(1);
      @include UiTextShadow(2);
      @include UiTypographyHeading6();
    }
  }
</style>
