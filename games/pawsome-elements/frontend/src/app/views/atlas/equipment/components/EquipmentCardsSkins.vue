<template>
  <div class="equipment-cards-skins" v-ui-sound @click="$emit('click', $event)">
    <ItemCardSkin
      class="equipment-cards-skins__img"
      v-for="item in items"
      :key="item.traitKey"
      :traitKey="item.traitKey"
      :itemKey="item.itemKey"
    />
    <CaptionPanel size="sm" class="equipment-cards-skins__title-panel">
      <p class="equipment-cards-skins__title">{{ $t('atlas.equipment.cardsSkins.title') }}</p>
    </CaptionPanel>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { TraitKey } from '@/game-data/trait-key';
  import CaptionPanel from '@/app/components/CaptionPanel.vue';
  import ItemCardSkin from './ItemCardSkin.vue';

  @Component({
    components: {
      CaptionPanel,
      ItemCardSkin,
    },
    emits: ['click'],
  })
  export default class EquipmentCardsSkins extends Vue {
    @Prop({
      default: {
        [TraitKey.EquippedCardSkinSpitz]: null,
        [TraitKey.EquippedCardSkinSpecial]: null,
        [TraitKey.EquippedCardSkinYork]: null,
        [TraitKey.EquippedCardSkinDoxie]: null,
        [TraitKey.EquippedCardSkinPug]: null,
        [TraitKey.EquippedCardSkinCorgi]: null,
        [TraitKey.EquippedCardSkinRetriever]: null,
        [TraitKey.EquippedCardSkinHusky]: null,
        [TraitKey.EquippedCardSkinDobermann]: null,
        [TraitKey.EquippedCardSkinLabradoodle]: null,
      },
    })
    public cardsSkins: { [traitKey in string]: string };

    public get items(): { itemKey: string; traitKey: string }[] {
      return Object.keys(this.cardsSkins).map((key) => ({ traitKey: key, itemKey: this.cardsSkins[key] }));
    }
  }
</script>

<style scoped lang="scss">
  .equipment-cards-skins {
    position: relative;
    width: 100%;
    height: 100%;
    @include UiButtonAppearance();
    @include UiDropShadow(2);

    &__img {
      filter: none;
      pointer-events: none;
      position: absolute;
      left: 0;
      bottom: 0;
      aspect-ratio: 2 / 3;
      height: 100%;
      width: auto;

      @for $i from 1 through 10 {
        &:nth-child(#{$i}) {
          left: $i * 10%;
          z-index: 10 - $i;
          transform: translateX(-10% * $i);
        }
      }
    }

    &__title {
      @include UiTypographyHeading5();
      white-space: nowrap;
      @include UiTextShadow(2);
    }

    &__title-panel {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 10%);
      z-index: 100;
      @include UiPadding(2);
      @include UiBoxShadow(1);
    }
  }
</style>
