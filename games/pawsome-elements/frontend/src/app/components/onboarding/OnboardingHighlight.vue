<template>
  <OnboardingHighlightByPosition ref="base" />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { OnboardingActionType, type ElementHighlightOnboardingAction } from '@/service';
  import { type Bounds } from '@/util';
  import OnboardingHighlightByPosition from './OnboardingHighlightByPosition.vue';

  @Component({
    components: {
      OnboardingHighlightByPosition,
    },
  })
  export default class OnboardingHighlight extends Vue {
    @Ref()
    public base: OnboardingHighlightByPosition;

    public hide(): void {
      this.base.hide();
    }

    public show(action: ElementHighlightOnboardingAction): void {
      this.base.show({
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: action.shape,
        getPosition: () => this.highlight(action.selector),
      });
    }

    private highlight(selector: string): Bounds {
      const element = document.querySelector(selector);
      const elementRect = element.getBoundingClientRect();
      return { x: elementRect.x, y: elementRect.y, width: elementRect.width, height: elementRect.height };
    }
  }
</script>
