<template>
  <div class="about-page-left">
    <UiResponsiveImage src="/static/kwokka_logo.svg" alt="Kwokka GbR" class="about-page-left__company-logo" />
    <p v-html="$t('journal.about.companyParagraph')"></p>
    <p v-html="$t('journal.about.valuesParagraph')"></p>
    <UiButton class="ui-hide_landscape" type="secondary" @click="$emit('select', { id: 'about', label: '' })">
      {{ $t('journal.about.readMore') }}<UiIcon name="arrow-right" />
    </UiButton>
  </div>
</template>

<script lang="ts">
  import { UiButton, UiIcon, UiResponsiveImage } from '@/app/ui-kit';
  import { Component, Vue } from 'vue-facing-decorator';

  @Component({
    components: { UiResponsiveImage, UiIcon, UiButton },
    emits: ['select'],
  })
  export default class AboutPageLeft extends Vue {}
</script>

<style scoped lang="scss">
  .about-page-left {
    display: flex;
    flex-direction: column;
    @include UiGap(4);
    @include UiPadding(8, right);

    &__company-logo {
      width: 100%;
      @include UiDropShadow(1);
    }
  }
</style>
