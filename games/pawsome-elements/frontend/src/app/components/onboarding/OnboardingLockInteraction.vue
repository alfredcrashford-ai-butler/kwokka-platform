<template>
  <div class="onboarding-block"></div>
</template>

<script lang="ts">
  import type { LockInteractionOnboardingAction } from '@/service';
  import { Component, Vue, Watch } from 'vue-facing-decorator';

  @Component
  export default class OnboardingLockInteraction extends Vue {
    public actions: LockInteractionOnboardingAction[] = null;

    public hide(): void {
      this.actions = null;
    }

    public show(actions: LockInteractionOnboardingAction[]): void {
      this.actions = actions;
    }

    public beforeDestroy(): void {
      document.body.removeAttribute('data-onboarding-blocked');
      const elements = document.querySelectorAll('[data-onboarding-allowed]') || [];
      elements.forEach((el) => el.removeAttribute('data-onboarding-allowed'));
    }

    @Watch('actions')
    public onActionChange(
      newActions?: LockInteractionOnboardingAction[],
      oldActions?: LockInteractionOnboardingAction[],
    ): void {
      if (oldActions) {
        oldActions.forEach((action) => {
          if (action.selector) {
            const elements = document.querySelectorAll(action.selector);
            elements.forEach((el) => el.removeAttribute('data-onboarding-allowed'));
          }
        });
      }

      if (newActions) {
        newActions.forEach((action) => {
          if (action.selector) {
            const elements = document.querySelectorAll(action.selector);
            elements.forEach((el) => el.setAttribute('data-onboarding-allowed', ''));
          }
        });
        document.body.setAttribute('data-onboarding-blocked', '');
      } else {
        document.body.removeAttribute('data-onboarding-blocked');
      }
    }
  }
</script>

<style lang="scss">
  [data-onboarding-blocked] {
    pointer-events: none;
  }

  [data-onboarding-allowed] {
    pointer-events: auto;
  }
</style>
