<template>
  <div
    class="game-card"
    :style="{
      '--pwsm-game-card-element': `url('/static/game/card/element_icon/${data.config.element}.webp')`,
      '--pwsm-game-card-stone': `url(/static/game/card/stone/${data.config.element}.webp)`,
      '--pwsm-game-card-image': `url(/static/game/card/image/${data.cardId}.webp)`,
      '--pwsm-game-card-frame': `url(/static/game/card/skin/${frameSkin}.webp)`,
      '--pwsm-game-card-value': cardValueImage,
    }"
  >
    <div class="game-card__image"></div>

    <div class="game-card__frame"></div>

    <div class="game-card__stone"></div>

    <div class="game-card__element"></div>

    <div class="game-card__value">
      <span v-if="data.config.type === 'common'">{{ data.config.power }}</span>
    </div>

    <DynamicFontSize
      class="game-card__title"
      :class="{ 'game-card__title_is-big': !caption }"
      minScale="0.75"
      maxScale="1"
      :minContentLength="12"
      :maxContentLength="20"
      :text="$t(`card.${data.cardId}.title`)"
    />

    <DynamicFontSize
      class="game-card__caption"
      v-if="caption"
      minScale="0.75"
      maxScale="1"
      :minContentLength="40"
      :maxContentLength="100"
      :text="caption"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import DynamicFontSize from '@/app/components/DynamicFontSize.vue';
  import { SoundService, TranslationService } from '@/service';
  import { LazyInject } from '@/ioc';
  import { CardId, type CardState } from '@/game-data/card';
  import type { CardSkinItemKey } from '@/game-data/item-key';
  import { CardIdToCardSkinItemKey, CardSkin, CardSkinItemKeyToCardSkin } from '@/game-data';

  const CARD_VALUE_IMAGE_MAP = {
    [CardId.ArcaneHydrant]: 'hydrant.webp',
    [CardId.FilthHydrant]: 'hydrant.webp',
    [CardId.NatureHydrant]: 'hydrant.webp',
    // [CardId.FilthSoundboard]: 'soundboard.webp',
    // [CardId.ArcaneSoundboard]: 'soundboard.webp',
    // [CardId.NatureSoundboard]: 'soundboard.webp',
    [CardId.ArcaneShaking]: 'shaking.webp',
    [CardId.FilthShaking]: 'shaking.webp',
    [CardId.NatureShaking]: 'shaking.webp',
    [CardId.ArcaneTrashCanDiving]: 'trash_can_diving.webp',
    [CardId.FilthTrashCanDiving]: 'trash_can_diving.webp',
    [CardId.NatureTrashCanDiving]: 'trash_can_diving.webp',
    [CardId.ArcaneTreatHiding]: 'treat_hiding.webp',
    [CardId.FilthTreatHiding]: 'treat_hiding.webp',
    [CardId.NatureTreatHiding]: 'treat_hiding.webp',
    [CardId.Multimatter]: 'multidog.webp',
    [CardId.BallOfFortune]: 'ball_of_fortune.webp',
    [CardId.BallOfFate]: 'ball_of_fortune.webp',
    [CardId.BallOfCurse]: 'ball_of_fortune.webp',
    [CardId.BallOfLuck]: 'ball_of_fortune.webp',
    [CardId.BallOfWisdom]: 'ball_of_fortune.webp',
    [CardId.BallOfWish]: 'ball_of_fortune.webp',
  };

  @Component({
    components: {
      DynamicFontSize,
    },
  })
  export default class GameCard extends Vue {
    @Prop({ required: true })
    public data: CardState;

    @LazyInject(TranslationService)
    private translationService: TranslationService;

    @LazyInject(SoundService)
    private soundService: SoundService;

    @Inject({ default: [] })
    private cardSkins: CardSkinItemKey[];

    public get frameSkin(): string {
      const cardId = this.data.cardId;
      const skinItemKeys = CardIdToCardSkinItemKey[cardId];
      const cardSkinKey = (this.cardSkins || []).find((key) => skinItemKeys.includes(key));
      return CardSkinItemKeyToCardSkin[cardSkinKey] || CardSkin.Standard;
    }

    public get caption(): string {
      const token = `card.${this.data.cardId}.caption`;
      const exists = this.translationService.isExisting(token);
      return exists ? this.translationService.localize(token) : null;
    }

    public get cardValueImage(): string {
      if (this.data.config.type === 'common') {
        return null;
      }

      return `url(/static/game/card/value_icon/${CARD_VALUE_IMAGE_MAP[this.data.cardId]})`;
    }
  }
</script>

<style scoped lang="scss">
  .game-card {
    position: relative;
    height: 100%;
    width: 100%;
    aspect-ratio: 2 / 3;
    user-select: none;
    font-family: 'Piazzolla', sans-serif;
    container-type: size;
    text-shadow: 0 0 0.17cqw rgba(0, 0, 0, 0.9);
    border-radius: UiSpacing(4);

    & > * {
      pointer-events: none;
    }

    &__image {
      position: absolute;
      left: 50%;
      top: 3%;
      width: 88%;
      height: 64%;
      transform: translateX(-50%);
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: var(--pwsm-game-card-image);
      will-change: transform;
    }

    &__frame {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: var(--pwsm-game-card-frame);
      will-change: transform;
    }

    &__stone {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: var(--pwsm-game-card-stone);
      will-change: transform;
    }

    &__element {
      position: absolute;
      left: 16.9444%;
      top: 2.3148%;
      aspect-ratio: 1;
      width: 16.6666%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: var(--pwsm-game-card-element);
      will-change: transform;
    }

    &__value {
      position: absolute;
      left: 5.1388%;
      top: 2.3148%;
      aspect-ratio: 1;
      width: 16.6666%;
      border-radius: inherit;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: var(--pwsm-game-card-value);
      font-size: 11cqw;
      line-height: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: transform;

      & > span {
        margin-bottom: 1cqw;
      }
    }

    &__title {
      position: absolute;
      bottom: 21%;
      left: 10%;
      width: 80%;
      height: 8%;
      font-size: 10cqw;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      &_is-big {
        font-size: 12cqw;
        bottom: 6%;
        left: 10%;
        width: 80%;
        height: 24%;
      }
    }

    &__caption {
      position: absolute;
      bottom: 6%;
      left: 10%;
      width: 80%;
      height: 16%;
      font-size: 6cqw;
      line-height: 1;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
