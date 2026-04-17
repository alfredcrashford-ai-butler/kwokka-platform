<template>
  <UiResponsiveImage class="item-card-back" :src="src" :alt="alt" />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UiResponsiveImage } from '@/app/ui-kit';
  import { type CardBackItemKey } from '@/game-data/item-key';
  import { ItemUtil } from '@/util';

  @Component({
    components: {
      UiResponsiveImage,
    },
  })
  export default class ItemCardBack extends Vue {
    @Prop({ default: null })
    public cardKey: CardBackItemKey;

    public get src(): string {
      return ItemUtil.getCardBackSrc(this.cardKey);
    }

    public get alt(): string {
      if (!this.cardKey) {
        return null;
      }

      return this.$t(`item.${this.cardKey}.title`);
    }
  }
</script>

<style scoped lang="scss">
  .item-card-back {
    width: 100%;
    height: 100%;
    @include UiDropShadow(2);
    pointer-events: none;
  }
</style>
