<template>
  <div class="skill-icon">
    <div class="skill-icon__container">
      <div class="skill-icon__frame" :class="{ 'skill-icon__frame_is-passive': isPassive }"></div>
      <UiResponsiveImage
        v-if="skillKey"
        class="skill-icon__image"
        :src="`/static/skills/${skillKey}.webp`"
        :alt="$t(`skill.${skillKey}.title`)"
      />
      <UiResponsiveImage v-else class="skill-icon__image" src="/static/skills/pwsm_spell_unequipped.webp" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { UiResponsiveImage } from '@/app/ui-kit';

  @Component({
    components: {
      UiResponsiveImage,
    },
  })
  export default class SkillIcon extends Vue {
    @Prop({ default: false })
    public skillKey: string;

    @Prop({ default: false })
    public isPassive: boolean;
  }
</script>

<style scoped lang="scss">
  .skill-icon {
    position: relative;
    aspect-ratio: 1;
    border-radius: 50%;
    transition: transform ease 300ms;

    &__container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    &__frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('/static/atlas/skill_slot.webp');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transform: translateY(4%);

      &_is-passive {
        filter: grayscale(1);
      }
    }

    &__image {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 66%;
      height: 66%;
      border-radius: 50%;
      box-shadow: inset 0 0 UiSpacing(1) UiSpacing(1) UiColor(shade-900, 0.5);
      pointer-events: none;
    }
  }
</style>
