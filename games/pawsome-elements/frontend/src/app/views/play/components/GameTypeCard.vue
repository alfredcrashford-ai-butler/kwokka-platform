<template>
  <ItemCard v-ui-sound class="game-type-card" :heading="heading" @click="$emit('click', $event)">
    <div class="game-type-card__content">
      <UiResponsiveImage class="game-type-card__image" :src="imageSrc" mode="cover" />
      <p class="game-type-card__caption">{{ caption }}</p>
    </div>
  </ItemCard>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import ItemCard from '@/app/components/ItemCard.vue';
  import UiResponsiveImage from '@/app/ui-kit/UiResponsiveImage.vue';

  @Component({
    emits: ['click'],
    components: {
      ItemCard,
      UiResponsiveImage,
    },
  })
  export default class GameTypeCard extends Vue {
    @Prop({ required: true })
    public heading: string;

    @Prop({ required: true })
    public caption: string;

    @Prop({ required: true })
    public imageSrc: string;
  }
</script>

<style scoped lang="scss">
  .game-type-card {
    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      @include UiGap(1);
    }

    &__image {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      @include UiBorderRadius(3);
      border: UiSpacing(1) solid UiColor(secondary-900);
      pointer-events: none;

      @include UiMediaPortrait() {
        height: 100%;
        width: auto;
        flex-grow: 1;
        flex-basis: 0;
      }
    }

    &__caption {
      @include UiTextShadow(2);
      @include UiTypographyHeading5();
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      @include UiMediaLandscape() {
        flex-grow: 1;
      }
    }
  }
</style>
