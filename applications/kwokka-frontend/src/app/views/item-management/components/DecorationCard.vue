<template>
  <UiCard class="decoration-card" @click="$emit('click', decoration)">
    <UiResponsiveImage class="decoration-card__image" :src="decorationSrc" :alt="decoration.key" />
    <h3 class="decoration-card__heading">{{ decoration.key }}</h3>
    <p class="decoration-card__caption">{{ decoration.type }}</p>
  </UiCard>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { DecorationEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiResponsiveImage from '@/app/ui-kit/UiResponsiveImage.vue';

  @Component({
    components: {
      UiCard,
      UiResponsiveImage,
    },
    emits: ['click'],
  })
  export default class DecorationCard extends Vue {
    @Prop()
    public decoration: DecorationEntity;

    public get decorationSrc(): string {
      return `/assets/decorations/${this.decoration.type}/${this.decoration.key}.webp`;
    }
  }
</script>

<style scoped lang="scss">
  .decoration-card {
    position: relative;
    display: flex;
    flex-direction: column;
    @include UiGap(1, false);
    @include UiPadding(2, null, false);
    @include UiBorderRadius(md);
    @include UiButtonStates();
    @include UiButtonAppearance();

    &__image {
      @include UiBorderRadius(sm);
      width: 100%;
      aspect-ratio: 4/3;
      height: auto;
      background-color: rgba(#fff, 0.4);
    }

    &__heading {
      @include UiTypographyParagraph2();
      word-break: break-all;
    }

    &__caption {
      @include UiTypographyParagraph3();
      word-break: break-all;
      opacity: 0.65;
    }
  }
</style>
