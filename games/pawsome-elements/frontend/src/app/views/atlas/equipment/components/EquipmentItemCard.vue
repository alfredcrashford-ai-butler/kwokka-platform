<template>
  <div
    class="equipment-item-card"
    :class="{
      'equipment-item-card_is-selected': isSelected,
      'equipment-item-card_is-disabled': isDisabled,
    }"
    v-ui-sound
    @click="$emit('click', $event)"
  >
    <div class="equipment-item-card__container">
      <slot></slot>
    </div>
    <p class="equipment-item-card__name">{{ name }}</p>
    <UiIcon class="equipment-item-card__equipped-icon" name="check" v-if="isEquipped" />
    <UiIcon class="equipment-item-card__locked-icon" name="lock" v-if="isDisabled" size="xl" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UiIcon } from '@/app/ui-kit';

  @Component({
    components: {
      UiIcon,
    },
    emits: ['click'],
  })
  export default class EquipmentItemCard extends Vue {
    @Prop({ required: true })
    public name: string;

    @Prop({ default: false })
    public isSelected: boolean;

    @Prop({ default: false })
    public isEquipped: boolean;

    @Prop({ default: false })
    public isDisabled: boolean;
  }
</script>

<style scoped lang="scss">
  .equipment-item-card {
    position: relative;
    @include UiButtonAppearance();
    @include UiBorderRadius(4);
    transition:
      box-shadow ease 200ms,
      transform ease 200ms;

    &__container {
      position: relative;
      width: 100%;
      height: 100%;
      border: UiSpacing(0.5) solid UiColor(secondary-100);
      background-color: UiColor(secondary-900, 0.5);
      @include UiBorderRadius(4);
      @include UiPadding(2);
    }

    &_is-disabled {
      pointer-events: none;
      > .equipment-item-card__container {
        filter: brightness(0.4);
      }
    }

    &_is-selected {
      box-shadow: 0 0 UiSpacing(2) 0 UiColor(shade-100);
      transform: scale(1.02);
    }

    &__equipped-icon {
      position: absolute;
      top: UiSpacing(2);
      right: UiSpacing(2);
    }

    &__name {
      position: absolute;
      bottom: UiSpacing(2);
      left: 50%;
      transform: translateX(-50%);
      @include UiTextShadow(3);
      text-align: center;
    }

    &__locked-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
