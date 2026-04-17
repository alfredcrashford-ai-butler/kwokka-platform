<template>
  <UiResponsiveImage class="item-card-skin" :src="src" />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UiResponsiveImage } from '@/app/ui-kit';
  import { ItemKey } from '@/game-data/item-key';
  import { TraitKey } from '@/game-data/trait-key';

  @Component({
    components: {
      UiResponsiveImage,
    },
  })
  export default class ItemCardSkin extends Vue {
    public readonly skinMap = {
      [ItemKey.CardSkinGoldenSpecial]: 'golden_special',
      [ItemKey.CardSkinGoldenLabradoodle]: 'golden_labradoodle',
      [ItemKey.CardSkinGoldenDobermann]: 'golden_dobermann',
      [ItemKey.CardSkinGoldenHusky]: 'golden_husky',
      [ItemKey.CardSkinGoldenRetriever]: 'golden_retriever',
      [ItemKey.CardSkinGoldenCorgi]: 'golden_corgi',
      [ItemKey.CardSkinGoldenPug]: 'golden_pug',
      [ItemKey.CardSkinGoldenDoxie]: 'golden_doxie',
      [ItemKey.CardSkinGoldenYork]: 'golden_york',
      [ItemKey.CardSkinGoldenSpitz]: 'golden_spitz',
    };

    public readonly defaultSkinMap = {
      [TraitKey.EquippedCardSkinSpecial]: 'standard_special',
      [TraitKey.EquippedCardSkinSpitz]: 'standard_spitz',
      [TraitKey.EquippedCardSkinYork]: 'standard_york',
      [TraitKey.EquippedCardSkinDoxie]: 'standard_doxie',
      [TraitKey.EquippedCardSkinPug]: 'standard_pug',
      [TraitKey.EquippedCardSkinCorgi]: 'standard_corgi',
      [TraitKey.EquippedCardSkinRetriever]: 'standard_retriever',
      [TraitKey.EquippedCardSkinHusky]: 'standard_husky',
      [TraitKey.EquippedCardSkinDobermann]: 'standard_dobermann',
      [TraitKey.EquippedCardSkinLabradoodle]: 'standard_labradoodle',
    };

    @Prop({ default: null })
    public itemKey: ItemKey;

    @Prop({ required: true })
    public traitKey: ItemKey;

    public get src(): string {
      const image = this.skinMap[this.itemKey] || this.defaultSkinMap[this.traitKey];
      return `/static/card_skin/${image}.webp`;
    }
  }
</script>

<style scoped lang="scss">
  .item-card-skin {
    width: 100%;
    height: 100%;
    @include UiDropShadow(1);
    pointer-events: none;
  }
</style>
