<template>
  <div class="shop-view-main">
    <div class="shop-view-main__panel"></div>

    <UiCircleButton class="shop-view-main__back-button ui-hide_landscape" icon="arrow-left" @click="$emit('back')" />

    <div class="shop-view-main__image-container">
      <UiResponsiveImage
        src="/static/shop/shop_outline.webp"
        alt=""
        mode="contain"
        class="shop-view-main__image shop-view-main__image_small"
      />
      <FadeTransition>
        <UiResponsiveImage
          v-if="set"
          :key="set.id"
          :src="set?.imageSrc"
          :alt="set?.heading"
          mode="cover"
          class="shop-view-main__image"
        />
      </FadeTransition>
    </div>

    <PaperPanel class="shop-view-main__title">
      <FadeTransition>
        <h3 v-if="set" :key="set?.id">{{ set?.heading }}</h3>
        <span v-else>{{ $t('shop.emptyPlaceholderTitle') }}</span>
      </FadeTransition>
    </PaperPanel>

    <FadeTransition>
      <div class="shop-view__content" v-if="set" :key="set?.id">
        <div class="shop-view-main__description">
          <div class="shop-view-main__description-content" v-html="set?.shortDescription"></div>

          <UiButton type="link" width="fit" @click="learnMoreDialog.show()">{{ $t('shop.learnMore') }}</UiButton>
        </div>

        <hr class="shop-view-main__divider" />

        <div class="shop-view-main__actions">
          <h3 class="shop-view-main__unlock">{{ $t('shop.unlock') }}</h3>
          <UiButton class="shop-view-main__button" @click="onEurPurchaseClick()">{{ priceEur }}</UiButton>
          <div class="shop-view-main__action-divider">&#8766;{{ $t('shop.or') }}&#8766;</div>
          <UiButton class="shop-view-main__button" type="secondary" @click="onEssencePurchaseClick()">
            <Essence class="shop-view-main__button-essence" />
            <span>{{ priceEssence }}</span>
          </UiButton>
        </div>
      </div>
      <div v-else class="shop-view-main__description shop-view-main__description-content">
        <span class="ui-hide_portrait">{{ $t('shop.emptyPlaceholderDescription') }}</span>
        <span class="ui-hide_landscape">{{ $t('shop.emptyPlaceholderDescriptionPortrait') }}</span>
      </div>
    </FadeTransition>

    <UiDialog
      ref="learnMoreDialog"
      :title="$t('shop.learnMore')"
      :isPrimaryButtonShown="false"
      :isSecondaryButtonShown="false"
      :isCloseButtonShown="true"
    >
      <template v-slot:body>
        <div class="shop-view-main__full-description" v-html="set?.description"></div>
      </template>
    </UiDialog>

    <UiDialog
      ref="notImplementedDialog"
      :title="$t('shop.notImplementedDialogTitle')"
      :text="$t('shop.notImplementedDialogText')"
      :isSecondaryButtonShown="false"
    ></UiDialog>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { UiButton, UiCircleButton, UiDialog, UiResponsiveImage } from '@/app/ui-kit';
  import { Essence, PaperPanel } from '@/app/components';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';
  import { LazyInject } from '@/ioc';
  import { TrackerService } from '@/service';
  import { TrackingCategory, TrackingEvent } from '@/service/tracker/tracking-config';
  import type { DisplaySet } from '../display-set';

  const PRICE_EUR = '€2.79';
  const PRICE_ESSENCE = '120,000';

  @Component({
    components: {
      UiButton,
      UiResponsiveImage,
      UiCircleButton,
      UiDialog,
      Essence,
      PaperPanel,
      FadeTransition,
    },
    emits: ['back'],
  })
  export default class ShopViewMain extends Vue {
    public readonly priceEur = PRICE_EUR;
    public readonly priceEssence = PRICE_ESSENCE;

    @Ref()
    public learnMoreDialog: UiDialog;

    @Ref()
    public notImplementedDialog: UiDialog;

    @Prop({ default: null })
    public set: DisplaySet;

    @LazyInject(TrackerService)
    private readonly tracker: TrackerService;

    public onEurPurchaseClick(): void {
      const params = { set: this.set.id, price: this.priceEur };
      this.tracker.event(TrackingCategory.Shop, TrackingEvent.PurchaseForCurrencyClicked, params);
      this.notImplementedDialog.show();
    }

    public onEssencePurchaseClick(): void {
      const params = { set: this.set.id, price: this.priceEssence };
      this.tracker.event(TrackingCategory.Shop, TrackingEvent.PurchaseForEssenceClicked, params);
      this.notImplementedDialog.show();
    }
  }
