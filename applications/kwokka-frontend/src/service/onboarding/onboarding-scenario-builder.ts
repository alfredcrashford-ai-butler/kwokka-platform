import { OnboardingScenario, type OnboardingScenarioStep } from './onboarding-scenario';

export class OnboardingScenarioBuilder {
  private name: string;
  private steps: OnboardingScenarioStep[];

  public constructor(name: string) {
    this.name = name;
    this.steps = [];
  }

  public addStep(step: OnboardingScenarioStep): OnboardingScenarioBuilder {
    this.steps.push(step);
    return this;
  }

  public build(): OnboardingScenario {
    return new OnboardingScenario(this.name, this.steps);
  }
}
