<template>
  <ChangeableField
    class="locale-changeable-field"
    :value="$t(`language.${locale}`)"
    :label="$t('settings.languageLabel')"
    @changeClick="onChangeClick"
  >
    <UiDialog ref="dialog" :isPrimaryButtonShown="false" :isBackdropClickEnabled="!isLoading">
      <template v-slot:body>
        <UiButton
          v-for="supportedLocale in supportedLocales"
          :key="supportedLocale"
          class="locale-changeable-field__language-button"
          width="block"
          shade="accent"
          :disabled="locale === supportedLocale || isLoading"
          @click="onOptionSelect(supportedLocale)"
        >
          <UiIcon v-if="locale === supportedLocale" name="done" />
          {{ $t(`language.${supportedLocale}`) }}
        </UiButton>
      </template>
    </UiDialog>
  </ChangeableField>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Ref, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import ChangeableField from '@/app/components/ChangeableField.vue';
  import { TranslationLocales } from '@/service/translation/translation.service';

  @Component({
    components: {
      ChangeableField,
      UiButton,
      UiIcon,
      UiDialog,
    },
  })
  export default class LocaleChangeableField extends Vue {
    @Prop()
    public isLoading: boolean = false;

    @Prop()
    public locale: string;

    public supportedLocales = Object.values(TranslationLocales);

    @Ref()
    public dialog: UiDialog;

    public onChangeClick() {
      this.dialog.show();
    }

    @Emit('option-select')
    public onOptionSelect(locale: string): string {
      this.dialog.hide();
      return locale;
    }
  }
</script>

<style scoped lang="scss">
  .locale-changeable-field {
    &__language-button:not(:last-of-type) {
      @include UiMargin(3, bottom);
    }
  }
</style>
