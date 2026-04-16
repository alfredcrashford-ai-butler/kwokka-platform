<template>
  <label class="ui-textarea" :class="[widthClass, { 'ui-textarea_is-disabled': disabled }]">
    <span class="ui-textarea__label" v-if="label">{{ label }}</span>
    <textarea
      ref="textarea"
      class="ui-textarea__input"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="[
        {
          'ui-textarea__input_is-required': required,
          'ui-textarea__input_is-invalid': invalid,
        },
      ]"
      v-model="value"
      @focus="$emit('focus', $event)"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      @blur="$emit('blur', $event)"
    ></textarea>
  </label>
</template>

<script lang="ts">
  import { Component, Model, Prop, Ref, Vue } from 'vue-facing-decorator';

  export type UiTextareaWidth = 'fixed' | 'block';

  @Component({
    emits: ['focus', 'focus', 'keydown', 'keyup', 'blur'],
  })
  export default class UiTextarea extends Vue {
    private static readonly defaultInputWidth: UiTextareaWidth = 'fixed';

    @Ref()
    public textarea!: HTMLTextAreaElement;

    @Model()
    public value!: string;

    @Prop()
    public label?: string;

    @Prop()
    public width?: UiTextareaWidth;

    @Prop()
    public placeholder?: string;

    @Prop()
    public required?: boolean;

    @Prop({ default: false })
    public invalid!: boolean;

    @Prop()
    public readonly?: boolean;

    @Prop()
    public disabled?: boolean;

    public get widthClass(): string {
      const width = this.width || UiTextarea.defaultInputWidth;
      return `ui-textarea_width-${width}`;
    }

    public focus() {
      this.textarea.focus();
    }
  }
</script>

<style scoped lang="scss">
  .ui-textarea {
    display: flex;
    flex-direction: column;

    &_is-disabled {
      opacity: 0.45;
    }

    &_width-fixed {
      width: 100%;
      max-width: $grid-step * 72; // 288px
    }

    &_width-block {
      width: 100%;
    }

    &__input {
      @include UiInputAppearance();
      @include UiPadding(4, left);
      @include UiPadding(4, top);
      @include UiPadding(4, right);
      @include UiPadding(4, bottom);
      position: relative;
      width: 100%;
      display: block;
      resize: vertical;
      min-height: $grid-step * 30;

      &_is-invalid {
        @include UiTheme() {
          box-shadow: 0 0 0px 2px UiColor(negative);
        }
      }

      &_is-required {
        &::before {
          @include UiTypographyParagraph3();

          content: '*';

          position: absolute;
          left: UiGridSpacing(4);
          top: 50%;
          transform: translateY(-50%);

          display: block;
          width: fit-content;
          height: $grid-step * 3;
          line-height: 1;

          @include UiTheme() {
            color: UiColor(negative);
          }

          @include UiMediaMobile() {
            left: UiGridSpacing(2);
          }
        }
      }
    }

    &__label {
      @include UiFontWeight(semibold);
      @include UiMargin(2, bottom);
    }
  }
</style>
