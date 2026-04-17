<template>
  <div class="equipment-skill" v-ui-sound tabindex="0" role="button" @click="$emit('click', $event)">
    <div class="equipment-skill__bg"></div>
    <div class="equipment-skill__icon-container">
      <SkillIcon class="equipment-skill__icon" :skillKey="skillKey" :isPassive="isPassive" />
      <div class="equipment-skill__icon-additional">
        <slot></slot>
      </div>
    </div>
    <div class="equipment-skill__info" v-if="skillKey">
      <h3 class="equipment-skill__name">{{ $t(`skill.${skillKey}.title`) }}</h3>
      <p class="equipment-skill__description">{{ $t(`skill.${skillKey}.description`) }}</p>
    </div>
    <div class="equipment-skill__info" v-else>
      <h3 class="equipment-skill__name">{{ $t('atlas.equipment.activeSkill.emptyTitle') }}</h3>
      <p class="equipment-skill__description">{{ $t('atlas.equipment.activeSkill.emptyText') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import SkillIcon from '@/app/components/SkillIcon.vue';

  @Component({
    components: {
      SkillIcon,
    },
    emits: ['click'],
  })
  export default class EquipmentSkill extends Vue {
    @Prop({ default: null })
    public skillKey: string;

    @Prop({ default: false })
    public isPassive: boolean;
  }
</script>

<style scoped lang="scss">
  .equipment-skill {
    position: relative;
    display: flex;
    align-items: center;
    @include UiGap(2);
    @include UiButtonAppearance();

    &:hover,
    &:active,
    &:focus-visible {
      > .equipment-skill__bg {
        opacity: 1;
      }
    }

    &__bg {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 150%;
      height: 100%;
      background-image: radial-gradient(UiColor(shade-100, 0.45) 0, transparent 50%);
      opacity: 0;
      pointer-events: none;
      transition: opacity ease 300ms;
    }

    &__icon {
      width: 100%;
    }

    &__icon-container {
      position: relative;
      flex-shrink: 0;
      width: UiSpacing(12);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__info {
      position: relative;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    &__name {
      @include UiMargin(1, bottom);
      @include UiTextShadow(3);
    }

    &__description {
      @include UiTypographyHeading6();
      @include UiTextShadow(3);
    }

    &__icon-additional {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
