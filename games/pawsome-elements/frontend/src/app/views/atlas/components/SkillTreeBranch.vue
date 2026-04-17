<template>
  <div
    class="skill-tree-branch"
    :class="{ 'skill-tree-branch_is-active': branch.isActive }"
    :style="{
      left: `${branch.x}px`,
      top: `${branch.y}px`,
      width: `${branch.length}px`,
      transform: `translate(-50%, -50%) rotateZ(${branch.angle}deg)`,
    }"
  ></div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component
  export default class SkillTreeBranch extends Vue {
    @Prop({ required: true })
    public branch: { x: number; y: number; length: number; isActive: boolean; uuid: string; angle: number };
  }
</script>

<style scoped lang="scss">
  .skill-tree-branch {
    position: absolute;
    height: UiSpacing(5);
    background-image: url('/static/atlas/skill_branch.webp');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    transform: translateX(-50%) translateY(-50%) rotateZ(0deg);
    opacity: 0.35;

    &_is-active {
      opacity: 1;
    }
  }
</style>
