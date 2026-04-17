<template>
  <div class="authorization-layout">
    <div class="authorization-layout__container">
      <main class="authorization-layout__main">
        <slot></slot>
      </main>

      <footer class="authorization-layout__footer">
        <UiSimpleSelect
          :options="options"
          labelKey="label"
          :modelValue="selectedOption"
          @update:modelValue="onOptionSelect($event)"
        />
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { TranslationLocale, TranslationService } from '@/service';
  import { UiIcon, UiSimpleSelect } from '@/app/ui-kit';

  type LocaleOption = { label: string; value: string };

  @Component({
    components: {
      UiIcon,
      UiSimpleSelect,
    },
  })
  export default class AuthorizationLayout extends Vue {
    @LazyInject(TranslationService)
    private translationService: TranslationService;

    public options: LocaleOption[] = [];
    public selectedOption: LocaleOption = null;

    public mounted(): void {
      this.selectedOption = this.getLocaleOption(this.translationService.getSavedLocale());
      this.options = Object.values(TranslationLocale).map((locale) => this.getLocaleOption(locale));
    }

    public async onOptionSelect(option: LocaleOption): Promise<void> {
      if (this.selectedOption?.value === option.value) {
        return;
      }

      await this.translationService.setAndSaveLocale(option.value);
      this.selectedOption = this.getLocaleOption(option.value);
    }

    private getLocaleOption(locale: string): LocaleOption {
      return { label: this.$t(`language.${locale}`), value: locale };
    }
  }
</script>

<style lang="scss">
  .authorization-layout {
    --pwsm--spacing-unit: 4px;
    --pwsm--font-size: 16px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @include UiTavernBackground();

    &__container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }

    &__main {
      @include UiPadding(1, left);
      @include UiPadding(1, right);
      @include UiPadding(24, top);
      @include UiPadding(24, bottom);

      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      flex-grow: 1;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }

    &__footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      @include UiPadding(1, top);
      @include UiPadding(1, bottom);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
