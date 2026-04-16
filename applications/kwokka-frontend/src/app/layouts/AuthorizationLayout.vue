<template>
  <div class="authorization-layout">
    <header class="authorization-layout__centered-block">
      <UiLogo class="authorization-layout__logo" size="sm" />
    </header>

    <main class="authorization-layout__main">
      <slot></slot>
    </main>

    <footer class="authorization-layout__centered-block">
      <UiButton type="transparent" ref="languageButton">
        {{ $t(`language.${locale}`) }}
      </UiButton>
      <UiMenu
        class="authorization-layout__language-menu"
        v-if="languageButtonElement"
        :triggerElement="languageButtonElement"
        side="bottom"
        ref="languageMenu"
      >
        <UiButton
          v-for="supportedLocale in supportedLocales"
          :key="supportedLocale"
          width="block"
          type="transparent"
          shape="sharp"
          :disabled="locale === supportedLocale"
          @click="onOptionSelect(supportedLocale)"
        >
          <UiIcon v-if="locale === supportedLocale" name="done" />
          {{ $t(`language.${supportedLocale}`) }}
        </UiButton>
      </UiMenu>
    </footer>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { TranslationLocales, TranslationService } from '@/service/translation/translation.service';
  import UiMenu from '@/app/ui-kit/UiMenu.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiLogo from '@/app/ui-kit/UiLogo.vue';

  @Component({
    components: {
      UiButton,
      UiMenu,
      UiIcon,
      UiLogo,
    },
  })
  export default class AuthorizationLayout extends Vue {
    @Ref() public languageButton: UiButton;

    @Ref() public languageMenu: UiMenu;

    @LazyInject(TranslationService)
    private translationService: TranslationService<any>;

    public languageButtonElement: Element = null;

    public supportedLocales = Object.values(TranslationLocales);

    public locale = null;

    public mounted() {
      this.languageButtonElement = this.languageButton.$el;
      this.locale = this.translationService.getSavedLocale();
    }

    public async onOptionSelect(locale: string) {
      await this.translationService.setAndSaveLocale(locale);
      this.locale = locale;
      this.languageMenu.close();
    }
  }
</script>

<style scoped lang="scss">
  .authorization-layout {
    @include UiBackgroundPattern();
    min-height: 100%;
    display: flex;
    flex-direction: column;

    &__main {
      @include UiPadding(4, left);
      @include UiPadding(4, right);
      @include UiPadding(10, top);
      @include UiPadding(10, bottom);

      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      flex-grow: 1;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }

    &__centered-block {
      @include UiPadding(2, top);
      @include UiPadding(2, bottom);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__language-menu {
      min-width: $grid-step * 70;
      @include UiPadding(4, top);
      @include UiPadding(4, bottom);
    }
  }
</style>
