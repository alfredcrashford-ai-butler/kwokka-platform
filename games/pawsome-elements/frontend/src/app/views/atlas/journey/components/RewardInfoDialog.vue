<template>
  <UiDialog
    ref="dialog"
    :title="item?.key && $t('atlas.journey.info')"
    :secondaryButtonText="$t('atlas.journey.infoClose')"
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
    :isCloseButtonShown="true"
  >
    <template v-slot:body>
      <div class="reward-info-dialog" v-if="item">
        <UiResponsiveImage
          class="reward-info-dialog__img"
          :src="`${itemsSrc}/${item?.key}.webp`"
          :alt="item?.key && $t(`item.${item?.key}.title`)"
        />
        <h4 class="reward-info-dialog__title">{{ $t(`item.${item?.key}.title`) }}</h4>
        <p class="reward-info-dialog__description">
          <span>{{ $t(`item.${item?.key}.description`) }}</span>
          <!-- TODO: return this qoute once all the translations are done -->
          <!-- <quote class="reward-info-dialog__quote" v-if="$te(`item.${item?.key}.quote`)">
            {{ $t(`item.${item?.key}.quote`) }}
          </quote> -->
        </p>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { UiResponsiveImage, UiDialog } from '@/app/ui-kit';
  import type { ItemEntity } from '@kwokka/entities';
  import { ConfigService } from '@/service';
  import { LazyInject } from '@/ioc';

  @Component({
    components: {
      UiDialog,
      UiResponsiveImage,
    },
    emits: ['confirm'],
  })
  export default class RewardInfoDialog extends Vue {
    @Prop({ default: null })
    public item: ItemEntity;

    @Ref()
    public dialog: UiDialog;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    public get itemsSrc(): string {
      return this.configService.frontendConfig.kwokkaItemsSrc;
    }

    public show(): void {
      this.dialog.show();
    }
  }
</script>

<style scoped lang="scss">
  .reward-info-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    @include UiGap(2);

    &__img {
      width: 50%;
      aspect-ratio: 16 / 9;
      pointer-events: none;
    }

    &__title {
      @include UiTextShadow(3);
    }

    &__description {
      background-color: UiColor(shade-900, 0.5);
      @include UiPadding(4);
      @include UiBorderRadius(2);
      display: flex;
      align-items: center;
      flex-direction: column;
      @include UiTypographyParagraph1();
    }

    &__quote {
      font-style: italic;
      @include UiTypographyParagraph1();
    }
  }
</style>
