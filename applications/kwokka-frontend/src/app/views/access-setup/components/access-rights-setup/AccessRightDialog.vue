<template>
  <UiDialog
    ref="dialog"
    :title="`${$t('accessSetup.accessRights.accessRight')}: ${accessRight?.name}`"
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
  >
    <template v-slot:body>
      <p><b>Name:</b> {{ accessRight?.name }}</p>
      <p><b>Id:</b> {{ accessRight?.id }}</p>
      <p><b>CreatedAt:</b> {{ formattedCreatedAt }}</p>
      <hr class="access-right-dialog__delimeter" />
      <div class="access-right-dialog__actions">
        <UiButton type="secondary" width="block" @click="onEditClick">
          <UiIcon name="edit" />
          {{ $t('accessSetup.accessRights.edit') }}
        </UiButton>
        <UiButton type="secondary" width="block" @click="onDeleteClick">
          <UiIcon name="trash" />
          {{ $t('accessSetup.accessRights.delete') }}
        </UiButton>
      </div>
    </template>
  </UiDialog>

  <AddEditAccessRightDialog ref="addEditAccessRightDialog" @confirm="$emit('edit', $event)" />

  <UiDialog
    ref="confirmDeleteDialog"
    :title="$t('accessSetup.accessRights.confirmDeleteTitle')"
    :text="$t('accessSetup.accessRights.confirmDeleteDescription')"
    @primaryButtonClick="onDeleteConfirm"
    @secondaryButtonClick="onDeleteCancel"
  />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRightEntity } from '@kwokka/entities';
  import { DateUtil } from '@kwokka/utils';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import AddEditAccessRightDialog from './AddEditAccessRightDialog.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiIcon,
      AddEditAccessRightDialog,
    },
    emits: ['delete', 'edit'],
  })
  export default class AccessRightDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public confirmDeleteDialog: UiDialog;

    @Ref()
    public addEditAccessRightDialog: AddEditAccessRightDialog;

    public accessRight: AccessRightEntity = null;

    public get formattedCreatedAt(): string {
      if (!this.accessRight) {
        return '';
      }

      return DateUtil.format(this.accessRight.createdAt);
    }

    public show(accessRight: AccessRightEntity) {
      this.accessRight = accessRight;
      this.dialog.show();
    }

    public onDeleteClick() {
      this.dialog.hide();
      this.confirmDeleteDialog.show();
    }

    public onEditClick() {
      this.dialog.hide();
      this.addEditAccessRightDialog.show(this.accessRight);
    }

    public onDeleteCancel(): void {
      this.dialog.show();
    }

    public async onDeleteConfirm(): Promise<void> {
      this.$emit('delete', this.accessRight);
      this.confirmDeleteDialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .access-right-dialog {
    &__delimeter {
      @include UiMargin(4, top);
      @include UiMargin(4, bottom);
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    }

    &__actions {
      @include UiGap(1, false);
      display: flex;
      flex-direction: column;
    }
  }
</style>
