<template>
  <UiDialog
    ref="dialog"
    :title="$t('account.traits.traitDialogTitle')"
    @primaryButtonClick="onConfirm()"
    :isPrimaryButtonDisabled="traitInstanceValue === ''"
  >
    <template v-slot:body>
      <h3>{{ $t('account.traits.traitDialogTraitInfo') }}</h3>
      <div v-if="trait" class="account-trait-dialog__trait-info">
        <p>id: {{ trait.id }}</p>
        <p>key: {{ trait.key }}</p>
        <p>applicationAccountId: {{ trait.applicationAccountId }}</p>
        <p>defaultValue: {{ trait.defaultValue }}</p>
        <p>type: {{ trait.type }}</p>
      </div>
      <div v-if="traitInstance">
        <UiTextarea
          v-model="traitInstanceValue"
          width="block"
          mode="compact"
          :label="$t('account.traits.traitDialogValueLabel')"
          :placeholder="$t('account.traits.traitDialogValuePlaceholder')"
        />
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import { AccountEntity, TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import { TraitInstanceApi } from '@/api/avatar/trait-instance/trait-instance.api';
  import UiTextarea from '@/app/ui-kit/UiTextarea.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiTextarea,
    },
    emits: ['confirm'],
  })
  export default class AccountTraitDialog extends Vue {
    public trait: TraitEntity = null;
    public traitInstance: TraitInstanceEntity = null;
    public traitInstanceValue = null;

    @Ref()
    public dialog: UiDialog;

    @Prop({ required: true })
    public account: AccountEntity;

    @LazyInject(TraitInstanceApi)
    public traitInstanceApi: TraitInstanceApi;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public async show(trait: TraitEntity): Promise<void> {
      this.trait = trait;
      this.dialog.show();
      const traitInstanceRes = await this.traitInstanceApi.getTraitInstanceByTraitId(this.account.id, this.trait.id);
      this.traitInstance = traitInstanceRes.data;
      this.traitInstanceValue = this.traitInstance.value;
    }

    public async onConfirm(): Promise<void> {
      await this.traitInstanceApi.updateTraitInstanceByTraitId(this.account.id, this.trait.id, this.traitInstanceValue);
      this.$emit('confirm');
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .account-trait-dialog {
    &__trait-info {
      @include UiPadding(4);
      @include UiBorderRadius(sm);
      @include UiTheme() {
        background-color: UiColor(shade-800);
      }
      @include UiMargin(4, bottom);
    }
  }
</style>
