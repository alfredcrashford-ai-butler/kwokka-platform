<template>
  <div class="audio-settings">
    <h3 class="audio-settings__title">{{ $t('settings.audio.title') }}</h3>
    <template v-if="isReady">
      <UiSlider
        :label="$t('settings.audio.master')"
        :modelValue="masterGain"
        :min="min"
        :max="max"
        :step="step"
        @update:modelValue="onGainChange($event)"
      />
      <UiSlider
        v-for="soundGroup in soundGroups"
        :key="soundGroup"
        :label="$t(`settings.audio.${soundGroup}`)"
        :modelValue="groupGain[soundGroup]"
        :min="min"
        :max="max"
        :step="step"
        @update:modelValue="onGainChange($event, soundGroup)"
      />
    </template>
  </div>
</template>

<script lang="ts">
  import UiSlider from '@/app/ui-kit/UiSlider.vue';
  import { LazyInject } from '@/ioc';
  import { SoundGroup, SoundService } from '@/service';
  import { FunctionUtil } from '@kwokka/utils';
  import { Component, Vue } from 'vue-facing-decorator';

  @Component({
    components: {
      UiSlider,
    },
  })
  export default class AudioSettings extends Vue {
    public musicVolume: number = 0;
    public sfxVolume: number = 0;
    public masterGain: number = 0;
    public step: number = 1;
    public min: number = 0;
    public max: number = 100;
    public soundGroups = Object.values(SoundGroup);
    public isReady = false;
    public groupGain = {
      [SoundGroup.Music]: 0,
      [SoundGroup.Sfx]: 0,
      [SoundGroup.Voice]: 0,
    };
    public saveSettings: () => void;

    @LazyInject(SoundService)
    public soundService: SoundService;

    public mounted(): void {
      const settings = this.soundService.settings;
      this.masterGain = this.toUiScale(settings.masterGain);
      this.groupGain = {
        [SoundGroup.Music]: this.toUiScale(settings.groupGain[SoundGroup.Music]),
        [SoundGroup.Sfx]: this.toUiScale(settings.groupGain[SoundGroup.Sfx]),
        [SoundGroup.Voice]: this.toUiScale(settings.groupGain[SoundGroup.Voice]),
      };
      this.saveSettings = FunctionUtil.debounce(() => this.soundService.saveCurrentSettings(), 100);
      this.isReady = true;
    }

    public onGainChange(volume: number, group?: SoundGroup): void {
      if (group) {
        this.soundService.setGroupGain(group, this.toAudioScale(volume));
      } else {
        this.soundService.setMasterGain(this.toAudioScale(volume));
      }
      this.saveSettings();
    }

    private toUiScale(volume: number): number {
      return Number.prototype.toFixed.call(volume * 100, 0);
    }

    private toAudioScale(volume: number): number {
      return Number.prototype.toFixed.call(volume / 100, 2);
    }
  }
</script>

<style scoped lang="scss">
  .audio-settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include UiGap(4);

    &__title {
      @include UiTypographyHeading4();
      @include UiTextShadow(3);
    }
  }
</style>
