import { injectable } from 'inversify';
import { OnboardingScenario } from './onboarding-scenario';
import { OnboardingService, type OnboardingSubscriber } from './onboarding.service';

@injectable()
export class OnboardingServiceImpl extends OnboardingService {
  private subscribers: OnboardingSubscriber[] = [];

  public runScenario(scenario: OnboardingScenario): OnboardingScenario {
    if (scenario.isFinished) {
      throw new RangeError('Scenario is already finished!');
    }

    this.subscribers.forEach((sub) => sub.onRunScenario && sub.onRunScenario(scenario));

    return scenario;
  }

  public finishScenario(scenario: OnboardingScenario): OnboardingScenario {
    if (scenario.isFinished) {
      throw new RangeError('Scenario is already finished!');
    }

    scenario.finish();

    this.subscribers.forEach((sub) => sub.onFinishScenario && sub.onFinishScenario(scenario));

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
