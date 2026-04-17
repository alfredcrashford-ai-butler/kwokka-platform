<template>
  <div class="skill-tree-renderer">
    <div class="skill-tree-renderer__column" v-for="(items, i) in columns" :key="i">
      <SkillTreeNode
        v-ui-sound
        :data-key="item.key"
        v-for="item in items"
        :key="item.key"
        :item="item"
        :isSelected="selectedItem?.key === item.key"
        :isCostShown="!ownedItems[item.key]"
        :isActive="activeItems.includes(item)"
        :isHighlighted="equippedItemKey === item.key"
        @click="onItemSelect(item)"
      />
    </div>
    <SkillTreeBranch v-for="branch in branches" :key="branch.uuid" :branch="branch" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
  import { type SkillTree, type SkillTreeItem } from '@/game-data/skills';
  import { FunctionUtil, UuidUtil } from '@kwokka/utils';
  import { resizeObserver } from '@/util';
  import SkillTreeNode from './SkillTreeNode.vue';
  import SkillTreeBranch from './SkillTreeBranch.vue';

  @Component({
    components: {
      SkillTreeNode,
      SkillTreeBranch,
    },
    emits: ['select'],
  })
  export default class SkillTreeRenderer extends Vue {
    @Prop({ required: true })
    public tree: SkillTree = null;

    @Prop({ required: true })
    public ownedItems: Record<string, boolean>;

    @Prop({ required: true })
    public selectedItem: SkillTreeItem;

    @Prop({ required: true })
    public equippedItemKey: string;

    @Prop({ required: true })
    public activeItems: SkillTreeItem[];

    public branches = [];

    private cleanupResizeObserver: () => void;

    public get columns(): SkillTreeItem[][] {
      const items = [];
      this.tree.items.forEach((el) => (items[el.tier] = [...(items[el.tier] || []), el]));
      return items;
    }

    public mounted(): void {
      this.calculateBranches();
      this.cleanupResizeObserver = resizeObserver(
        this.$el,
        FunctionUtil.debounce(() => this.calculateBranches(), 100),
      );
    }

    public beforeUnmount(): void {
      this.cleanupResizeObserver?.();
    }

    @Watch('activeItems')
    private calculateBranches(): void {
      const branches = [];
      this.tree.items.forEach((target) => {
        if (!target.requires) {
          return;
        }

        const targetEl: HTMLElement = this.$el.querySelector(`[data-key="${target.key}"]`);
        const targetX = targetEl.offsetLeft;
        const targetY = targetEl.offsetTop + targetEl.offsetHeight / 2;

        target.requires.forEach((sourceKey) => {
          const sourceEl = this.$el.querySelector(`[data-key="${sourceKey}"]`);
          const sourceX = sourceEl.offsetLeft + sourceEl.offsetWidth;
          const sourceY = sourceEl.offsetTop + sourceEl.offsetHeight / 2;
          const x = (sourceX + targetX) / 2;
          const y = (sourceY + targetY) / 2;
          const lengthX = targetX - sourceX;
          const lengthY = targetY - sourceY;
          const length = Math.sqrt(lengthX * lengthX + lengthY * lengthY);
          const angle = Math.atan2(lengthY, lengthX) * (180 / Math.PI);
          branches.push({ x, y, length, isActive: this.ownedItems[sourceKey], uuid: UuidUtil.generate(6), angle });
        });
      });
      this.branches = branches;
    }

    public onItemSelect(item: SkillTreeItem): void {
      this.$emit('select', item);
      const itemElement: HTMLElement = this.$el.querySelector(`[data-key="${item.key}"]`);
      itemElement?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
  }
</script>

<style scoped lang="scss">
  .skill-tree-renderer {
    position: relative;
    background: radial-gradient(
      ellipse farthest-side at right center,
      UiColor(secondary-100) 0%,
      UiColor(shade-900) 100%
    );
    display: flex;
    align-items: center;
    height: 100%;
    width: fit-content;

    @include UiGap(40);
    @include UiPadding(10);

    &__column {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-around;
    }
  }
</style>
