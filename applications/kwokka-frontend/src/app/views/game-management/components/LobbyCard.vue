<template>
  <UiCard
    class="lobby-card"
    :style="{ backgroundImage: `url('/assets/games/lobbies/${lobby.key}/cover.webp')` }"
    @click="$emit('click', $event)"
  >
    <UiHeading class="lobby-card__title" size="4">{{ lobby.key }}</UiHeading>
  </UiCard>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { GameEntity, LobbyEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';

  @Component({
    components: {
      UiCard,
      UiHeading,
    },
    emits: ['click'],
  })
  export default class LobbyCard extends Vue {
    @Prop()
    public game: GameEntity;

    @Prop()
    public lobby: LobbyEntity;
  }
</script>

<style scoped lang="scss">
  .lobby-card {
    @include UiBorderRadius(md);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: flex-end;
    @include UiPadding(4);
    @include UiButtonAppearance();
    @include UiButtonStates();
    height: 100%;
    width: 100%;

    &__title {
      text-shadow: 0 0 4px rgba(#000, 0.75);
    }
  }
</style>
