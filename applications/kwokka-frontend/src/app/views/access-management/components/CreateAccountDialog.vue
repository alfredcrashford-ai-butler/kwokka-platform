<template>
  <UiDialog ref="dialog" :title="$t('accessManagement.accounts.create')" :isPrimaryButtonShown="false">
    <template v-slot:body>
      <UiButton
        class="create-account-dialog__button"
        shade="accent"
        width="block"
        :disabled="!accessService.hasRight(owlRights.CreateUserAccount)"
        @click="onSelect(accountTypes.User)"
        >{{ $t('accessManagement.accounts.user') }}</UiButton
      >
      <UiButton
        class="create-account-dialog__button"
        shade="accent"
        width="block"
        :disabled="!accessService.hasRight(owlRights.CreateApplicationAdminAccount)"
        @click="onSelect(accountTypes.ApplicationAdmin)"
        >{{ $t('accessManagement.accounts.applicationAdmin') }}</UiButton
      >
      <UiButton
        class="create-account-dialog__button"
        shade="accent"
        width="block"
        :disabled="!accessService.hasRight(owlRights.CreateApplicationAccount)"
        @click="onSelect(accountTypes.Application)"
        >{{ $t('accessManagement.accounts.application') }}</UiButton
      >
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { OwlAccessRight } from '@kwokka/rights';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import { AccountEntityType } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { AccessService } from '@/service/access/access.service';

  @Component({
    components: {
      UiDialog,
      UiButton,
    },
    emits: ['confirm'],
  })
  export default class CreateAccountDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @LazyInject(AccessService)
    public accessService: AccessService;

    public readonly accountTypes = AccountEntityType;
    public readonly owlRights = OwlAccessRight;

    public show(): void {
      this.dialog.show();
    }

    public onSelect(type: AccountEntityType): void {
      this.dialog.hide();
      this.$emit('confirm', type);
    }
  }
</script>

<style scoped lang="scss">
  .create-account-dialog {
    &__button {
      @include UiMargin(2, bottom);
    }
  }
</style>
