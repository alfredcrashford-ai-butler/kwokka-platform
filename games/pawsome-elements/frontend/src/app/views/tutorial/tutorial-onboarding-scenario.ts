import type { CardState } from '@/game-data/card';
import {
  OnboardingActionType,
  OnboardingScenario,
  OnboardingService,
  type CustomOnboardingAction,
  type OnboardingStep,
} from '@/service';
import type { PwsmGame } from '@/game';
import { PwsmTutorialGameInstanceEntity } from './pwsm-tutorial-game-instance.entity';
import { IDS, PLAYER_IDS } from './constants';

const INTERACTIVE_LOCK_ID = 'tutorial_interactive_lock';

const STEP_TIMEOUT_MS = 2000;
const STEPS = {
  Step1: 'step1',
  Step2p1: 'step2p1',
  Step2p2: 'step2p2',
  Step2p3: 'step2p3',
  Step2p4: 'step2p4',
  Step3: 'step3',
  Step4: 'step4',
  Step5: 'step5',
  Step6p1: 'step6p1',
  Step6p2: 'step6p2',
  Step6p3: 'step6p3',
  Step7: 'step7',
  Step8p1: 'step8p1',
  Step8p2: 'step8p2',
  Step8p3: 'step8p3',
  Step9p1: 'step9p1',
  Step9p2: 'step9p2',
  Step9p3: 'step9p3',
  Step10p1: 'step10p1',
  Step10p2: 'step10p2',
  Step10p3: 'step10p3',
  Step10p4: 'step10p4',
  Step10p5: 'step10p5',
  Step10p6: 'step10p6',
  Step11: 'step11',
  Step12p1: 'step12p1',
  Step12p2: 'step12p2',
  Step12p3: 'step12p3',
  Step12p4: 'step12p4',
  Step12p5: 'step12p5',
  Step12p6: 'step12p6',
  Step12p7: 'step12p7',
  Step12p8: 'step12p8',
  Step13: 'step12',
  Step14p1: 'step14p1',
  Step14p2: 'step14p2',
  Step14p3: 'step14p3',
  Step14p4: 'step14p4',
  Step14p5: 'step14p5',
  Step15: 'step15',
  Step16p1: 'step16p1',
  Step16p2: 'step16p2',
  Step16p3: 'step16p3',
  Step17p1: 'step17p1',
  Step17p2: 'step17p2',
};

const DISABLE_INTERACTIONS_ACTION: CustomOnboardingAction = {
  type: OnboardingActionType.Custom,
  handle: (scenario: TutorialOnboardingScenario) => scenario.game.setInteractiveLock(INTERACTIVE_LOCK_ID, true),
};
const ENABLE_INTERACTIONS_ACTION: CustomOnboardingAction = {
  type: OnboardingActionType.Custom,
  handle: (scenario: TutorialOnboardingScenario) => scenario.game.setInteractiveLock(INTERACTIVE_LOCK_ID, false),
};

