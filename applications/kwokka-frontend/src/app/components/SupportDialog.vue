<template>
  <UiDialog
    :isPrimaryButtonShown="false"
    :secondaryButtonText="$t('support.closeButton')"
    :title="$t('support.title')"
    ref="dialog"
  >
    <template v-slot:body>
      <div class="support-dialog">
        <UiHeading class="support-dialog__question" size="6">{{$t('support.connectionQuestion')}}</UiHeading>
        <p class="support-dialog__answer">{{$t('support.connectionAnswer')}}</p>
        <UiHeading class="support-dialog__question" size="6">{{$t('support.bugQuestion')}}</UiHeading>
        <p class="support-dialog__answer">{{$t('support.bugAnswer')}}</p>

        <p class="support-dialog__support-link">
          <span>{{$t('support.caption')}}</span>
          <a href="mailto:support@kwokka.co">support@kwokka.co</a>
        </p>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import UiDialog from '../ui-kit/UiDialog.vue';
  import UiHeading from '../ui-kit/UiHeading.vue';

  @Component({
    components: {
      UiDialog,
      UiHeading,
    },
  })
  export default class SupportDialog extends Vue {

    @Ref()
    public dialog: UiDialog;

    public show() {
      this.dialog.show();
    }

  }
</script>

<style scoped lang="scss">
  .support-dialog {

    &__question {
      @include UiMargin(1, bottom);
    }

    &__answer {
      @include UiMargin(6, bottom);
      @include UiTypographyParagraph2();
    }

    &__support-link {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      @include UiMargin(8, top);
    }

  }
</style>
