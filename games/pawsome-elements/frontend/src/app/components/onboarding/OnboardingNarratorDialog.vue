<template>
  <div class="onboarding-narrator-dialog" :inert="!action">
    <Transition>
      <div
        class="onboarding-narrator-dialog__narrator"
        :class="[`onboarding-narrator-dialog__narrator_size-${action?.size || 'lg'}`]"
        v-if="action"
        ref="narrator"
      ></div>
    </Transition>
    <FadeTransition :duration="2000">
      <div
        class="onboarding-narrator-dialog__dialog"
        :class="[`onboarding-narrator-dialog__dialog_size-${action?.size || 'lg'}`]"
        v-if="action"
      >
        <div class="onboarding-narrator-dialog__dialog-text">
          <h3 class="onboarding-narrator-dialog__dialog-text-title">{{ $t(action.titleTranslationToken) }}</h3>
          <p class="onboarding-narrator-dialog__dialog-text-paragraph">
            <Typewriter :content="$t(action.bodyTranslationToken)" />
          </p>
        </div>
        <div class="onboarding-narrator-dialog__dialog-options">
          <button
            class="onboarding-narrator-dialog__dialog-option"
            v-for="option in action.options"
            :key="option.key"
            v-html="$t(option.translationToken)"
            v-ui-sound
            @click="$emit('optionClick', option)"
          ></button>
        </div>
      </div>
    </FadeTransition>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { VoiceService, type NarratorDialogOnboardingAction } from '@/service';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';
  import Typewriter from '../Typewriter.vue';

  @Component({
    components: {
      FadeTransition,
      Typewriter,
    },
    emits: ['optionClick'],
  })
  export default class OnboardingNarratorDialog extends Vue {
    public action: NarratorDialogOnboardingAction = null;

    @Ref()
    public narrator: HTMLDivElement;

    @LazyInject(VoiceService)
    private voiceService: VoiceService;

    public say(action: NarratorDialogOnboardingAction): void {
      this.action = action;
      this.voiceService.stopCurrentVoice();
      this.voiceService.playNarratorVoice(this.$t(this.action.bodyTranslationToken));
    }

    private stopVoice(): void {
      this.voiceService.stopCurrentVoice();
    }

    @Watch('action')
    public onActionChange(action: NarratorDialogOnboardingAction): void {
      if (!action) {
        return;
      }

      this.narrator?.animate(
        [
          { transform: 'scale(1)', filter: 'brightness(1)' },
          { transform: 'scale(1.1)', filter: 'brightness(1.4)' },
          { transform: 'scale(1)', filter: 'brightness(1)' },
        ],
        {
          duration: 400,
          easing: 'ease',
        },
      );
    }

    public hide(): void {
      this.action = null;
      this.stopVoice();
    }
  }
</script>

<style scoped lang="scss">
  .onboarding-narrator-dialog {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;

    &__narrator {
      position: absolute;
      left: 0;
      bottom: 0;
      background-image: url('/static/onboarding/narrator.webp');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left bottom;

      &_size-lg {
        height: 100%;
        width: 100%;
      }

      &_size-md {
        height: 70%;
        width: 70%;

        @include UiMediaPortrait() {
          height: 80%;
          width: 80%;
        }
      }

      &_size-sm {
        height: 50%;
        width: 50%;

        @include UiMediaPortrait() {
          height: 60%;
          width: 60%;
        }
      }

      &.v-enter-active,
      &.v-leave-active {
        transition:
          transform ease 2000ms,
          opacity ease 500ms;
      }

      &.v-enter-from {
        transform: translateX(-100%);
        opacity: 0;
      }

      &.v-enter-to {
        transform: translateX(0);
        opacity: 1;
      }

      &.v-leave-from {
        opacity: 1;
      }

      &.v-leave-to {
        opacity: 0;
      }
    }

    &__dialog {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      @include UiPadding(10, left);
      @include UiPadding(10, right);
      @include UiPadding(4, bottom);
      @include UiPadding(4, top);
      box-shadow: 0 0 UiSpacing(4) UiSpacing(4) rgba(0, 0, 0, 0.8);
      background-color: rgba(0, 0, 0, 0.8);
      @include UiGap(2);
    }

    &__dialog-text-title {
      @include UiTypographyHeading1();
    }

    &__dialog-text-paragraph {
      @include UiTypographyHeading4();
    }

    &__dialog-text {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 70%;
      display: flex;
      flex-direction: column;
      @include UiGap(1);

      :deep(b) {
        color: UiColor(primary-500);
      }

      :deep(i) {
        color: UiColor(blue-500);
        font-style: italic;
      }
    }

    &__dialog-options {
      flex-shrink: 0;
      flex-basis: 25%;
      display: flex;
      align-items: center;
      flex-direction: column;
      @include UiGap(4);
    }

    &__dialog-option {
      @include UiButtonAppearance();
      box-shadow: 0 0 UiSpacing(1) UiSpacing(1) rgba(255, 255, 255, 0.25);
      background-color: rgba(255, 255, 255, 0.25);
      width: fit-content;
      @include UiTypographyHeading3();
      @include UiPadding(2, top);
      @include UiPadding(2, bottom);
      @include UiPadding(10, left);
      @include UiPadding(10, right);
      @include UiBorderRadius(2);
      width: 100%;
    }
  }
</style>
