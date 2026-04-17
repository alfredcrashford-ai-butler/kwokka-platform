<template>
  <OnboardingClickByPosition ref="base" />
</template>

<script lang="ts">
  import { OnboardingActionType, type ClickOnboardingAction } from '@/service';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { Bounds } from '@/util';
  import OnboardingClickByPosition from './OnboardingClickByPosition.vue';

  @Component({
    components: {
      OnboardingClickByPosition,
    },
  })
  export default class OnboardingClick extends Vue {
    @Ref()
    public base: OnboardingClickByPosition;

    public hide(): void {
      this.base.hide();
    }

    public show(action: ClickOnboardingAction): void {
      this.base.show({
        type: OnboardingActionType.ClickInteractionByPosition,
        getPosition: () => this.calculatePosition(action.selector),
      });
    }

    private calculatePosition(selector: string): Bounds {
      return document.querySelector(selector)?.getBoundingClientRect();
    }
  }
</script>
