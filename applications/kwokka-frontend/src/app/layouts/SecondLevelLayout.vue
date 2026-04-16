<template>
  <div class="second-level-layout">
    <UiHeader>
      <div class="second-level-layout__header-container">
        <a
          class="ui-link-reset second-level-layout__back"
          :href="backUrl"
          title="Go back"
          @click="onBackClick"
          v-if="backUrl"
        >
          <UiButton type="transparent" aria-label="Back" width="shrink">
            <UiIcon name="arrow-left" />
          </UiButton>
        </a>

        <h1 class="second-level-layout__heading" v-if="title">
          {{ title }}
        </h1>
      </div>
    </UiHeader>

    <main class="second-level-layout__main">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiHeader from '@/app/ui-kit/UiHeader.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiHeader,
      UiButton,
      UiIcon,
    },
  })
  export default class SecondLevelLayout extends Vue {
    @Prop({ default: null })
    public title: string;

    @Prop({ default: null })
    public backUrl: string;

    @Prop()
    public onBeforeBackClick: () => boolean;

    public onBackClick(event: Event) {
      event.preventDefault();
      let shouldGoBack = true;
      if (this.onBeforeBackClick) {
        shouldGoBack = this.onBeforeBackClick();
      }

      event.preventDefault();

      if (shouldGoBack) {
        this.$router.replace(this.backUrl);
      }
    }
  }
</script>

<style scoped lang="scss">
  .second-level-layout {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    @include UiBackgroundPattern();

    &__main {
      @include UiLayout();
      @include UiPadding(8, top);
      @include UiPadding(8, bottom);

      flex-grow: 1;
    }

    &__back {
      @include UiMargin(6, right);
    }

    &__header-container {
      width: 100%;
      display: flex;
      align-items: center;
    }

    &__heading {
      @include UiTypographyHeading3();
      @include UiFontWeight(bold);
    }
  }
</style>
