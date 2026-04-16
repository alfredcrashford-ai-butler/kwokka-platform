<template>
  <UiButton :shade="shade" :shape="shape" :type="type" :width="width" @click="onClick">
    <UiIcon name="exit" />
    {{ $t('general.components.signOutButton.text') }}
  </UiButton>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiButton, {
    type UiButtonShade,
    type UiButtonShape,
    type UiButtonType,
    type UiButtonWidth,
  } from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import { TranslationService } from '@/service/translation/translation.service';
  import { PersistenceService } from '@/service/persistence/persistence.service';
  import { ConfigService } from '@/service/config/config.service';
  import { LazyInject } from '@/ioc';
  import { PersistenceKey } from '@/service/persistence/persistence-key';

  @Component({
    components: {
      UiButton,
      UiIcon,
    },
  })
  export default class SignOutButton extends Vue {
    @Prop()
    public shade: UiButtonShade;

    @Prop()
    public type: UiButtonType;

    @Prop()
    public shape: UiButtonShape;

    @Prop()
    public width: UiButtonWidth;

    @LazyInject(TranslationService)
    private translationService: TranslationService<any>;

    @LazyInject(PersistenceService)
    private persistenceService: PersistenceService;

    @LazyInject(ConfigService)
    private configService: ConfigService;

    public onClick() {
      const isConfirmed = confirm(this.translationService.localize('general.components.signOutButton.confirmation'));
      if (isConfirmed) {
        const keys = [PersistenceKey.AccessToken, PersistenceKey.RefreshToken];
        keys.forEach((key) => this.persistenceService.clearValue(key));
        window.open(this.configService.frontendConfig.rootUrl, '_self');
      }
    }
  }
</script>
