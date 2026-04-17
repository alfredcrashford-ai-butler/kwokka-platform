<template>
  <div class="equipment-arena" v-ui-sound @click="$emit('click', $event)">
    <ItemArena :arenaKey="arenaKey" />
    <CaptionPanel size="sm" class="equipment-arena__title-panel">
      <p class="equipment-arena__title">{{ $t('atlas.equipment.arena.title') }}</p>
    </CaptionPanel>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { ItemKey } from '@/game-data/item-key';
  import CaptionPanel from '@/app/components/CaptionPanel.vue';
  import ItemArena from './ItemArena.vue';

  @Component({
    components: {
      ItemArena,
      CaptionPanel,
    },
    emits: ['click'],
  })
  export default class EquipmentArena extends Vue {
    @Prop({ default: null })
    public arenaKey: ItemKey.ArenaFlowerField | ItemKey.ArenaLoneMountain;
  }
</script>

<style scoped lang="scss">
  .equipment-arena {
    position: relative;
    @include UiButtonAppearance();

    &__title {
      @include UiTypographyHeading5();
      white-space: nowrap;
      @include UiTextShadow(2);
    }

    &__title-panel {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, -25%);
      @include UiPadding(2);
      @include UiBoxShadow(1);
    }
  }
</style>
