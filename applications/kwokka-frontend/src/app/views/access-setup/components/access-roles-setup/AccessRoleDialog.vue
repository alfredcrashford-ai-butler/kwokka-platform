<template>
  <UiDialog
    ref="dialog"
    :title="`${$t('accessSetup.accessRoles.accessRole')}: ${accessRole?.name}`"
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
  >
    <template v-slot:body>
      <p><b>Name:</b> {{ accessRole?.name }}</p>
      <p><b>Description:</b> {{ accessRole?.description }}</p>
      <p><b>Id:</b> {{ accessRole?.id }}</p>
      <p><b>CreatedAt:</b> {{ formattedCreatedAt }}</p>
      <p><b>Access rights ids:</b> {{ accessRole?.accessRightsIds }}</p>
      <hr class="access-role-dialog__delimeter" />
      <div class="access-role-dialog__actions">
        <UiButton type="secondary" width="block" @click="onEditClick">
          <UiIcon name="edit" />
          {{ $t('accessSetup.accessRoles.edit') }}
        </UiButton>
        <UiButton type="secondary" width="block" @click="onDeleteClick">
          <UiIcon name="trash" />
          {{ $t('accessSetup.accessRoles.delete') }}
        </UiButton>
      </div>
    </template>
  </UiDialog>

  <AddEditAccessRoleDialog ref="addEditAccessRoleDialog" @confirm="$emit('edit', $event)" />

  <UiDialog
    ref="confirmDeleteDialog"
    :title="$t('accessSetup.accessRoles.confirmDeleteTitle')"
    :text="$t('accessSetup.accessRoles.confirmDeleteDescription')"
    @primaryButtonClick="onDeleteConfirm"
    @secondaryButtonClick="onDeleteCancel"
  />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccessRoleEntity } from '@kwokka/entities';
  import { DateUtil } from '@kwokka/utils';
  import { AccessRightApi } from '@/api/auth/access-right/access-right.api';
  import { LazyInject } from '@/ioc';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import AddEditAccessRoleDialog from './AddEditAccessRoleDialog.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiIcon,
      AddEditAccessRoleDialog,
    },
    emits: ['delete', 'edit'],
  })
  export default class AccessRolesSetup extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public confirmDeleteDialog: UiDialog;

    @Ref()
    public addEditAccessRoleDialog: AddEditAccessRoleDialog;

    @LazyInject(AccessRightApi)
    public accessRightApi: AccessRightApi;

    public accessRole: AccessRoleEntity = null;

    public get formattedCreatedAt(): string {
      if (!this.accessRole) {
        return '';
      }

      return DateUtil.format(this.accessRole.createdAt);
    }

    public show(accessRole: AccessRoleEntity): void {
      this.accessRole = accessRole;
      this.dialog.show();
    }

    public onDeleteClick() {
      this.dialog.hide();
      this.confirmDeleteDialog.show();
    }

    public onEditClick() {
      this.dialog.hide();
      this.addEditAccessRoleDialog.show(this.accessRole);
    }

    public onDeleteCancel(): void {
      this.dialog.show();
    }

    public async onDeleteConfirm(): Promise<void> {
      this.$emit('delete', this.accessRole);
      this.confirmDeleteDialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .access-role-dialog {
    display: flex;
    flex-direction: column;

    &__delimeter {
      @include UiMargin(4, top);
      @include UiMargin(4, bottom);
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    }

    &__actions {
      display: flex;
      flex-direction: column;
      @include UiGap(1, false);
    }
  }
</style>
