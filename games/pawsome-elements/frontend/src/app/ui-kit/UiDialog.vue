<template>
  <Teleport to="[data-app-dialog-container]">
    <div
      ref="backdrop"
      class="ui-overlay ui-dialog-wrapper"
      :class="{ 'ui-dialog-wrapper_is-active': isActive }"
      @click="onBackdropClick($event)"
    >
      <CaptionPanel class="ui-dialog" :class="[{ 'ui-dialog_is-full-height': isFullHeight }]" role="dialog" size="lg">
        <div v-if="isHeaderShown" class="ui-dialog__header">
          <slot name="header">
            <ActionPanel class="ui-dialog__header-inline">
              <h3 class="ui-dialog__heading">{{ title }}</h3>
            </ActionPanel>
          </slot>
        </div>

        <div
          v-if="isBodyShown"
          class="ui-dialog__body"
          :class="{
            'ui-dialog__body_is-no-header': !isHeaderShown,
            'ui-dialog__body_is-no-footer': !isFooterShown,
          }"
        >
          <slot name="body">
            <div class="ui-dialog__body-inline" v-html="text"></div>
          </slot>
        </div>

        <UiCircleButton
          v-if="isCloseButtonShown"
          class="ui-dialog__close-button ui-hide_max-width-sm"
          size="lg"
          icon="x"
          @click="onCloseButtonClick()"
        />

        <UiCircleButton
          v-if="isCloseButtonShown"
          class="ui-dialog__close-button ui-hide_min-width-sm"
          size="md"
          icon="x"
          @click="onCloseButtonClick()"
        />

        <div v-if="isFooterShown" class="ui-dialog__footer">
          <slot name="footer">
            <div class="ui-dialog__footer-inline">
              <UiButton
                class="ui-dialog__button"
                type="secondary"
                size="xl"
                v-if="isSecondaryButtonShown"
                :disabled="isSecondaryButtonDisabled"
                @click="onSecondaryButtonClick()"
              >
                {{ secondaryButtonText || $t('general.uiKit.dialog.defaultSecondaryButtonText') }}
              </UiButton>

              <UiButton
                class="ui-dialog__button"
                type="primary"
                size="xl"
                v-if="isPrimaryButtonShown"
                :disabled="isPrimaryButtonDisabled"
                @click="onPrimaryButtonClick()"
              >
                {{ primaryButtonText || $t('general.uiKit.dialog.defaultPrimaryButtonText') }}
              </UiButton>
            </div>
          </slot>
        </div>
      </CaptionPanel>
    </div>
  </Teleport>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import ActionPanel from '../components/ActionPanel.vue';
  import CaptionPanel from '../components/CaptionPanel.vue';
  import UiCircleButton from './UiCircleButton.vue';

  enum Events {
    Show = 'show',
    Hide = 'hide',
    PrimaryButtonClick = 'primaryButtonClick',
    SecondaryButtonClick = 'secondaryButtonClick',
    CloseButtonClick = 'closeButtonClick',
  }

  @Component({
    components: {
      UiButton,
      ActionPanel,
      CaptionPanel,
      UiCircleButton,
    },
    emits: Object.values(Events),
  })
  export default class UiDialog extends Vue {
    @Prop()
    public text?: string;

    @Prop()
    public title?: string;

    @Prop()
    public isFullHeight?: boolean;

    @Prop({ default: true })
    public isSecondaryButtonShown?: boolean;

    @Prop({ default: true })
    public isPrimaryButtonShown?: boolean;

    @Prop({ default: false })
    public isCloseButtonShown?: boolean;

    @Prop({ default: true })
    public shouldCloseOnSecondaryButtonClick?: boolean;

    @Prop({ default: true })
    public shouldCloseOnPrimaryButtonClick?: boolean;

    @Prop({ default: true })
    public shouldCloseOnCloseButtonClick?: boolean;

    @Prop()
    public secondaryButtonText?: string;

    @Prop()
    public primaryButtonText?: string;

    @Prop({ default: false })
    public isSecondaryButtonDisabled?: boolean;

    @Prop({ default: false })
    public isPrimaryButtonDisabled?: boolean;

    @Prop({ default: true })
    public isBackdropClickEnabled?: boolean;

    @Ref('backdrop') public backdropElement: HTMLDivElement;

    public isActive: boolean = false;

    public show() {
      this.isActive = true;
      this.$emit(Events.Show);
    }

    public hide() {
      this.isActive = false;
      this.$emit(Events.Hide);
    }

    public get isHeaderShown(): boolean {
      return Boolean(this.$slots.header || this.title);
    }

    public get isBodyShown(): boolean {
      return Boolean(this.$slots.body || this.text);
    }

    public get isFooterShown(): boolean {
      const isAnyButtonEnabled = this.isSecondaryButtonShown || this.isPrimaryButtonShown;
      return Boolean(this.$slots.footer || isAnyButtonEnabled);
    }

    public onBackdropClick(event: MouseEvent) {
      if (!this.isBackdropClickEnabled) {
        return;
      }

      if (event.target !== this.backdropElement) {
        return;
      }

      this.hide();
    }

    public onSecondaryButtonClick(): void {
      this.$emit(Events.SecondaryButtonClick);
      if (this.shouldCloseOnSecondaryButtonClick) {
        this.hide();
      }
    }

    public onCloseButtonClick(): void {
      this.$emit(Events.CloseButtonClick);
      if (this.shouldCloseOnCloseButtonClick) {
        this.hide();
      }
    }

    public onPrimaryButtonClick(): void {
      this.$emit(Events.PrimaryButtonClick);
      if (this.shouldCloseOnPrimaryButtonClick) {
        this.hide();
      }
    }
  }
