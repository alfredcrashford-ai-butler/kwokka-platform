<template>
  <router-link class="ui-link-reset" :to="`/games-management/${game.id}`">
    <UiCard class="game-card" :style="{ backgroundImage: `url('/assets/games/${game.key}/cover.webp')` }">
      <UiHeading class="game-card__title" size="4">{{ game.key }}</UiHeading>
    </UiCard>
  </router-link>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { GameEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';

  @Component({
    components: {
      UiCard,
      UiHeading,
    },
  })
  export default class GameCard extends Vue {
    @Prop()
    public game: GameEntity;
  }
</script>

<style scoped lang="scss">
  .game-card {
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
