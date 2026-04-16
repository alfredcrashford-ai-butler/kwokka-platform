<template>
  <SecondLevelLayout :title="$t('collection.title')" backUrl="/main">
    <div>{{ $t('general.construction') }}</div>
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';

  @Component({
    components: {
      SecondLevelLayout,
    },
  })
  export default class CollectionView extends Vue {}
</script>

<style scoped lang="scss">
  .collection-view {
  }
</style>
