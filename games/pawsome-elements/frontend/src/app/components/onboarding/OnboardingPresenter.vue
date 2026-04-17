<template>
  <div
    class="onboarding-presenter"
    :class="{ 'onboarding-presenter_is-hidden': isHidden, 'onboarding-presenter_is-transparent': isTransparent }"
  >
    <OnboardingHighlight ref="highlight" />
    <OnboardingDrag ref="drag" />
    <OnboardingClick ref="click" />
    <OnboardingHighlightByPosition ref="highlightByPosition" />
    <OnboardingDragByPosition ref="dragByPosition" />
    <OnboardingClickByPosition ref="clickByPosition" />
    <OnboardingLockInteraction ref="lockInteraction" />
    <OnboardingNarratorDialog ref="narratorDialog" @optionClick="onNarratorDialogOptionClick($event)" />
  </div>
</template>

<script lang="ts">
  import { Component, Watch, Vue, Ref } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { TrackerService, OnboardingService, KwokkaService } from '@/service';
  import {
    OnboardingActionType,
    OnboardingScenario,
    type LockInteractionOnboardingAction,
    type ClickOnboardingAction,
    type CustomOnboardingAction,
    type DragOnboardingAction,
    type ElementHighlightOnboardingAction,
    type NarratorDialogOnboardingAction,
    type NarratorDialogOnboardingActionOption,
    type OnboardingStep,
  } from '@/service/onboarding/onboarding-scenario';
  import OnboardingHighlight from './OnboardingHighlight.vue';
  import OnboardingNarratorDialog from './OnboardingNarratorDialog.vue';
  import OnboardingClick from './OnboardingClick.vue';
  import OnboardingDrag from './OnboardingDrag.vue';
  import OnboardingLockInteraction from './OnboardingLockInteraction.vue';
  import OnboardingHighlightByPosition from './OnboardingHighlightByPosition.vue';
  import OnboardingDragByPosition from './OnboardingDragByPosition.vue';
  import OnboardingClickByPosition from './OnboardingClickByPosition.vue';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';

  @Component({
    components: {
      OnboardingHighlight,
      OnboardingDrag,
      OnboardingClick,
      OnboardingNarratorDialog,
      OnboardingLockInteraction,
      OnboardingHighlightByPosition,
      OnboardingDragByPosition,
      OnboardingClickByPosition,
    },
  })
  export default class OnboardingPresenter extends Vue {
    @LazyInject(OnboardingService)
    private onboardingService: OnboardingService;

    @LazyInject(TrackerService)
    private tracker: TrackerService;

    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @Ref()
    public highlight: OnboardingHighlight;

    @Ref()
    public narratorDialog: OnboardingNarratorDialog;

    @Ref()
    public drag: OnboardingDrag;

    @Ref()
    public click: OnboardingClick;

    @Ref()
    public lockInteraction: OnboardingLockInteraction;

    @Ref()
    public dragByPosition: OnboardingDragByPosition;

    @Ref()
    public clickByPosition: OnboardingClickByPosition;

    @Ref()
    public highlightByPosition: OnboardingHighlightByPosition;

    private scenario?: OnboardingScenario = null;
    private currentStep: OnboardingStep = null;
    private unsubscribe?: Function;
    private unsubscribeTracking?: Function;

    public get isHidden(): boolean {
      return !this.scenario || this.scenario.isFinished || !this.currentStep;
    }

    public get isTransparent(): boolean {
      return (this.currentStep?.actions || []).some((el) => el.type === OnboardingActionType.Transparent);
    }

    public mounted(): void {
      this.unsubscribe = this.onboardingService.subscribe({
        onRunScenario: this.onRunScenario.bind(this),
        onRunStep: this.onRunStep.bind(this),
        onFinishScenario: this.onFinishScenario.bind(this),
      });
      this.unsubscribeTracking = this.onboardingService.subscribe({
        onRunScenario: this.trackScenarioStarted.bind(this),
        onFinishScenario: this.trackScenarioFinished.bind(this),
      });
    }

    public unmounted(): void {
      this.unsubscribe?.();
      this.unsubscribeTracking?.();
    }

    @Watch('currentStep')
    public onStepChange(step?: OnboardingStep): void {
      this.handleNarratorDialog(step);
      this.handleElementHighlight(step);
      this.handleDrag(step);
      this.handleClick(step);
      this.handleLockInteraction(step);
      this.handleDragByPosition(step);
      this.handleClickByPosition(step);
      this.handleElementHighlightByPosition(step);
      this.handleCustom(step);
    }

    public onNarratorDialogOptionClick(option: NarratorDialogOnboardingActionOption): void {
      this.onboardingService.runStep(option.transitionTo);
    }

    private handleNarratorDialog(step?: OnboardingStep): void {
      const action = step?.actions?.find((el) => el.type === OnboardingActionType.NarratorDialog);

      if (!step || !action) {
        this.narratorDialog.hide();
        return;
      }

      this.narratorDialog.say(action as NarratorDialogOnboardingAction);
    }

    private handleElementHighlight(step?: OnboardingStep): void {
      const action = step?.actions?.find((el) => el.type === OnboardingActionType.ElementHighlight);

      if (!step || !action) {
        this.highlight.hide();
        return;
      }

      this.highlight.show(action as ElementHighlightOnboardingAction);
    }

    private handleElementHighlightByPosition(step?: OnboardingStep): void {
      const action = step?.actions?.find((el) => el.type === OnboardingActionType.ElementHighlightByPosition);

      if (!step || !action) {
        this.highlightByPosition.hide();
        return;
      }

      this.highlightByPosition.show({
        ...action,
        getPosition: () => action.getPosition(this.scenario),
      });
    }

    private handleDragByPosition(step?: OnboardingStep): void {
      const action = step?.actions?.find((el) => el.type === OnboardingActionType.DragInteractionByPosition);

      if (!step || !action) {
        this.dragByPosition.hide();
        return;
      }

      this.dragByPosition.show({
        ...action,
        getFromPosition: () => action.getFromPosition(this.scenario),
        getToPosition: () => action.getToPosition(this.scenario),
      });
    }

    private handleClickByPosition(step?: OnboardingStep): void {
      const action = step?.actions?.find((el) => el.type === OnboardingActionType.ClickInteractionByPosition);

      if (!step || !action) {
        this.clickByPosition.hide();
        return;
      }

      this.clickByPosition.show({ ...action, getPosition: () => action.getPosition(this.scenario) });
    }

    private handleDrag(step?: OnboardingStep): void {
      const action = step?.actions?.find((el) => el.type === OnboardingActionType.DragInteraction);

      if (!step || !action) {
        this.drag.hide();
        return;
      }

      this.drag.show(action as DragOnboardingAction);
    }

    private handleClick(step?: OnboardingStep): void {
      const action = step?.actions?.find((el) => el.type === OnboardingActionType.ClickInteraction);

      if (!step || !action) {
        this.click.hide();
        return;
      }

      this.click.show(action as ClickOnboardingAction);
    }

    private handleLockInteraction(step?: OnboardingStep): void {
      const actions = step?.actions?.filter((el) => el.type === OnboardingActionType.LockInteraction);

      if (!step || !actions?.length) {
        this.lockInteraction.hide();
        return;
      }

      this.lockInteraction.show(actions as LockInteractionOnboardingAction[]);
    }

    private handleCustom(step?: OnboardingStep): void {
      const actions = step?.actions?.filter((el) => el.type === OnboardingActionType.Custom);
      actions?.forEach((action: CustomOnboardingAction) => action.handle(this.scenario));
    }

    private onRunScenario(scenario: OnboardingScenario): void {
      this.scenario = scenario;
    }

    private onRunStep(scenario: OnboardingScenario, step: OnboardingStep): void {
      this.currentStep = step;
    }

    private onFinishScenario(): void {
      this.scenario = null;
      this.currentStep = null;
    }

    private trackScenarioStarted(scenario: OnboardingScenario): void {
      const params = {
        authenticated: this.kwokkaService.client.isAuthenticated,
        scenarioName: scenario.name,
        steps: scenario.steps.length,
      };
      this.tracker.event(TrackingCategory.Onboarding, TrackingEvent.OnboardingScenarioStarted, params);
    }

    private trackScenarioFinished(scenario: OnboardingScenario): void {
      const params = {
        authenticated: this.kwokkaService.client.isAuthenticated,
        scenarioName: scenario.name,
        steps: scenario.steps.length,
      };
      this.tracker.event(TrackingCategory.Onboarding, TrackingEvent.OnboardingScenarioFinished, params);
    }
  }
</script>

<style scoped lang="scss">
  .onboarding-presenter {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 1;

    &_is-transparent {
      pointer-events: none;
    }

    &_is-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;

      transition:
        opacity 500ms ease,
        visibility 500ms ease;
    }
  }
</style>
