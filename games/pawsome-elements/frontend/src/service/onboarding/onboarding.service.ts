import { injectable } from 'inversify';
import { OnboardingScenario, type OnboardingStep } from './onboarding-scenario';
import { ArrayUtil } from '@kwokka/utils';

export interface OnboardingSubscriber {
  onRunScenario: (scenario: OnboardingScenario) => any;
  onFinishScenario: (scenario: OnboardingScenario) => any;
  onRunStep?: (scenario: OnboardingScenario, step: OnboardingStep) => any;
}

@injectable()
export class OnboardingService {
  private scenario: OnboardingScenario = null;
  private subscribers: OnboardingSubscriber[] = [];

  public get isRunning(): boolean {
    return Boolean(this.scenario);
  }

  public runScenario(scenario: OnboardingScenario): OnboardingScenario {
    if (this.scenario) {
      this.finishScenario();
    }

    this.scenario = scenario;
    scenario.run();
    this.subscribers.forEach((sub) => sub.onRunScenario && sub.onRunScenario(scenario));
    const firstStep = ArrayUtil.first(this.scenario.steps);
    this.runStep(firstStep.name);

    return scenario;
  }

  public isStep(name: string): boolean {
    const scenario = this.scenario;
    if (!scenario) {
      throw new RangeError('No active onboarding scenario.');
    }

    return scenario.currentStep?.name === name;
  }

  public runStep(name: string): OnboardingScenario {
    const scenario = this.scenario;
    if (!scenario) {
      throw new RangeError('No active onboarding scenario.');
    }

    if (scenario.isFinished) {
      throw new RangeError('Scenario is already finished.');
    }

    const step = scenario.getStep(name);
    if (!step) {
      throw new RangeError(`Step does not exist in onboarding scenario: ${name}.`);
    }

    scenario.runStep(name);
    this.subscribers.forEach((sub) => sub.onRunStep && sub.onRunStep(scenario, step));

    return scenario;
  }

  public finishScenario(): OnboardingScenario {
    const scenario = this.scenario;
    if (!scenario) {
      return;
    }

    if (scenario.isFinished) {
      this.scenario = null;
      return;
    }

    scenario.finish();
    this.subscribers.forEach((sub) => sub.onFinishScenario && sub.onFinishScenario(scenario));
    this.scenario = null;

    return scenario;
  }

  public subscribe(subscriber: OnboardingSubscriber): () => void {
    this.subscribers.push(subscriber);
    return () => (this.subscribers = this.subscribers.filter((el) => el !== subscriber));
  }

  public unsubscribeAll(): void {
    this.subscribers = [];
  }
}
