<template>
  <div class="price-tag">
    <Essence class="price-tag__essence" :isGlowing="false" />
    <span class="price-tag__cost">{{ value }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import Essence from '@/app/components/Essence.vue';

  @Component({
    components: {
      Essence,
    },
  })
  export default class PriceTag extends Vue {
    @Prop({ required: true })
    public value: number;
  }
</script>

<style scoped lang="scss">
  .price-tag {
    display: flex;
    align-items: center;
    height: UiSpacing(4);
    background: linear-gradient(45deg, UiColor(secondary-500), UiColor(secondary-900));
    border: UiSpacing(0.25) solid UiColor(secondary-600);
    @include UiPadding(1, right);
    @include UiBorderRadius(1);

    &__essence {
      height: UiSpacing(5);
    }

    &__cost {
      @include UiTextShadow(1);
    }
  }
</style>
