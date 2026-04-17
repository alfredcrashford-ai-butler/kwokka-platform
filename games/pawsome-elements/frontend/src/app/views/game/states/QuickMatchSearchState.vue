<template>
  <GameSearch @cancel="onCancel()" />
</template>

<script lang="ts">
  import { Component } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { SoundService } from '@/service';
  import { RouteName } from '@/app/route-name';
  import { GameSearch, CommonGameComponent } from '../components';

  @Component({
    components: {
      GameSearch,
    },
  })
  export default class QuickMatchSearchState extends CommonGameComponent {
    @LazyInject(SoundService)
    private soundService: SoundService;

    public onCancel(): void {
      this.connection.close();
      this.$router.replace({ name: RouteName.QuickMatch });
    }

    public created(): void {
      this.soundService.playMenuMusic();
    }
  }
</script>
