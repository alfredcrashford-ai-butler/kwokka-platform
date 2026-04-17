<template>
  <div class="equipment-deck-backface" v-ui-sound @click="$emit('click', $event)">
    <ItemCardBack :cardKey="cardKey" />
    <CaptionPanel size="sm" class="equipment-deck-backface__title-panel">
      <p class="equipment-deck-backface__title">{{ $t('atlas.equipment.cardBack.title') }}</p>
    </CaptionPanel>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { type CardBackItemKey } from '@/game-data/item-key';
  import CaptionPanel from '@/app/components/CaptionPanel.vue';
  import ItemCardBack from './ItemCardBack.vue';

  @Component({
    components: {
      ItemCardBack,
      CaptionPanel,
    },
    emits: ['click'],
  })
  export default class EquipmentDeckBackface extends Vue {
    @Prop({ default: null })
    public cardKey: CardBackItemKey;
  }
</script>

<style scoped lang="scss">
  .equipment-deck-backface {
    position: relative;
    @include UiButtonAppearance();

    &__title {
      white-space: nowrap;
      @include UiTextShadow(2);
      @include UiTypographyHeading5();
    }

    &__title-panel {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 10%);
      @include UiPadding(2);
      @include UiBoxShadow(1);
    }
  }
</style>
