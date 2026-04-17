<template>
  <div class="game-state">
    <Game
      v-if="isLoaded"
      :gameInstance="gameInstance"
      :turnDuration="turnDuration"
      :playerId="playerId"
      :cardBack="cardBack"
      :arena="arena"
      :cardSkins="cardSkins"
      :connectivity="controller.connectivity"
      @skipTurn="onSkipTurn()"
      @interactCard="onInteractCard($event)"
      @playSkill="onPlaySkill($event)"
      @playCard="onPlayCard($event)"
      @playCardInOthersTurn="onPlayCardInOthersTurn($event)"
      @leave="onLeave()"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Watch } from 'vue-facing-decorator';
  import { CommonGameComponent } from '../components/common-game-component';
  import type { CardState } from '@/game-data/card';
  import type { ArenaItemKey, CardBackItemKey, CardSkinItemKey } from '@/game-data/item-key';
  import { TraitKey } from '@/game-data/trait-key';
  import { RouteName } from '@/app/route-name';
  import { Game } from '@/app/components';

  @Component({
    components: {
      Game,
    },
  })
  export default class GameState extends CommonGameComponent {
    public cardBack: CardBackItemKey = null;
    public arena: ArenaItemKey = null;
    public cardSkins: CardSkinItemKey[] = null;
    public turnDuration: number = null;
    public isLoaded = false;

    public async mounted(): Promise<void> {
      await this.fetchCardBack();
      await this.fetchArena();
      await this.fetchCardSkins();
      this.isLoaded = true;
    }

    public onLeave(): void {
      // TODO: implement proper leave game mechanism
      // this.controller.sendLeaveAction();
      this.$router.replace({ name: RouteName.Main });
    }

    public onSkipTurn(): void {
      this.controller.sendSkipTurnAction();
    }

    public onInteractCard(data: any): void {
      this.controller.sendInteractCardAction(data);
    }

    public onPlaySkill(data: any): void {
      this.controller.sendPlaySkillAction(data);
    }

    public onPlayCard(card: CardState): void {
      this.controller.sendPlayCardAction(card);
    }

    public onPlayCardInOthersTurn(card: CardState): void {
      this.controller.sendPlayCardInOthersTurnAction(card);
    }

    @Watch('gameInstance.state.publicState.turnEndAt', { immediate: true })
    public calculateTurnDuration(turnEndAt: number): void {
      if (!turnEndAt) {
        this.turnDuration = null;
        return;
      }

      const currentTime = Date.now();
      this.turnDuration = this.connection.getTimestampWithOffset(turnEndAt - currentTime);
    }

    private async fetchCardBack(): Promise<void> {
      try {
        const trait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.EquippedCardBack);
        if (!trait?.value) {
          return;
        }
        const item = await this.kwokkaService.client.inventory.getItemById(trait.value);
        this.cardBack = item.key as CardBackItemKey;
      } catch (e) {
        this.logger.error('Error occurred when fetching card back.', e);
        this.errorTracker.captureError(e);
      }
    }

    private async fetchArena(): Promise<void> {
      try {
        const trait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.EquippedArena);
        if (!trait?.value) {
          return;
        }
        const item = await this.kwokkaService.client.inventory.getItemById(trait.value);
        this.arena = item.key as ArenaItemKey;
      } catch (e) {
        this.logger.error('Error occurred when fetching arena.', e);
        this.errorTracker.captureError(e);
      }
    }

    private async fetchCardSkins(): Promise<void> {
      try {
        const traits = await this.kwokkaService.client.trait.getOwnTraitInstancesByKeys([
          TraitKey.EquippedCardSkinSpecial,
          TraitKey.EquippedCardSkinSpitz,
          TraitKey.EquippedCardSkinYork,
          TraitKey.EquippedCardSkinDoxie,
          TraitKey.EquippedCardSkinPug,
          TraitKey.EquippedCardSkinCorgi,
          TraitKey.EquippedCardSkinRetriever,
          TraitKey.EquippedCardSkinHusky,
          TraitKey.EquippedCardSkinDobermann,
          TraitKey.EquippedCardSkinLabradoodle,
        ]);
        const itemIds = traits.filter((el) => el?.value).map((el) => el.value);
        const items = itemIds.length ? await this.kwokkaService.client.inventory.getItemsByIds(itemIds) : [];
        const cardSkinKeys = items.map((el) => el.key);
        this.cardSkins = cardSkinKeys as CardSkinItemKey[];
      } catch (e) {
        this.logger.error('Error occurred when fetching card skins.', e);
        this.errorTracker.captureError(e);
      }
    }
  }
</script>

<style scoped lang="scss">
  .game-state {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
</style>
