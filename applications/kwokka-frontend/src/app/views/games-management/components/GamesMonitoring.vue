<template>
  <div>{{ $t('general.construction') }}</div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';

  @Component({
    components: {},
  })
  export default class GamesMonitoring extends Vue {}
</script>

<style scoped lang="scss">
  .games-monitoring {
  }
</style>
