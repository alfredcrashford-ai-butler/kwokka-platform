<template>
  <router-link :to="to" class="main-view-item ui-link-reset">
    <UiCard class="main-view-item__card">
      <UiIcon :name="iconName" class="main-view-item__icon ui-hide_mobile" size="xl" />
      <UiIcon :name="iconName" class="main-view-item__icon ui-hide_tablet-up" size="lg" />
      <span class="main-view-item__text">{{ text }}</span>
    </UiCard>
  </router-link>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiCard,
      UiIcon,
    },
  })
  export default class MainViewItem extends Vue {
    @Prop({ required: true })
    public to: string;

    @Prop({ required: true })
    public iconName: string;

    @Prop({ required: true })
    public text: string;
  }
</script>

<style scoped lang="scss">
  .main-view-item {
    transition: transform UiTransition(bounce) 300ms;
    text-align: center;

    &:hover,
    &:focus-visible {
      transform: scale(1.02);
      filter: brightness(1.15);

      .main-view-item__card {
        border-color: var(--main-view-item-bg-color2);
      }

      .main-view-item__card::before {
        left: 125%;
        transition:
          left ease 300ms,
          opacity linear 200ms;
        opacity: 0;
      }
    }

    &__card {
      position: relative;
      @include UiPadding(6);
      @include UiGap(3);
      height: $grid-step * 50;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      transition: border-color ease 300ms;

      background: linear-gradient(
        225deg,
        var(--main-view-item-bg-color1) var(--main-view-item-bg-offset1),
        var(--main-view-item-bg-color2) var(--main-view-item-bg-offset2)
      );

      @include UiMediaMobile() {
        height: $grid-step * 30;
      }

      &::before {
        content: '';
        position: absolute;
        height: 100%;
        width: 50%;
        left: -75%;
        top: 0;
        transform: skewX(-20deg);
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 70%,
          rgba(255, 255, 255, 0) 100%
        );
      }
    }

    &__text {
      @include UiTypographyHeading5();
    }
  }
</style>
