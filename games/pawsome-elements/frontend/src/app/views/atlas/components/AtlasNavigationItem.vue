<template>
  <div class="atlas-navigation-item" v-ui-sound @click="$emit('click', $event)">
    <UiResponsiveImage class="atlas-navigation-item__image" :src="imageUrl" mode="contain" :alt="caption" />
    <h2 class="atlas-navigation-item__caption">{{ caption }}</h2>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import CaptionPanel from '@/app/components/CaptionPanel.vue';
  import { UiResponsiveImage } from '@/app/ui-kit';

  @Component({
    components: {
      CaptionPanel,
      UiResponsiveImage,
    },
    emits: ['click'],
  })
  export default class AtlasNavigationItem extends Vue {
    @Prop({ required: true })
    public caption: string;

    @Prop({ required: true })
    public imageUrl: string;
  }
</script>

<style scoped lang="scss">
  .atlas-navigation-item {
    position: relative;
    @include UiBorderRadius(5);
    @include UiButtonAppearance();
    background: UiColor(primary-400) linear-gradient(UiColor(shade-900, 0.6), UiColor(shade-900, 0.3));
    display: flex;
    flex-direction: column;
    align-items: center;
    @include UiPadding(3);
    @include UiBoxShadow(3);

    &__image {
      width: 90%;
      flex-grow: 1;
      pointer-events: none;
    }

    &__caption {
      flex-shrink: 0;
      @include UiTextShadow(2);
      @include UiTypographyHeading6();
      text-align: center;
    }

    &::before {
      content: '';
      position: absolute;
      width: calc(100% + UiSpacing(0.5));
      height: calc(100% + UiSpacing(0.5));
      top: calc(-0.5 * UiSpacing(0.5));
      left: calc(-0.5 * UiSpacing(0.5));
      z-index: 1;
      pointer-events: none;
      border-style: solid;
      border-image-source: url('/static/ui/frame_1.webp');
      border-image-slice: 28;
      border-width: UiSpacing(4);
    }
  }
</style>
