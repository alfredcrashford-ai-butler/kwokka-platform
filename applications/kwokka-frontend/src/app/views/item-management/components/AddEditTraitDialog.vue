<template>
  <UiDialog
    ref="dialog"
    :title="dialogTitle"
    :isPrimaryButtonDisabled="!isValid"
    :shouldCloseOnPrimaryButtonClick="false"
    @primaryButtonClick="onConfirm"
  >
    <template v-slot:body>
      <div class="add-edit-trait-dialog" v-if="trait">
        <template v-if="trait.id">
          <div class="add-edit-trait-dialog__row">
            <span>Id: {{ trait.id }}</span>
            <UiButton size="sm" width="shrink" type="secondary" @click="onCopyIdClick">
              <UiIcon name="copy" size="sm" />
            </UiButton>
          </div>
          <UiButton shade="negative" width="block" @click="onDeleteClick">
            <UiIcon name="trash" />
            {{ $t('itemManagement.traits.delete') }}
          </UiButton>
        </template>
        <UiInput
          v-model="trait.key"
          width="block"
          mode="compact"
          :required="true"
          :label="$t('itemManagement.traits.keyLabel')"
          :placeholder="$t('itemManagement.traits.keyPlaceholder')"
        />
        <UiInput
          v-model="trait.applicationAccountId"
          width="block"
          mode="compact"
          :required="true"
          :disabled="!!trait?.id"
          :label="$t('itemManagement.traits.applicationAccountLabel')"
          :placeholder="$t('itemManagement.traits.applicationAccountPlaceholder')"
        />
        <UiSimpleSelect
          v-model="trait.type"
          width="block"
          mode="compact"
          :required="true"
          :options="types"
          :placeholder="$t('itemManagement.traits.typePlaceholder')"
          :label="$t('itemManagement.traits.typeLabel')"
        />
        <UiInput
          v-model="trait.defaultValue"
          width="block"
          mode="compact"
          :required="isDefaultValueRequired"
          :label="$t('itemManagement.traits.defaultValueLabel')"
          :placeholder="$t('itemManagement.traits.defaultValuePlaceholder')"
        />
        <UiTextarea
          v-if="hasConfig"
          v-model="stringifiedConfig"
          width="block"
          :label="$t('itemManagement.traits.configLabel')"
          :placeholder="$t('itemManagement.traits.configPlaceholder')"
          :invalid="!isJsonString(stringifiedConfig)"
          :required="true"
        />
        <UiCheckbox v-model="trait.isOwnerEditable">
          {{ $t('itemManagement.traits.isOwnerEditableLabel') }}
        </UiCheckbox>
        <UiCheckbox v-model="trait.isPubliclyVisible">
          {{ $t('itemManagement.traits.isPubliclyVisibleLabel') }}
        </UiCheckbox>
      </div>
    </template>
  </UiDialog>

  <UiDialog
    ref="deleteDialog"
    :title="$t('itemManagement.traits.deleteConfirmTitle')"
    :text="$t('itemManagement.traits.deleteConfirmDescription')"
    @primaryButtonClick="$emit('delete', trait)"
  >
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Ref, Vue, Watch } from 'vue-facing-decorator';
  import { TraitEntity, TraitType } from '@kwokka/entities';
  import { copyTextToClipboard } from '@/utils/clipboard';
  import { LazyInject } from '@/ioc';
  import { NotificationService } from '@/service/notification/notification.service';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiSimpleSelect from '@/app/ui-kit/UiSimpleSelect.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiCheckbox from '@/app/ui-kit/UiCheckbox.vue';
  import UiTextarea from '@/app/ui-kit/UiTextarea.vue';

  @Component({
    components: {
      UiDialog,
      UiButton,
      UiInput,
      UiIcon,
      UiTextarea,
      UiCheckbox,
      UiSimpleSelect,
    },
    emits: ['confirm', 'delete'],
  })
  export default class AddEditTraitDialog extends Vue {
    @Ref()
    public dialog: UiDialog;

    @Ref()
    public deleteDialog: UiDialog;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    public stringifiedConfig = '';
    public trait: TraitEntity = null;
    public types: TraitType[] = Object.values(TraitType);

    public get hasConfig(): boolean {
      return [TraitType.Custom, TraitType.Item].includes(this.trait.type);
    }

    public get isValid(): boolean {
      if (!this.trait) {
        return false;
      }

      const isDefaultValueValid = this.isDefaultValueRequired ? !!this.trait.defaultValue : true;
      const isConfigValid = !this.hasConfig || this.isJsonString(this.stringifiedConfig);
      const isTraitValid = this.trait.key && this.trait.type && this.trait.applicationAccountId;

      return Boolean(isTraitValid && isDefaultValueValid && isConfigValid);
    }

    public get isDefaultValueRequired(): boolean {
      return [TraitType.Numeric, TraitType.Text].includes(this.trait?.type);
    }

    public get dialogTitle(): string {
      if (this.trait?.id) {
        return this.$t('itemManagement.traits.editTrait');
      }

      return this.$t('itemManagement.traits.addTrait');
    }

    public isJsonString(str: string): boolean {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    public show(trait?: TraitEntity): void {
      this.trait = new TraitEntity(
        trait || {
          key: '',
          applicationAccountId: undefined,
          type: null,
          defaultValue: undefined,
        },
      );
      const maybeConfig = this.trait.config;
      if (maybeConfig) {
        this.stringifiedConfig = JSON.stringify(maybeConfig);
      } else {
        this.stringifiedConfig = '';
      }
      this.dialog.show();
    }

    @Watch('stringifiedConfig')
    public onConfigUpdated(str: string): void {
      if (this.isJsonString(str)) {
        this.trait.config = JSON.parse(str);
      } else {
        this.trait.config = null;
      }
    }

    public onConfirm(): void {
      this.$emit('confirm', this.trait);
    }

    public onDeleteClick(): void {
      this.dialog.hide();
      this.deleteDialog.show();
    }

    public onCopyIdClick(): void {
      copyTextToClipboard(this.trait.id);
      this.notificationService.show({ type: 'info', text: this.$t('general.copied') });
    }

    public hide(): void {
      this.dialog.hide();
    }
  }
</script>

<style scoped lang="scss">
  .add-edit-trait-dialog {
    display: flex;
    flex-direction: column;
    @include UiGap(4, false);

    &__row {
      display: flex;
      align-items: center;
      @include UiGap(4, false);
    }
  }
</style>
