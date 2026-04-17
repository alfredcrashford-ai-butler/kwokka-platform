<template>
  <OnboardingDragByPosition ref="base" />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { OnboardingActionType, type DragOnboardingAction } from '@/service';
  import { type Bounds } from '@/util';
  import OnboardingDragByPosition from './OnboardingDragByPosition.vue';

  @Component({
    components: {
      OnboardingDragByPosition,
    },
  })
  export default class OnboardingDrag extends Vue {
    @Ref()
    public base: OnboardingDragByPosition;

    public hide(): void {
      this.base.hide();
    }

    public show(action: DragOnboardingAction): void {
      this.base.show({
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: () => this.calculatePosition(action.fromSelector),
        getToPosition: () => this.calculatePosition(action.toSelector),
      });
    }

    private calculatePosition(selector: string): Bounds {
      return document.querySelector(selector)?.getBoundingClientRect();
    }
  }
</script>
