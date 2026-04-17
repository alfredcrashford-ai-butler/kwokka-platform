<template>
  <button
    v-ui-sound
    class="ui-circle-button"
    :class="[`ui-circle-button_size-${size}`]"
    @click="$emit('click', $event)"
  >
    <UiIcon class="ui-circle-button__icon" :name="icon" :size="size" />
  </button>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiIcon from './UiIcon.vue';

  @Component({
    components: {
      UiIcon,
    },
    emits: ['click'],
  })
  export default class UiCircleButton extends Vue {
    @Prop({ required: true })
    public icon: string;

    @Prop({ default: 'md' })
    public size: 'sm' | 'md' | 'lg';
  }
</script>

<style scoped lang="scss">
  .ui-circle-button {
    position: relative;
    @include UiButtonAppearance();
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 0;
    color: UiColor(shade-100);

    &::before {
      content: '';
      height: 100%;
      aspect-ratio: 176 / 153.5;
      background-image: url('/static/ui/button_circle.webp');
      background-size: 100% 100%;
      z-index: 0;
      position: absolute;
      right: 0;
      top: 0;
      @include UiDropShadow(1);
    }

    &__icon {
      position: relative;
      z-index: 1;
    }

    &_size-sm {
      width: UiSpacing(6);
      height: UiSpacing(6);
    }

    &_size-md {
      width: UiSpacing(10);
      height: UiSpacing(10);
    }

    &_size-lg {
      width: UiSpacing(15);
      height: UiSpacing(15);
    }
  }
</style>
