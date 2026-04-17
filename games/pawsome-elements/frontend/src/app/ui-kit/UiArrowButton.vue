<template>
  <button
    v-ui-sound
    class="ui-arrow-button"
    :class="[`ui-arrow-button_size-${size}`, `ui-arrow-button_dir-${direction}`]"
    @click="$emit('click', $event)"
  ></button>
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
  export default class UiArrowButton extends Vue {
    @Prop({ default: 'right' })
    public direction: 'left' | 'right';

    @Prop({ default: 'md' })
    public size: 'sm' | 'md' | 'lg';
  }
</script>

<style scoped lang="scss">
  .ui-arrow-button {
    position: relative;
    @include UiButtonAppearance();
    flex-shrink: 0;

    &::before {
      content: '';
      background-image: url('/static/ui/arrow_button.webp');
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      @include UiDropShadow(1);
    }

    &_dir-left {
      &::before {
        transform: rotateY(180deg);
      }
    }

    &_size-sm {
      width: UiSpacing(5);
      height: UiSpacing(5);
    }

    &_size-md {
      width: UiSpacing(8);
      height: UiSpacing(8);
    }

    &_size-lg {
      width: UiSpacing(12);
      height: UiSpacing(12);
    }
  }
</style>