const SCENARIO_NAME = 'tutorial';
const SCENARIO_STEPS: OnboardingStep[] = [
  {
    name: STEPS.Step1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step1',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step2p1, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step2p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step2',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step2p2, key: 'ok' }],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Filth6),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step2p2,
    actions: [
      {
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Filth6),
        getToPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDiscardPileBounds(),
      },
      { type: OnboardingActionType.Transparent },
      {
        type: OnboardingActionType.LockInteraction,
        selector: '[data-game-container],[data-game-settings],[data-app-dialog-container]',
      },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step2p3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.onboarding.runStep(TutorialOnboardingScenario.steps.Step2p4), STEP_TIMEOUT_MS);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step2p4,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step3',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step3, key: 'ok' }],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getPlayerBounds(PLAYER_IDS.Opponent1Id),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 2);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 3);
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step4), STEP_TIMEOUT_MS * 4);
        },
      },
    ],
  },
  {
    name: STEPS.Step4,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step4',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step5, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step5,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step5',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step6p1, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step6p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step6',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step6p2, key: 'ok' }],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Arcane5),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step6p2,
    actions: [
      {
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Arcane5),
        getToPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDiscardPileBounds(),
      },
      { type: OnboardingActionType.Transparent },
      {
        type: OnboardingActionType.LockInteraction,
        selector: '[data-game-container],[data-game-settings],[data-app-dialog-container]',
      },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step6p3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 2);
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step7), STEP_TIMEOUT_MS * 3);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step7,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step7',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step8p1, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step8p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step8',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step8p2, key: 'ok' }],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Nature2),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step8p2,
    actions: [
      {
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Nature2),
        getToPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDiscardPileBounds(),
      },
      { type: OnboardingActionType.Transparent },
      {
        type: OnboardingActionType.LockInteraction,
        selector: '[data-game-container],[data-game-settings],[data-app-dialog-container]',
      },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step8p3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step9p1), STEP_TIMEOUT_MS * 2);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step9p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step9',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step9p2, key: 'ok' }],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.NatureShaking),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step9p2,
    actions: [
      {
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.NatureShaking),
        getToPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDiscardPileBounds(),
      },
      { type: OnboardingActionType.Transparent },
      {
        type: OnboardingActionType.LockInteraction,
        selector: '[data-game-container],[data-game-settings],[data-app-dialog-container]',
      },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step9p3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 2);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 3);
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step10p1), STEP_TIMEOUT_MS * 4);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step10p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step10',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step10p2, key: 'ok' }],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.ArcaneHydrant),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step10p2,
    actions: [
      {
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.ArcaneHydrant),
        getToPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDiscardPileBounds(),
      },
      { type: OnboardingActionType.Transparent },
      {
        type: OnboardingActionType.LockInteraction,
        selector: '[data-game-container],[data-game-settings],[data-app-dialog-container]',
      },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step10p3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => scenario.gameInstance.next(),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step10p4,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step10p5), STEP_TIMEOUT_MS);
        },
      },
    ],
  },
  {
    name: STEPS.Step10p5,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step11',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step10p6, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step10p6,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 2);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 3);
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step12p1), STEP_TIMEOUT_MS * 4);
        },
      },
    ],
  },
  {
    name: STEPS.Step12p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step12',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step12p2, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step12p2,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step13',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step12p3, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step12p3,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step14',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step12p4, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step12p4,
    actions: [
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getPlayerSkillBounds(PLAYER_IDS.PlayerId),
      },
      { type: OnboardingActionType.Transparent },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step12p5,
    actions: [
      {
        type: OnboardingActionType.ClickInteractionByPosition,
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getPlayerBounds(PLAYER_IDS.Opponent1Id),
      },
      { type: OnboardingActionType.Transparent },
    ],
  },
  {
    name: STEPS.Step12p6,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step12p7), STEP_TIMEOUT_MS);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step12p7,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step15',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step12p8, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step12p8,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS * 2);
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step13), STEP_TIMEOUT_MS * 3);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },

  {
    name: STEPS.Step13,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step16',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step14p1, key: 'ok' }],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step14p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step17',
        options: [{ translationToken: 'onboarding.ok', transitionTo: STEPS.Step14p2, key: 'ok' }],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDeckBounds(),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step14p2,
    actions: [
      {
        type: OnboardingActionType.ClickInteractionByPosition,
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDeckBounds(),
      },
      { type: OnboardingActionType.Transparent },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step14p3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => {
            scenario.gameInstance.next();
            scenario.onboarding.runStep(STEPS.Step14p4);
          }, STEP_TIMEOUT_MS * 2);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step14p4,
    actions: [
      {
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Filth4),
        getToPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDiscardPileBounds(),
      },
      { type: OnboardingActionType.Transparent },
      {
        type: OnboardingActionType.LockInteraction,
        selector: '[data-game-container],[data-game-settings],[data-app-dialog-container]',
      },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step14p5,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          setTimeout(() => scenario.gameInstance.next(), STEP_TIMEOUT_MS);
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step15), STEP_TIMEOUT_MS * 2);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step15,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step18',
        options: [
          {
            translationToken: 'onboarding.ok',
            transitionTo: STEPS.Step16p1,
            key: 'ok',
          },
        ],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Multimatter),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step16p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step19',
        options: [
          {
            translationToken: 'onboarding.ok',
            transitionTo: STEPS.Step16p2,
            key: 'ok',
          },
        ],
      },
      {
        type: OnboardingActionType.ElementHighlightByPosition,
        shape: 'circle',
        getPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Multimatter),
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step16p2,
    actions: [
      {
        type: OnboardingActionType.DragInteractionByPosition,
        getFromPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getCardBounds(IDS.Multimatter),
        getToPosition: (scenario: TutorialOnboardingScenario) => scenario.game.getDiscardPileBounds(),
      },
      { type: OnboardingActionType.Transparent },
      {
        type: OnboardingActionType.LockInteraction,
        selector: '[data-game-container],[data-game-settings],[data-app-dialog-container]',
      },
      ENABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step16p3,
    actions: [
      { type: OnboardingActionType.LockInteraction, selector: '[data-game-settings],[data-app-dialog-container]' },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => {
          scenario.gameInstance.next();
          scenario.gameInstance.finish();
          setTimeout(() => scenario.onboarding.runStep(STEPS.Step17p1), STEP_TIMEOUT_MS);
        },
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step17p1,
    actions: [
      {
        size: 'sm',
        type: OnboardingActionType.NarratorDialog,
        titleTranslationToken: 'onboarding.narratorTitle',
        bodyTranslationToken: 'onboarding.tutorial.step20',
        options: [
          {
            translationToken: 'onboarding.ok',
            transitionTo: STEPS.Step17p2,
            key: 'ok',
          },
        ],
      },
      DISABLE_INTERACTIONS_ACTION,
    ],
  },
  {
    name: STEPS.Step17p2,
    actions: [
      { type: OnboardingActionType.LockInteraction },
      {
        type: OnboardingActionType.Custom,
        handle: (scenario: TutorialOnboardingScenario) => scenario.onCompleted(),
      },
    ],
  },
];

