export interface OnboardingScenarioStep {
  name: string;
  highlightElement: Element;
  title: string;
  placement?: 'bottom' | 'top';
  text?: string;
  isSkipScroll?: boolean;
  isBlur?: boolean;
  isPrimaryButtonHidden?: boolean;
  isPrimaryButtonDisabled?: boolean;
  primaryButtonText?: string;
  onPrimaryButtonClick?: (scenario: OnboardingScenario) => any;
  isSecondaryButtonHidden?: boolean;
  isSecondaryButtonDisabled?: boolean;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: (scenario: OnboardingScenario) => any;
}

export class OnboardingScenario {
  private _isFinished = false;
  private _name: string;
  private steps: OnboardingScenarioStep[] = [];
  private _currentStepName: string;

  public constructor(name: string, stepConfigs: OnboardingScenarioStep[]) {
    if (!stepConfigs?.length) {
      throw new RangeError('Scenario can not be empty!');
    }
    this._name = name;
    this.steps = stepConfigs;
    this._currentStepName = this.steps[0].name;
  }

  public get currentStepName(): string {
    return this._currentStepName;
  }

  public get name(): string {
    return this._name;
  }

  public get isFinished(): boolean {
    return this._isFinished || !this._currentStepName;
  }

  public get totalStepsNum(): number {
    return this.steps.length;
  }

  public get currentStepNum(): number {
    if (this.isFinished) {
      return -1;
    }
    return this.currentStepIndex + 1;
  }

  private get currentStepIndex(): number {
    if (this.isFinished) {
      return -1;
    }
    return this.steps.indexOf(this.currentStep);
  }

  public get currentStep(): OnboardingScenarioStep {
    if (this.isFinished) {
      return null;
    }
    const step = this.getStep(this._currentStepName);
    return Object.freeze(step);
  }

  public next(): void {
    if (this.isFinished) {
      return;
    }

    const nextIndex = this.currentStepIndex + 1;
    if (nextIndex < this.totalStepsNum) {
      this._currentStepName = this.steps[nextIndex].name;
    } else {
      this.finish();
    }
  }

  public finish(): void {
    this._isFinished = true;
    this._currentStepName = null;
  }

  private getStep(name: string) {
    return this.steps.find((step) => step.name === name);
  }
}