</script>

<style scoped lang="scss">
  .shop-view-main {
    flex-grow: 1;
    height: calc(100% - UiSpacing(10));
    @include UiMargin(10, top);
    position: relative;
    container-type: size;

    @include UiMediaPortrait() {
      height: 100%;
      @include UiMargin(0, top);
    }

    &__panel {
      position: absolute;
      background-image: url('/static/shop/shop_panel.webp');
      width: 100%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;

      @include UiMediaPortrait() {
        width: 100cqh;
        height: 100cqw;
        top: 0;
        transform-origin: top left;
        background-size: 100% 100%;
        transform: rotateZ(90deg) translateY(-100%);
      }
    }

    &__description-content {
      color: UiColor(shade-900);
      display: flex;
      flex-direction: column;
      justify-content: center;
      @include UiGap(1);
      text-align: center;
    }

    &__full-description {
      color: UiColor(shade-900);
      @include UiPadding(4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      @include UiGap(2);
      @include UiTypographyParagraph1();

      --pwsm--spacing-unit: 4px;
      --pwsm--font-size: 20px;

      :deep(b) {
        color: UiColor(primary-900);
      }

      :deep(ul) {
        @include UiPadding(3, left);
      }

      :deep(li) {
        list-style: disc;
      }
    }

    &__description {
      position: absolute;
      right: UiSpacing(10);
      top: UiSpacing(29);
      width: UiSpacing(33);
      height: UiSpacing(33);
      @include UiTypographyHeading6();
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @include UiGap(1);
      text-align: center;

      @include UiMediaPortrait() {
        right: auto;
        top: auto;
        left: UiSpacing(8);
        bottom: UiSpacing(8);
        width: UiSpacing(38);
        height: UiSpacing(33);
      }
    }

    &__button {
      width: 100%;
    }

    &__actions {
      position: absolute;
      right: UiSpacing(10);
      bottom: UiSpacing(6);
      display: flex;
      flex-direction: column;
      align-items: center;
      @include UiGap(1);
      width: UiSpacing(33);

      @include UiMediaPortrait() {
        right: UiSpacing(30);
        bottom: UiSpacing(12);
        width: UiSpacing(28);
      }
    }

    &__action-divider {
      color: UiColor(shade-900);
    }

    &__button-essence {
      width: UiSpacing(8);
    }

    &__unlock {
      @include UiTypographyHeading5();
      color: UiColor(shade-900);
    }

    &__divider {
      position: absolute;
      right: UiSpacing(10);
      bottom: UiSpacing(32.5);
      width: UiSpacing(33);
      border-top: UiSpacing(0.25) solid rgba(0, 0, 0, 0.5);

      @include UiMediaPortrait() {
        left: UiSpacing(48);
        bottom: UiSpacing(9);
        width: 0;
        height: UiSpacing(30);
        border-top: none;
        border-left: UiSpacing(0.25) solid rgba(0, 0, 0, 0.5);
      }
    }

    &__title {
      position: absolute;
      bottom: UiSpacing(2);
      left: UiSpacing(28);
      height: UiSpacing(13);
      width: UiSpacing(60);
      color: UiColor(shade-900);
      text-align: center;
      @include UiTypographyHeading3();

      @include UiMediaPortrait() {
        bottom: UiSpacing(58);
      }
    }

    &__image {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;

      &_small {
        width: 70%;
        height: 70%;
      }
    }

    &__image-container {
      position: absolute;
      top: UiSpacing(16.6);
      left: UiSpacing(31.3);
      width: UiSpacing(60);
      height: UiSpacing(60);
      border-radius: UiSpacing(100);
      pointer-events: none;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: UiSpacing(100);
        background-image: radial-gradient(rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.9) 72%);
      }

      @include UiMediaPortrait() {
        top: UiSpacing(32);
        left: UiSpacing(25);
        width: UiSpacing(65);
        height: UiSpacing(60);
      }
    }
  }
</style>
