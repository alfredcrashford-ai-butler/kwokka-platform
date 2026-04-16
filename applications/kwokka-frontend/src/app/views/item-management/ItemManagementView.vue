<template>
  <SecondLevelLayout :title="$t('itemManagement.title')" backUrl="/">
    <DetailContainer v-if="items" :items="items" />
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Vue } from 'vue-facing-decorator';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import type { DetailContainerItem } from '@/app/components/DetailContainer.vue';
  import DetailContainer from '@/app/components/DetailContainer.vue';
  import ItemsSetup from './components/ItemsSetup.vue';
  import DecorationsSetup from './components/DecorationsSetup.vue';
  import TraitSetup from './components/TraitSetup.vue';
  import ItemTradesSetup from './components/ItemsTradesSetup.vue';

  @Component({
    components: {
      SecondLevelLayout,
      DetailContainer,
    },
  })
  export default class ItemManagementView extends Vue {
    public items: DetailContainerItem[] = null;

    public mounted(): void {
      this.items = markRaw([
        {
          id: 'items',
          labelTranslationKey: 'itemManagement.items.title',
          component: ItemsSetup,
        },
        {
          id: 'item-trades',
          labelTranslationKey: 'itemManagement.itemTrades.title',
          component: ItemTradesSetup,
        },
        {
          id: 'decorations',
          labelTranslationKey: 'itemManagement.decorations.title',
          component: DecorationsSetup,
        },
        {
          id: 'traits',
          labelTranslationKey: 'itemManagement.traits.title',
          component: TraitSetup,
        },
      ]);
    }
  }
</script>

<style scoped lang="scss">
  .item-management-view {
  }
</style>
