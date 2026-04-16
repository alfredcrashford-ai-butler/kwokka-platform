<template>
  <UiDialog
    ref="dialog"
    :title="`${$t('accessSetup.accountTypeRoles.accountTypeRoles')}: ${accountTypeRoles?.type}`"
    :isPrimaryButtonShown="false"
    :isSecondaryButtonShown="false"
  >
    <template v-slot:body>
      <p><b>Type:</b> {{ accountTypeRoles?.type }}</p>
      <p><b>CreatedAt:</b> {{ formattedCreatedAt }}</p>
      <p><b>Access roles ids:</b> {{ accountTypeRoles?.accessRolesIds }}</p>
      <hr class="account-type-roles-dialog__delimeter" />
      <div class="account-type-roles-dialog__actions">
        <UiButton type="secondary" width="block" @click="onEditClick">
          <UiIcon name="edit" />
          {{ $t('accessSetup.accountTypeRoles.edit') }}
        </UiButton>
        <UiButton type="secondary" width="block" @click="onDeleteClick">
          <UiIcon name="trash" />
          {{ $t('accessSetup.accountTypeRoles.delete') }}
        </UiButton>
      </div>
    </template>
  </UiDialog>

  <AddEditAccountTypeRolesDialog ref="addEditAccountTypeRolesDialog" @confirm="$emit('edit', $event)" />

  <UiDialog
    ref="confirmDeleteDialog"
    :title="$t('accessSetup.accountTypeRoles.confirmDeleteTitle')"
    :text="$t('accessSetup.accountTypeRoles.confirmDeleteDescription')"
    @primaryButtonClick="onDeleteConfirm"
    @secondaryButtonClick="onDeleteCancel"
  />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { AccountTypeRolesEntity } from '@kwokka/entities';
  import { DateUtil } from '@kwokka/utils';
  import { AccessRightApi } from '@/api/auth/access-right/access-right.api';
  import { LazyInject } from '@/ioc';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import AddEditAccountTypeRolesDialog from './AddEditAccountTypeRolesDialog.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiIcon,
      AddEditAccountTypeRolesDialog,
    },
    emits: ['delete', 'edit'],
  })
  export default class AccountTypeRolesDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public addEditAccountTypeRolesDialog: AddEditAccountTypeRolesDialog;

    @Ref()
    public confirmDeleteDialog: UiDialog;

    @LazyInject(AccessRightApi)
    public accessRightApi: AccessRightApi;

    public accountTypeRoles: AccountTypeRolesEntity = null;

    public get formattedCreatedAt(): string {
      if (!this.accountTypeRoles) {
        return '';
      }

      return DateUtil.format(this.accountTypeRoles.createdAt);
    }

    public show(accountTypeRoles: AccountTypeRolesEntity): void {
      this.accountTypeRoles = accountTypeRoles;
      this.dialog.show();
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.confirmDeleteDialog.show();
    }

    public onEditClick(): void {
      this.dialog.hide();
      this.addEditAccountTypeRolesDialog.show(this.accountTypeRoles);
    }

    public onDeleteCancel(): void {
      this.dialog.show();
    }

    public async onDeleteConfirm(): Promise<void> {
      this.$emit('delete', this.accountTypeRoles);
      this.confirmDeleteDialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .account-type-roles-dialog {
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