</script>

<style scoped lang="scss">
  .ui-dialog-wrapper {
    --pwsm--spacing-unit: 4px;
    --pwsm--font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    overflow: auto;

    opacity: 0;
    visibility: hidden;
    will-change: opacity, visibility;

    transition:
      opacity linear 100ms,
      visibility linear 100ms;

    &_is-active {
      opacity: 1;
      visibility: visible;

      .ui-dialog {
        transform: translateY(0);
        @include UiInlineAnimation() {
          from {
            transform: translateY(UiSpacing(40));
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      }

      .ui-dialog__header,
      .ui-dialog__body,
      .ui-dialog__footer {
        animation-name: UiAnimationScaleIn, UiAnimationFadeIn;
        animation-timing-function: UiTransition(spring), linear;
        animation-duration: 500ms, 100ms;
        animation-fill-mode: both;
        will-change: opacity, transform;
      }

      .ui-dialog__header {
        animation-delay: 100ms;
      }

      .ui-dialog__body {
        animation-delay: 200ms;
      }

      .ui-dialog__footer {
        animation-delay: 300ms;
      }
    }
  }

  .ui-dialog {
    display: flex;
    flex-direction: column;

    max-height: 85vh;
    width: UiSpacing(160);
    max-width: 98vw;
    transform-origin: bottom;

    animation-fill-mode: both;
    animation-duration: 600ms;
    animation-delay: 50ms;
    animation-timing-function: UiTransition(spring);
    container-type: inline-size;
    transform: translateY(0);
    will-change: transform, opacity;

    @include UiBorderRadius(1);
    @include UiBoxShadow(3);
    background-color: UiColor(shade-700);

    &_is-full-height {
      height: 100%;
    }

    &__header {
      position: relative;
      @include UiPadding(6);
      @include UiPadding(3, bottom);
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    &__header-inline {
      position: absolute;
      min-width: min(UiSpacing(120), 70vw);
      left: 50%;
      bottom: 0;
      transform: translateX(-50%) translateY(calc(-1 * UiSpacing(3)));
      height: UiSpacing(14);
    }

    &__heading {
      @include UiTypographyHeading3();
      @include UiTextShadow(3);
      text-align: center;
    }

    &__body {
      @include UiPadding(4, left);
      @include UiPadding(4, right);
      @include UiPadding(2, top);
      @include UiPadding(2, bottom);
      flex-grow: 1;
      overflow: auto;
      width: 100%;

      &_is-no-header {
        @include UiPadding(4, top);
      }

      &_is-no-footer {
        @include UiPadding(4, bottom);
      }
    }

    &__body-inline {
      @include UiTextShadow(3);
      text-align: center;
      @include UiTypographyParagraph1();
    }

    &__footer {
      @include UiPadding(4);
      @include UiPadding(2, top);
      @include UiGap(2);

      display: flex;
      justify-content: center;
      flex-shrink: 0;
      width: 100%;
    }

    &__footer-inline {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
      @include UiGap(4);
      width: 100%;
      > * {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 0;
      }
    }

    &__close-button {
      position: absolute;
      right: 0;
      top: 0;
      transform: translate(UiSpacing(4), calc(-1 * UiSpacing(4)));

      @include UiMediaMaxWidth(sm) {
        transform: translate(0, calc(-1 * UiSpacing(4)));
      }
    }
  }
</style>
