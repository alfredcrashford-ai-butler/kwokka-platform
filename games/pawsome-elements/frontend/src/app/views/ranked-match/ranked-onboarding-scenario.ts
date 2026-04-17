import { OnboardingActionType, OnboardingScenario, type OnboardingStep } from '@/service';

const SCENARIO_NAME = 'ranked';
const INFO_SECTION_SELECTOR = '[data-ranked-info-section]';
const ACTION_SECTION_SELECTOR = '[data-ranked-action-section]';
const SCENARIO_STEPS: OnboardingStep[] = [
  {
    name: 'ranked1',
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.ranked.step1',
        options: [
          {
            translationToken: 'onboarding.ok',
            transitionTo: 'ranked2',
            key: 'ok',
          },
        ],
      },
    ],
  },
  {
    name: 'ranked2',
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.ranked.step2',
        options: [
          {
            translationToken: 'onboarding.ok',
            transitionTo: 'ranked3',
            key: 'ok',
          },
        ],
      },
      {
        type: OnboardingActionType.ElementHighlight,
        selector: INFO_SECTION_SELECTOR,
        shape: 'rect',
      },
    ],
  },
  {
    name: 'ranked3',
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.ranked.step3',
        options: [
          {
            translationToken: 'onboarding.ok',
            transitionTo: 'ranked4',
            key: 'ok',
          },
        ],
      },
      {
        type: OnboardingActionType.ElementHighlight,
        selector: ACTION_SECTION_SELECTOR,
        shape: 'rect',
      },
    ],
  },
  {
    name: 'ranked4',
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.ranked.step4',
        options: [
          {
            translationToken: 'onboarding.ok',
            transitionTo: 'finish',
            key: 'ok',
          },
        ],
      },
    ],
  },
  {
    name: 'finish',
    actions: [
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: RankedOnboardingScenario) => scenario.onFinish(),
      },
    ],
  },
];

export class RankedOnboardingScenario extends OnboardingScenario {
  private finishHandler: () => any;

  public constructor() {
    super(SCENARIO_NAME, SCENARIO_STEPS);
  }

  public setFinishHandler(handler: () => any): void {
    this.finishHandler = handler;
  }

  public onFinish(): void {
    this.finish();
    this.finishHandler?.();
  }
}
