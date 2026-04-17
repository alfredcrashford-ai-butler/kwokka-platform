<template>
  <div class="ranked-match-info-section" data-ranked-info-section>
    <div class="ranked-match-info-section__card">
      <UiResponsiveImage
        class="ranked-match-info-section__card-set-image"
        :src="`/static/card_set/${cardSet}.webp`"
        :alt="$t(`cardSet.${cardSet}.title`)"
        mode="cover"
      />
      <h3 class="ranked-match-info-section__card-set-title">
        {{ $t('cardSet.title') }}: {{ $t(`cardSet.${cardSet}.title`) }}
      </h3>
      <UiButton type="link" @click="onCardSetClick()">{{ $t('rankedMatch.seeAllCards') }}</UiButton>
    </div>

    <div class="ranked-match-info-section__card">
      <p class="ranked-match-info-section__rules" v-html="$t('rankedMatch.rules.shortDescription')"></p>
      <UiButton type="link" @click="onRulesMoreClick()">{{ $t('rankedMatch.rules.learnMore') }}</UiButton>
    </div>

    <UiDialog ref="rulesDialog" :isCloseButtonShown="true" :isSecondaryButtonShown="false">
      <template v-slot:body>
        <div class="ranked-match-info-section__rules-dialog" v-html="$t('rankedMatch.rules.description')"></div>
      </template>
    </UiDialog>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { UiButton, UiDialog, UiResponsiveImage } from '@/app/ui-kit';
  import { RouteName } from '@/app/route-name';
  import { PawsomeElementsCardSet } from '@/game-data/game-instance';

  @Component({
    components: {
      UiResponsiveImage,
      UiButton,
      UiDialog,
    },
  })
  export default class RankedMatchInfoSection extends Vue {
    public readonly cardSet: PawsomeElementsCardSet = PawsomeElementsCardSet.Standard;

    @Ref()
    public rulesDialog: UiDialog;

    public onCardSetClick(): void {
      this.$router.replace({
        name: RouteName.CardSet,
        query: { cardSet: this.cardSet, backTo: RouteName.RankedMatch },
      });
    }

    public onRulesMoreClick(): void {
      this.rulesDialog.show();
    }
  }
</script>

<style scoped lang="scss">
  .ranked-match-info-section {
    display: flex;
    justify-content: center;
    height: fit-content;
    @include UiGap(4);
    @include UiPadding(4);
    @include UiMediaPortrait() {
      flex-direction: column;
    }

    &__card {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      @include UiPadding(4);
      border: UiSpacing(0.5) solid UiColor(shade-500);
      background-color: rgba(0, 0, 0, 0.5);
      @include UiBorderRadius(4);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      flex-direction: column;
      @include UiGap(2);
      @include UiTextShadow(2);
      @include UiBoxShadow(1);
    }

    &__card-set-image {
      @include UiBorderRadius(2);
    }

    &__card-set-title {
      @include UiTypographyHeading4();
    }

    &__rules-dialog {
      --pwsm--spacing-unit: 5px;
      --pwsm--font-size: calc(var(--pwsm--spacing-unit) * 4);
      @include UiTypographyParagraph1();
      color: UiColor(shade-900);

      :deep(ol) {
        list-style: decimal;
        padding-left: UiSpacing(4);
      }

      :deep(ol > li) {
        margin-bottom: UiSpacing(4);
      }

      :deep(ul) {
        list-style: disc;
        padding-left: UiSpacing(4);
      }
    }
  }
</style>
