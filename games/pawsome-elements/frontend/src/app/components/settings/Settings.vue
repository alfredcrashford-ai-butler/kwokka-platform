<template>
  <div class="settings">
    <UiCircleButton icon="gear-six" size="lg" @click="dialog.show()" />
    <UiDialog
      ref="dialog"
      :title="$t('settings.title')"
      :isPrimaryButtonShown="false"
      :isSecondaryButtonShown="false"
      :isBackdropClickEnabled="false"
      :isCloseButtonShown="true"
      @show="$emit('open')"
      @hide="$emit('close')"
    >
      <template v-slot:body>
        <div class="settings__sections">
          <slot></slot>
        </div>
      </template>
    </UiDialog>
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { UiCircleButton, UiDialog } from '../../ui-kit';

  @Component({
    components: {
      UiDialog,
      UiCircleButton,
    },
    emits: ['open', 'close'],
  })
  export default class Settings extends Vue {
    @Ref()
    public dialog: UiDialog;

    public show(): void {
      this.dialog.show();
    }

    public hide(): void {
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .settings {
    text-align: center;

    &__sections {
      display: flex;
      flex-direction: column;
      @include UiGap(12);
    }
  }
</style>
