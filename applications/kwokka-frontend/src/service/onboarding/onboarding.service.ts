import { injectable } from 'inversify';
import type { OnboardingScenario } from './onboarding-scenario';

export interface OnboardingSubscriber {
  onRunScenario: (scenario: OnboardingScenario) => any;
  onFinishScenario: (scenario: OnboardingScenario) => any;
}

@injectable()
export abstract class OnboardingService {
  public abstract runScenario(scenario: OnboardingScenario): OnboardingScenario;
  public abstract finishScenario(scenario: OnboardingScenario): OnboardingScenario;
  public abstract subscribe(subscriber: OnboardingSubscriber): () => void;
  public abstract unsubscribeAll(): void;
}
