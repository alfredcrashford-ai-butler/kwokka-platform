<template>
  <MenuLayout class="card-set-view-animation">
    <TitleCard :heading="heading" class="card-set-view" @backClick="goBack()">
      <div class="card-set-view__content">
        <div class="card-set-view__cards-grid">
          <GameCard :data="data" v-for="data in cards" :key="data.cardId" v-ui-sound />
        </div>
      </div>
    </TitleCard>
  </MenuLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { UuidUtil } from '@kwokka/utils';
  import MenuLayout from '@/app/components/MenuLayout.vue';
  import { GameCard, TitleCard } from '@/app/components';
  import { PawsomeElementsCardSet } from '@/game-data/game-instance';
  import { CardElement, CardId, type CardState, CardType } from '@/game-data/card';
  import { RouteName } from '@/app/route-name';

  @Component({
    components: {
      MenuLayout,
      TitleCard,
      GameCard,
    },
  })
  export default class CardSetView extends Vue {
    private cardSet: PawsomeElementsCardSet = null;
    private backTo: string = null;
    public cards: CardState[] = [];

    public get heading(): string {
      if (!this.cardSet) {
        return '';
      }

      return `${this.$t('cardSet.title')}: ${this.$t(`cardSet.${this.cardSet}.title`)}`;
    }

    public mounted(): void {
      const { cardSet, backTo } = this.$route.query;
      this.cardSet = cardSet as any;
      this.backTo = backTo as any;
      if (!cardSet) {
        this.goBack();
      }

      this.generateCards();
    }

    public goBack(): void {
      this.$router.replace({ name: this.backTo || RouteName.Main });
    }

    private generateCards(): void {
      if (this.cardSet === PawsomeElementsCardSet.Standard) {
        return this.generateStandardCards();
      }

      this.goBack();
    }

    private generateStandardCards(): void {
      this.cards = [
        this.getCard(CardId.Arcane1, 1, CardElement.Arcane),
        this.getCard(CardId.Arcane2, 2, CardElement.Arcane),
        this.getCard(CardId.Arcane3, 3, CardElement.Arcane),
        this.getCard(CardId.Arcane4, 4, CardElement.Arcane),
        this.getCard(CardId.Arcane5, 5, CardElement.Arcane),
        this.getCard(CardId.Arcane6, 6, CardElement.Arcane),
        this.getCard(CardId.Arcane7, 7, CardElement.Arcane),
        this.getCard(CardId.Arcane8, 8, CardElement.Arcane),
        this.getCard(CardId.Arcane9, 9, CardElement.Arcane),
        this.getCard(CardId.ArcaneHydrant, 0, CardElement.Arcane, CardType.Special),
        // this.getCard(CardId.ArcaneSoundboard, 0, CardElement.Arcane, CardType.Interaction),
        this.getCard(CardId.ArcaneShaking, 0, CardElement.Arcane, CardType.Special),
        this.getCard(CardId.ArcaneTrashCanDiving, 0, CardElement.Arcane, CardType.Special),
        this.getCard(CardId.ArcaneTreatHiding, 0, CardElement.Arcane, CardType.Special),
        this.getCard(CardId.Nature1, 1, CardElement.Nature),
        this.getCard(CardId.Nature2, 2, CardElement.Nature),
        this.getCard(CardId.Nature3, 3, CardElement.Nature),
        this.getCard(CardId.Nature4, 4, CardElement.Nature),
        this.getCard(CardId.Nature5, 5, CardElement.Nature),
        this.getCard(CardId.Nature6, 6, CardElement.Nature),
        this.getCard(CardId.Nature7, 7, CardElement.Nature),
        this.getCard(CardId.Nature8, 8, CardElement.Nature),
        this.getCard(CardId.Nature9, 9, CardElement.Nature),
        this.getCard(CardId.NatureHydrant, 0, CardElement.Nature, CardType.Special),
        // this.getCard(CardId.NatureSoundboard, 0, CardElement.Nature, CardType.Interaction),
        this.getCard(CardId.NatureShaking, 0, CardElement.Nature, CardType.Special),
        this.getCard(CardId.NatureTrashCanDiving, 0, CardElement.Nature, CardType.Special),
        this.getCard(CardId.NatureTreatHiding, 0, CardElement.Nature, CardType.Special),
        this.getCard(CardId.Filth1, 1, CardElement.Filth),
        this.getCard(CardId.Filth2, 2, CardElement.Filth),
        this.getCard(CardId.Filth3, 3, CardElement.Filth),
        this.getCard(CardId.Filth4, 4, CardElement.Filth),
        this.getCard(CardId.Filth5, 5, CardElement.Filth),
        this.getCard(CardId.Filth6, 6, CardElement.Filth),
        this.getCard(CardId.Filth7, 7, CardElement.Filth),
        this.getCard(CardId.Filth8, 8, CardElement.Filth),
        this.getCard(CardId.Filth9, 9, CardElement.Filth),
        this.getCard(CardId.FilthHydrant, 0, CardElement.Filth, CardType.Special),
        // this.getCard(CardId.FilthSoundboard, 0, CardElement.Filth, CardType.Interaction),
        this.getCard(CardId.FilthShaking, 0, CardElement.Filth, CardType.Special),
        this.getCard(CardId.FilthTrashCanDiving, 0, CardElement.Filth, CardType.Special),
        this.getCard(CardId.FilthTreatHiding, 0, CardElement.Filth, CardType.Special),
        this.getCard(CardId.Multimatter, 0, CardElement.Multimatter, CardType.Special),
        this.getCard(CardId.BallOfFortune, 0, CardElement.Multimatter, CardType.Interaction),
      ];
    }

    private getCard(cardId: CardId, power: number, element: CardElement, type: CardType = CardType.Common): CardState {
      return {
        cardInGameId: UuidUtil.generate(),
        cardId,
        config: { element, power, type },
        effects: [],
      };
    }
  }
</script>

<style lang="scss">
  .card-set-view-animation {
    &.v-enter-active {
      transition-duration: 1.3s;

      .card-set-view {
        animation-name: UiAnimationSlideInTop, UiAnimationFadeIn;
        animation-timing-function: UiTransition(spring), linear;
        animation-fill-mode: backwards;
        animation-duration: 1.3s, 500ms;
      }
    }

    &.v-leave-active {
      transition-duration: 500ms;

      .card-set-view {
        animation-name: UiAnimationSlideOutTop, UiAnimationFadeOut;
        animation-timing-function: ease, linear;
        animation-duration: 500ms;
      }
    }
  }
</style>

<style scoped lang="scss">
  .card-set-view {
    height: 100%;
    width: 100%;
    animation-fill-mode: both;

    &__content {
      height: 100%;
      width: 100%;
      container-type: size;
      overflow: auto;
      background-color: #000;
    }

    &__cards-grid {
      width: 100%;
      @include UiGap(4);
      @include UiPadding(4);

      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(UiSpacing(25), 1fr));
      background-image: linear-gradient(UiColor(secondary-300, 0.5), UiColor(secondary-900, 0.5));

      & > * {
        @include UiButtonAppearance();

        transition: transform ease 100ms;

        &:hover,
        &:focus-visible,
        &:active {
          transform: scale(1.05);
        }
      }
    }
  }
</style>
