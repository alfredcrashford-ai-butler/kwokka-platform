<template>
  <div class="ui-switch-button">
    <UiButton
      class="ui-switch-button__item"
      :key="option.label"
      v-for="option in options"
      width="shrink"
      :size="size"
      :shape="shape"
      :type="value && getRawValue(value) === option.value ? 'primary' : 'secondary'"
      shade="accent"
      @click="value = option.value"
    >
      <UiIcon :size="size" :name="option.icon" v-if="option.icon"/>
      {{ option.label }}
    </UiButton>
  </div>
</template>

<script lang="ts">
  import { toRaw } from 'vue';
  import { Component, Model, Prop, Vue } from 'vue-facing-decorator';
  import UiButton, { type UiButtonSize, type UiButtonShape } from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  export interface UiSwitchButtonOption<T> {
    label: string;
    icon?: string;
    value: T;
  }

  @Component({
    components: {
      UiButton,
      UiIcon,
    },
  })
  export default class UiSwitchButton<T = any> extends Vue {

    @Prop({ type: String })
    public size?: UiButtonSize;

    @Prop({ type: String })
    public shape?: UiButtonShape;

    @Prop({ default: () => [] })
    public options: UiSwitchButtonOption<T>[];

    @Model()
    public value!: T;

    public getRawValue(value: T): T {
      return toRaw(value);
    }

  }
</script>

<style scoped lang="scss">
  .ui-switch-button {
    display: flex;
    align-items: stretch;
    width: 100%;

    &__item {
      flex-grow: 1;
      flex-basis: 0;
      &:not(:last-child) {
        &, &::after {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      &:not(:first-child) {
        &, &::after {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: none;
        }
      }
    }
  }
</style>
