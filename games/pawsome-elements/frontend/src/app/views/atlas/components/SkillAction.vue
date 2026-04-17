<template>
  <div class="skill-action">
    <FadeTransition>
      <div v-if="item" class="skill-action__container" :key="item.key">
        <div class="skill-action__skill">
          <SkillTreeNode
            class="skill-action__node"
            :item="item"
            :isCostShown="false"
            :isClickable="false"
            :isHighlighted="isEquipped"
          />
          <div class="skill-action__info">
            <h4>
              {{ $t(`skill.${item.key}.title`) }}
              {{ item.type === 'passive' ? $t('atlas.skillTree.passiveHint') : '' }}
              {{ isEquipped ? $t('atlas.skillTree.equippedHint') : '' }}
            </h4>
            <p>{{ $t(`skill.${item.key}.description`) }}</p>
          </div>
        </div>
        <UiButton v-if="!isOwned" :disabled="!isActive" @click="$emit('unlock', item)">
          {{ $t('atlas.skillTree.learn', { cost: item.cost }) }}
        </UiButton>
        <UiButton v-else-if="item.type === 'active'" :disabled="isEquipped" type="blue" @click="$emit('equip', item)">
          {{ $t('atlas.skillTree.equip') }}
        </UiButton>
      </div>
      <div v-else class="skill-action__container skill-action__info">
        <p>{{ $t('atlas.skillTree.emptyActionPlaceholder') }}</p>
      </div>
    </FadeTransition>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { type SkillTreeItem } from '@/game-data/skills';
  import SkillTreeNode from './SkillTreeNode.vue';
  import { UiButton } from '@/app/ui-kit';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';

  @Component({
    components: {
      UiButton,
      SkillTreeNode,
      FadeTransition,
    },
    emits: ['equip', 'unlock'],
  })
  export default class SkillAction extends Vue {
    @Prop({ default: null })
    public item: SkillTreeItem;

    @Prop({ default: false })
    public isOwned: boolean;

    @Prop({ default: false })
    public isEquipped: boolean;

    @Prop({ default: true })
    public isActive: boolean;
  }
</script>

<style scoped lang="scss">
  .skill-action {
    flex-shrink: 0;
    height: UiSpacing(25);
    background-image: url('/static/ui/bricks.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    width: 100%;

    @include UiMediaPortrait() {
      height: UiSpacing(50);
    }

    &__container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      @include UiGap(4);
      @include UiPadding(2);

      @include UiMediaPortrait() {
        flex-direction: column;
      }
    }

    &__skill {
      display: flex;
      align-items: center;
      @include UiGap(2);

      @include UiMediaLandscape() {
        flex-grow: 1;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      @include UiGap(1);

      h4 {
        @include UiTypographyHeading3();
        @include UiTextShadow(3);
      }

      p {
        @include UiTypographyHeading6();
        @include UiTextShadow(2);
      }
    }

    &__node {
      flex-shrink: 0;
    }
  }
</style>