export class TutorialOnboardingScenario extends OnboardingScenario {
  public static readonly steps = STEPS;
  public gameInstance: PwsmTutorialGameInstanceEntity;
  public game: PwsmGame;

  public constructor(
    public readonly onboarding: OnboardingService,
    public readonly onFail: () => any,
    public readonly onTransition: (gameInstance: PwsmTutorialGameInstanceEntity) => any,
    public readonly onCompleted: () => any,
  ) {
    super(SCENARIO_NAME, SCENARIO_STEPS);
    (window as any).MY_ONBOARDING = this.onboarding;
    this.gameInstance = new PwsmTutorialGameInstanceEntity((gameInstance) => {
      this.gameInstance = gameInstance;
      onTransition(gameInstance);
    });
  }

  public setGame(game: PwsmGame): void {
    this.game = game;
  }

  public onSkipTurn(): void {
    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step14p2)) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step14p3);
      return;
    }

    this.onFail();
  }

  public onInteractCard(): void {
    this.onboarding.runStep(TutorialOnboardingScenario.steps.Step10p4);
  }

  public onPlayCard(card: CardState): void {
    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step2p2) && card.cardInGameId === IDS.Filth6) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step2p3);
      return;
    }

    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step6p2) && card.cardInGameId === IDS.Arcane5) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step6p3);
      return;
    }

    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step9p2) && card.cardInGameId === IDS.NatureShaking) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step9p3);
      return;
    }

    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step10p2) && card.cardInGameId === IDS.ArcaneHydrant) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step10p3);
      return;
    }

    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step16p2) && card.cardInGameId === IDS.Multimatter) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step16p3);
      return;
    }

    this.onFail();
  }

  public onPlayCardInOthersTurn(card: CardState): void {
    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step8p2) && card.cardInGameId === IDS.Nature2) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step8p3);
      return;
    }

    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step14p4) && card.cardInGameId === IDS.Filth4) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step14p5);
      return;
    }

    this.onFail();
  }

  public onSkillClick(): void {
    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step12p4)) {
      this.onboarding.runStep(TutorialOnboardingScenario.steps.Step12p5);
      return;
    }

    this.onFail();
  }

  public onSkillPlay(targetPlayerId: string): void {
    if (this.onboarding.isStep(TutorialOnboardingScenario.steps.Step12p5)) {
      if (targetPlayerId === PLAYER_IDS.Opponent1Id) {
        this.onboarding.runStep(TutorialOnboardingScenario.steps.Step12p6);
      } else {
        this.onboarding.runStep(TutorialOnboardingScenario.steps.Step12p4);
        this.onFail();
      }

      return;
    }

    this.onFail();
  }
}
