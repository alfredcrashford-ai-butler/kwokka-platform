<template>
  <GameResults ref="gameResults" :gameInstance="gameInstance" :playerId="playerId" @transitionEnd="currentSection += 1">
    <RatingResultsSection
      v-if="currentSection === 1"
      :gameInstance="gameInstance"
      :playerId="playerId"
      @next="currentSection += 1"
    />
    <RewardResultsSection
      v-if="currentSection === 2"
      :gameInstance="gameInstance"
      :playerId="playerId"
      @next="currentSection += 1"
      @doubleReward="gameResults.showDoubleReward()"
    />
    <!-- TODO: add rating results with breakdown -->
    <ThankYouResultsSection v-if="currentSection === 3" :actions="thankYouActions" :gameInstance="gameInstance" />
  </GameResults>
</template>

<script lang="ts">
  import { Component, Ref } from 'vue-facing-decorator';
  import { CommonGameComponent } from '../components/common-game-component';
  import {
    GameResults,
    RatingResultsSection,
    RewardResultsSection,
    ThankYouResultsSection,
    ThankYouAction,
  } from './components';

  @Component({
    components: {
      GameResults,
      RewardResultsSection,
      ThankYouResultsSection,
      RatingResultsSection,
    },
  })
  export default class PracticeGameResults extends CommonGameComponent {
    @Ref()
    public gameResults: GameResults;

    public currentSection = 0;
    public readonly thankYouActions = [ThankYouAction.Menu, ThankYouAction.ReplayRankedMatch];
  }
</script>
