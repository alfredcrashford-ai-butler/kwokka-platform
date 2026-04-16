<template>
  <div
    ref="backdrop"
    class="ui-overlay ui-dialog-wrapper"
    :class="{
      'ui-dialog-wrapper_is-active': isActive,
      'ui-dialog-wrapper_is-mobile-bottom-sheet': isBottomSheetOnMobile,
    }"
    @click="onBackdropClick($event)"
  >
    <UiCard
      class="ui-dialog"
      :class="[
        {
          'ui-dialog_is-full-height': isFullHeight,
          'ui-dialog_is-mobile-bottom-sheet': isBottomSheetOnMobile,
        },
        sizeClass,
      ]"
      role="dialog"
    >
      <div v-if="isHeaderShown" class="ui-dialog__header">
        <slot name="header">
          <h3 class="ui-dialog__heading">{{ title }}</h3>
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

      <div v-if="isFooterShown" class="ui-dialog__footer">
        <slot name="footer">
          <UiButton
            class="ui-dialog__button"
            type="secondary"
            v-if="isSecondaryButtonShown"
            :disabled="isSecondaryButtonDisabled"
            @click="onSecondaryButtonClick"
          >
            {{ secondaryButtonText || $t('general.uiKit.dialog.defaultSecondaryButtonText') }}
          </UiButton>

          <UiButton
            class="ui-dialog__button"
            type="primary"
            v-if="isPrimaryButtonShown"
            :disabled="isPrimaryButtonDisabled"
            @click="onPrimaryButtonClick"
          >
            {{ primaryButtonText || $t('general.uiKit.dialog.defaultPrimaryButtonText') }}
          </UiButton>
        </slot>
      </div>
    </UiCard>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiCard from '@/app/ui-kit/UiCard.vue';

  export type UiDialogSize = 'sm' | 'md' | 'lg';
  enum Events {
    Show = 'show',
    Hide = 'hide',
    PrimaryButtonClick = 'primaryButtonClick',
    SecondaryButtonClick = 'secondaryButtonClick',
  }

  @Component({
    components: {
      UiButton,
      UiCard,
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

    @Prop({ default: true })
    public shouldCloseOnSecondaryButtonClick?: boolean;

    @Prop({ default: true })
    public shouldCloseOnPrimaryButtonClick?: boolean;

    @Prop()
    public secondaryButtonText?: string;

    @Prop()
    public primaryButtonText?: string;

    @Prop({ default: 'md' })
    public size?: UiDialogSize;

    @Prop({ default: false })
    public isSecondaryButtonDisabled?: boolean;

    @Prop({ default: false })
    public isPrimaryButtonDisabled?: boolean;

    @Prop({ default: true })
    public isBackdropClickEnabled?: boolean;

    @Prop({ default: true })
    public isBottomSheetOnMobile?: boolean;

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

    public get sizeClass(): string {
      return `ui-dialog_size-${this.size}`;
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    overflow: auto;

    opacity: 0;
    visibility: hidden;

    transition:
      opacity linear 100ms,
      visibility linear 100ms;

    &_is-mobile-bottom-sheet {
      @include UiMediaMobile() {
        justify-content: flex-end;
      }
    }

    &_is-active {
      opacity: 1;
      visibility: visible;

      .ui-dialog {
        transform: translateY(0);
        animation-name: UiDialogSlideOut;
      }
    }
  }

  .ui-dialog {
    @include UiBorderRadius(lg);

    display: flex;
    flex-direction: column;

    max-height: 85vh;
    max-width: 98vw;
    transform-origin: bottom;

    animation-fill-mode: both;
    animation-duration: 400ms;
    animation-delay: 50ms;
    animation-timing-function: ease;

    @include UiShadow(1);
    @include UiTheme() {
      background-color: UiColor(shade-700);
    }

    &_size-sm {
      width: $grid-step * 100; // 400px
    }

    &_size-md {
      width: $grid-step * 125; // 500px
    }

    &_size-lg {
      width: $grid-step * 175; // 700px
    }

    &_is-full-height {
      height: 100%;
    }

    &_is-mobile-bottom-sheet {
      @include UiMediaMobile() {
        max-width: 100vw;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: none;
        &::before {
          display: none;
        }
      }
    }

    &__header {
      @include UiPadding(6);
      @include UiPadding(3, bottom);
      display: flex;
      align-items: center;
      flex-shrink: 0;
      // border-bottom: 1px solid UiColor(shade-500);
    }

    &__heading {
      @include UiTypographyHeading4();
    }

    &__body {
      @include UiPadding(6, left);
      @include UiPadding(6, right);
      @include UiPadding(3, top);
      @include UiPadding(3, bottom);
      flex-grow: 1;
      overflow: auto;

      &_is-no-header {
        @include UiPadding(6, top);
      }

      &_is-no-footer {
        @include UiPadding(6, bottom);
      }
    }

    &__footer {
      @include UiPadding(6);
      @include UiPadding(3, top);
      @include UiGap(4);

      display: flex;
      justify-content: center;
      flex-shrink: 0;
      @include UiMediaMobile() {
        flex-direction: column;
      }
    }

    &__button {
      @include UiMediaMobile() {
        width: 100%;
      }
    }
  }

  @keyframes UiDialogSlideOut {
    0% {
      opacity: 0;
      transform: translateY($grid-step * 40) scale(1, 1);
    }

    50% {
      opacity: 1;
      transform: translateY(0) scale(1, 1.025);
    }

    100% {
      transform: translateY(0) scale(1, 1);
    }
  }
</style>
