<template>
  <div
    class="skill-tree-node"
    :class="{
      'skill-tree-node_is-clickable': isClickable,
      'skill-tree-node_is-active': isActive,
      'skill-tree-node_is-selected': isSelected,
    }"
    @click="$emit('click', $event)"
  >
    <div class="skill-tree-node__highlight" :class="{ 'skill-tree-node__highlight_is-shown': isHighlighted }"></div>
    <div class="skill-tree-node__container">
      <SkillIcon :skillKey="item.key" :isPassive="item.type === 'passive'" />
      <PriceTag class="skill-tree-node__info" v-if="isCostShown" :value="item.cost" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { type SkillTreeItem } from '@/game-data/skills';
  import Essence from '@/app/components/Essence.vue';
  import PriceTag from '@/app/components/PriceTag.vue';
  import SkillIcon from '@/app/components/SkillIcon.vue';

  @Component({
    components: {
      Essence,
      PriceTag,
      SkillIcon,
    },
    emits: ['click'],
  })
  export default class SkillTreeNode extends Vue {
    @Prop({ required: true })
    public item: SkillTreeItem;

    @Prop({ default: true })
    public isClickable: boolean;

    @Prop({ default: true })
    public isActive: boolean;

    @Prop({ default: true })
    public isCostShown: boolean;

    @Prop({ default: false })
    public isSelected: boolean;

    @Prop({ default: false })
    public isHighlighted: boolean;
  }
</script>

<style scoped lang="scss">
  .skill-tree-node {
    position: relative;
    width: UiSpacing(15);
    height: UiSpacing(15);
    border-radius: 50%;
    transition: transform ease 300ms;

    &:not(.skill-tree-node_is-active) {
      filter: brightness(0.5) !important;
    }

    &_is-clickable {
      @include UiButtonAppearance();
    }

    &_is-selected {
      transform: scale(1.1);
      filter: brightness(1.25) !important;

      &.skill-tree-node:not(.skill-tree-node_is-active) {
        filter: brightness(0.75) !important;
      }
    }

    &__container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    &__highlight {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 125%;
      height: 125%;
      background-image: url('/static/atlas/active_aura.webp');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      opacity: 0;
      transition: opacity ease 500ms;
      pointer-events: none;
      @include UiInlineAnimation(30s) {
        0% {
          transform: translate(-50%, -50%) rotateZ(0);
        }
        100% {
          transform: translate(-50%, -50%) rotateZ(360deg);
        }
      }
      animation-iteration-count: infinite;
      animation-timing-function: linear;

      &_is-shown {
        opacity: 1;
      }
    }

    &__info {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 25%);
    }
  }
</style>
