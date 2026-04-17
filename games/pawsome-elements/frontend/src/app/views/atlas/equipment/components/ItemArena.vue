<template>
  <UiResponsiveImage class="item-arena" :src="src" :alt="alt" />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UiResponsiveImage } from '@/app/ui-kit';
  import { ItemKey } from '@/game-data/item-key';

  @Component({
    components: {
      UiResponsiveImage,
    },
  })
  export default class ItemArena extends Vue {
    @Prop({ default: null })
    public arenaKey: ItemKey.ArenaFlowerField | ItemKey.ArenaLoneMountain;

    public get src(): string {
      const map = {
        [ItemKey.ArenaFlowerField]: 'flower_field',
        [ItemKey.ArenaLoneMountain]: 'lone_mountain',
        [ItemKey.ArenaLab]: 'lab',
        [ItemKey.ArenaLibrary]: 'library',
      };
      const imageKey = map[this.arenaKey] || 'standard';
      return `/static/game/game_table/arena/${imageKey}/table.webp`;
    }

    public get alt(): string {
      if (!this.arenaKey) {
        return null;
      }

      return this.$t(`item.${this.arenaKey}.title`);
    }
  }
</script>

<style scoped lang="scss">
  .item-arena {
    width: 100%;
    height: 100%;
    @include UiDropShadow(2);
    pointer-events: none;
  }
</style>
