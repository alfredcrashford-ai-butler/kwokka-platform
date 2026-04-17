<template>
  <div class="tutorial-view">
    <Game
      v-if="gameInstance"
      ref="game"
      :gameInstance="gameInstance"
      :turnDuration="null"
      :playerId="playerId"
      :connectivity="connectivity"
      @skillClick="onSkillClick()"
      @playSkill="onPlaySkill($event)"
      @skipTurn="onSkipTurn()"
      @interactCard="onInteractCard()"
      @playCard="onPlayCard($event)"
      @playCardInOthersTurn="onPlayCardInOthersTurn($event)"
      @ready="onReady()"
      @leave="onLeave()"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import {
    KwokkaService,
    OnboardingService,
    PersistenceKey,
    PersistenceService,
    SoundService,
    TrackerService,
  } from '@/service';
  import type { CardState } from '@/game-data/card';
  import { Game } from '@/app/components';
  import { TutorialOnboardingScenario } from './tutorial-onboarding-scenario';
  import { PwsmTutorialGameInstanceEntity } from './pwsm-tutorial-game-instance.entity';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import { RouteName } from '@/app/route-name';
  import { PLAYER_IDS } from './constants';

  const ONBOARDING_TIMEOUT_MS = 3000;

  @Component({
    components: {
      Game,
    },
  })
  export default class TutorialView extends Vue {
    @Ref()
    public game: Game;

    @LazyInject(OnboardingService)
    public onboardingService: OnboardingService;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(TrackerService)
    public trackerService: TrackerService;

    @LazyInject(SoundService)
    public soundService: SoundService;

    @LazyInject(PersistenceService)
    public persistenceService: PersistenceService;

    public readonly playerId = PLAYER_IDS.PlayerId;
    public readonly connectivity = { [PLAYER_IDS.PlayerId]: true };
    private scenario: TutorialOnboardingScenario = null;
    private onboardingTimeout?: number;
    public gameInstance: PwsmTutorialGameInstanceEntity = null;

    public mounted(): void {
      this.scenario = new TutorialOnboardingScenario(
        this.onboardingService,
        () => this.soundService.playCardPlayFail(),
        (gameInstance) => (this.gameInstance = gameInstance),
        this.onCompleted.bind(this),
      );
      const eventParams = { authenticated: this.kwokkaService.client.isAuthenticated };
      this.trackerService.event(TrackingCategory.Onboarding, TrackingEvent.TutorialStarted, eventParams);
      this.gameInstance = this.scenario?.gameInstance;
    }

    public beforeUnmount(): void {
      this.onboardingService.finishScenario();
      clearTimeout(this.onboardingTimeout);
    }

    public onReady(): void {
      this.scenario.setGame(this.game.game);
      this.onboardingTimeout = setTimeout(
        () => this.onboardingService.runScenario(this.scenario),
        ONBOARDING_TIMEOUT_MS,
      );
    }

    public onLeave(): void {
      const stepName = this.scenario.currentStep;
      const step = this.scenario.currentStepIndex;
      const totalSteps = this.scenario.steps.length;
      this.onboardingService.finishScenario();
      this.trackerService.event(TrackingCategory.Onboarding, TrackingEvent.TutorialLeft, {
        step,
        totalSteps,
        stepName,
      });
      this.persistTutorialCompleted();
      this.$router.replace({ name: RouteName.Main });
    }

    public onSkipTurn(): void {
      if (!this.onboardingService.isRunning) {
        this.soundService.playCardPlayFail();
        return;
      }

      this.scenario.onSkipTurn();
    }

    public onSkillClick(): void {
      if (!this.onboardingService.isRunning) {
        this.soundService.playCardPlayFail();
        return;
      }

      this.scenario.onSkillClick();
    }

    public onPlaySkill(data: { playerId: string }): void {
      if (!this.onboardingService.isRunning) {
        this.soundService.playCardPlayFail();
        return;
      }

      this.scenario.onSkillPlay(data.playerId);
    }

    public onInteractCard(): void {
      if (!this.onboardingService.isRunning) {
        this.soundService.playCardPlayFail();
        return;
      }

      this.scenario.onInteractCard();
    }

    public onPlayCard(card: CardState): void {
      if (!this.onboardingService.isRunning) {
        this.soundService.playCardPlayFail();
        return;
      }

      this.scenario.onPlayCard(card);
    }

    public onPlayCardInOthersTurn(card: CardState): void {
      if (!this.onboardingService.isRunning) {
        this.soundService.playCardPlayFail();
        return;
      }

      this.scenario.onPlayCardInOthersTurn(card);
    }

    public onCompleted(): void {
      this.onboardingService.finishScenario();
      const eventParams = { authenticated: this.kwokkaService.client.isAuthenticated };
      this.trackerService.event(TrackingCategory.Onboarding, TrackingEvent.TutorialCompleted, eventParams);
      this.persistTutorialCompleted();
      if (this.kwokkaService.client.isAuthenticated) {
        this.$router.replace({ name: RouteName.Main });
      } else {
        this.$router.replace({ name: RouteName.Auth });
      }
    }

    private persistTutorialCompleted(): void {
      this.persistenceService.storeValue(PersistenceKey.OnboardingV1Completed, 'true');
    }
  }
</script>

<style scoped lang="scss">
  .tutorial-view {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
