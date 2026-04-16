<template>
  <label class="ui-radio-container" @click="onClick()">
    <input
      class="ui-radio"
      type="radio"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      :name="name"
    />

    <span v-if="$slots.default" class="ui-radio-label">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
  import { Component, Prop, Emit, Model, Vue } from 'vue-facing-decorator';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiIcon,
    },
  })
  export default class UiRadio<T> extends Vue {

    @Prop() public isDisabled: boolean;

    @Prop() public name: string;

    @Prop() public value: T;

    @Model() public model: T;

    public get isChecked() {
      return this.model === this.value;
    }

    public get internalModel() {
      return this.value;
    }

    public set internalModel(value: T) {
      this.onChange(value);
    }

    public onClick() {
      if (!this.isDisabled) {
        this.onChange(this.value);
      }
    }

    @Emit('change')
    public onChange(value: T): T {
      return value;
    }

  }
</script>

<style scoped lang="scss">
  .ui-radio-container {
    display: flex;
    align-items: center;
    width: fit-content;
    cursor: pointer;
  }

  .ui-radio-label {
    display: block;
    @include UiMargin(3, left);
  }

  .ui-radio {
    @include UiButtonAppearance();
    @include UiButtonStates();

    $size: $grid-step * 5;
    $transition-speed: 75ms;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: $size;
    height: $size;
    flex-shrink: 0;

    border-radius: $size / 2;
    appearance: none;

    @include UiTheme() {
      border: 1px solid UiColor(yellow-500);
      background-color: UiColor(shade-900);
    }

    &::before {
      content: "";
      position: absolute;
      width: calc(100% - #{$grid-step * 1.5});
      height: calc(100% - #{$grid-step * 1.5});
      border-radius: 50%;

      opacity: 0;
      visibility: hidden;
      transform: scale(0.8);

      pointer-events: none;

      transition-duration: $transition-speed;
      transition-property: transform opacity visibility;
      transition-timing-function: UiTransition() linear linear;

      @include UiTheme() {
        background-color: UiColor(yellow-500);
      }

    }

    &:checked {
      @include UiTheme() {
        border-color: UiColor(yellow-500);
      }

      &::before {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }
    }

    &:disabled {
      cursor: auto;
      pointer-events: none;
      opacity: 0.45;
    }

  }
</style>
