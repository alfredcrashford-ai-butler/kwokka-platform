import type { Bounds } from '@/util';

enum OnboardingScenarioState {
  Ready = 'ready',
  InProgress = 'in_progress',
  Finished = 'finished',
}

export interface OnboardingStep {
  name: string;
  actions: OnboardingAction[];
}

export interface CommonOnboardingAction {
  type: OnboardingActionType;
}

export type OnboardingAction =
  | CustomOnboardingAction
  | ElementHighlightOnboardingAction
  | ElementHighlightByPositionOnboardingAction
  | NarratorDialogOnboardingAction
  | TransparentOnboardingAction
  | ClickOnboardingAction
  | ClickByPositionOnboardingAction
  | LockInteractionOnboardingAction
  | DragOnboardingAction
  | DragByPositionOnboardingAction;

export enum OnboardingActionType {
  Custom = 'custom',
  NarratorDialog = 'narrator_dialog',
  ElementHighlight = 'element_highlight',
  ClickInteraction = 'click_interaction',
  DragInteraction = 'drag_interaction',
  LockInteraction = 'lock_interaction',
  Transparent = 'transparent',

  ElementHighlightByPosition = 'element_highlight_by_position',
  ClickInteractionByPosition = 'click_interaction_by_position',
  DragInteractionByPosition = 'drag_interaction_by_position',
}

export interface CustomOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.Custom;
  handle: (scenario: OnboardingScenario) => any;
}

export interface ElementHighlightOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.ElementHighlight;
  selector: string;
  shape?: 'rect' | 'circle';
}

export interface NarratorDialogOnboardingActionOption {
  translationToken: string;
  transitionTo: string;
  key: string;
}

export interface NarratorDialogOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.NarratorDialog;
  titleTranslationToken: string;
  bodyTranslationToken: string;
  options: NarratorDialogOnboardingActionOption[];
  size?: 'lg' | 'md' | 'sm';
}

export interface TransparentOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.Transparent;
}

export interface ClickOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.ClickInteraction;
  selector: string;
}

export interface LockInteractionOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.LockInteraction;
  selector?: string;
}

export interface DragOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.DragInteraction;
  fromSelector: string;
  toSelector: string;
}

export interface ElementHighlightByPositionOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.ElementHighlightByPosition;
  getPosition: (scenario: OnboardingScenario) => Bounds;
  shape?: 'rect' | 'circle';
}

export interface ClickByPositionOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.ClickInteractionByPosition;
  getPosition: (scenario: OnboardingScenario) => Bounds;
}

export interface DragByPositionOnboardingAction extends CommonOnboardingAction {
  type: OnboardingActionType.DragInteractionByPosition;
  getFromPosition: (scenario: OnboardingScenario) => Bounds;
  getToPosition: (scenario: OnboardingScenario) => Bounds;
}

export class OnboardingScenario {
  private state: OnboardingScenarioState = OnboardingScenarioState.Ready;
  private _currentStep?: OnboardingStep;

  public constructor(
    public readonly name: string,
    public readonly steps: OnboardingStep[],
  ) {}

  public run(): void {
    if (this.state !== OnboardingScenarioState.Ready) {
      return;
    }
    this.state = OnboardingScenarioState.InProgress;
  }

  public runStep(name: string): void {
    const step = this.getStep(name);
    if (!step) {
      return;
    }

    this.activateStep(step);
  }

  public getStep(name: string): OnboardingStep {
    return this.steps.find((el) => el.name === name);
  }

  public get currentStep(): OnboardingStep {
    return this._currentStep;
  }

  public get currentStepIndex(): number {
    return this.steps?.findIndex((el) => el.name === this._currentStep?.name);
  }

  public get isFinished(): boolean {
    return this.state === OnboardingScenarioState.Finished;
  }

  public finish(): void {
    this.state = OnboardingScenarioState.Finished;
  }

  private activateStep(step: OnboardingStep): void {
    this._currentStep = step;
  }
}
