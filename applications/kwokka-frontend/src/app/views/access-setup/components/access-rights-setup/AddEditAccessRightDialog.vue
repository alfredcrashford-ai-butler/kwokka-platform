<template>
  <UiDialog
    ref="dialog"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!accessRight?.name"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <UiInput
        v-if="accessRight"
        v-model="accessRight.name"
        width="block"
        mode="compact"
        :label="$t('accessSetup.accessRights.addEditAccessRightNameLabel')"
        :placeholder="$t('accessSetup.accessRights.addEditAccessRightNamePlaceholder')"
      />
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRightEntity } from '@kwokka/entities';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiInput,
    },
    emits: ['confirm'],
  })
  export default class AddEditAccessRightDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    public accessRight: AccessRightEntity = null;

    public get dialogTitle(): string {
      if (this.accessRight?.id) {
        return this.$t('accessSetup.accessRights.editAccessRight');
      }

      return this.$t('accessSetup.accessRights.addAccessRight');
    }

    public show(accessRight?: AccessRightEntity): void {
      this.accessRight = new AccessRightEntity(accessRight || { name: '' });
      this.dialog.show();
    }

    public onConfirm(): void {
      this.$emit('confirm', this.accessRight);
      this.dialog.hide();
    }
  }
</script>
