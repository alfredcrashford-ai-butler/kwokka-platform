<template>
  <label
    class="ui-simple-select"
    :class="[
      widthClass,
      {
        'ui-simple-select_is-disabled': disabled,
      },
    ]"
  >
    <span class="ui-simple-select__label" v-if="label">
      {{ label }}
      <span v-if="required" class="ui-simple-select__required-indicator">*</span>
    </span>
    <select class="ui-simple-select__select" :placeholder="placeholder" v-model="value" :disabled="disabled">
      <option disabled :value="null">{{ placeholder }}</option>
      <option v-for="option in options" :value="option" :key="labelKey ? option[labelKey] : option">
        {{ labelKey ? option[labelKey] : option }}
      </option>
    </select>
  </label>
</template>

<script lang="ts">
  import { Component, Model, Prop, Vue } from 'vue-facing-decorator';

  export type UiSimpleSelectWidth = 'fixed' | 'block';

  const DEFAULT_WIDTH = 'fixed';

  @Component
  export default class UiSimpleSelect<T> extends Vue {
    @Prop()
    public options: T[];

    @Model()
    public value: T;

    @Prop()
    public placeholder?: string;

    @Prop({ default: false })
    public disabled?: boolean;

    @Prop({ default: false })
    public required?: boolean;

    @Prop({ default: 'fixed' })
    public width?: string;

    @Prop({ default: null })
    public labelKey?: string;

    @Prop({ default: null })
    public label?: string;

    public get widthClass(): string {
      const width = this.width || DEFAULT_WIDTH;
      return `ui-simple-select_width-${width}`;
    }
  }
</script>

<style lang="scss" scoped>
  .ui-simple-select {
    display: flex;
    flex-direction: column;

    &_width-fixed {
      width: 100%;
      max-width: $grid-step * 72; // 288px
    }

    &_width-block {
      width: 100%;
    }

    &_is-disabled {
      opacity: 0.45;
    }

    &__label {
      @include UiFontWeight(semibold);
      @include UiMargin(2, bottom);
    }

    &__select {
      @include UiInputAppearance();
    }

    &__required-indicator {
      @include UiTheme() {
        color: UiColor(negative);
      }
    }
  }
</style>
