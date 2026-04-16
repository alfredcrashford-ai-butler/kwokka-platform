<template>
  <div class="item-actions-setup">
    <div class="item-actions-setup__row">
      <UiHeading size="4">{{ $t('itemManagement.items.actions') }}</UiHeading>
      <UiButton size="sm" shade="accent" @click="onAddClick">
        <UiIcon name="plus" size="sm" />
        {{ $t('itemManagement.items.addAction') }}
      </UiButton>
    </div>
    <div class="item-actions-setup__empty-actions" v-if="!modelValue?.length">
      {{ $t('itemManagement.items.actionsEmpty') }}
    </div>
    <ItemActionSetup
      v-for="(action, index) in modelValue"
      :key="index"
      :value="action"
      @delete="onActionDelete($event)"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { ItemEntityActionTrigger, type ItemEntityAction } from '@kwokka/entities';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import ItemActionSetup from './ItemActionSetup.vue';

  @Component({
    components: {
      UiHeading,
      UiButton,
      UiIcon,
      ItemActionSetup,
    },
    emits: ['update:modelValue'],
  })
  export default class ItemActionsSetup extends Vue {
    @Prop()
    public modelValue: ItemEntityAction[];

    public readonly actionTriggers = Object.values(ItemEntityActionTrigger);

    public onAddClick(): void {
      const newValue = [...this.modelValue, { trigger: null, key: '', effects: [] }];
      this.$emit('update:modelValue', newValue);
    }

    public onActionDelete(action: ItemEntityAction) {
      const newValue = this.modelValue.filter((el) => el !== action);
      this.$emit('update:modelValue', newValue);
    }
  }
</script>

<style scoped lang="scss">
  .item-actions-setup {
    display: flex;
    flex-direction: column;
    @include UiGap(4, false);

    &__empty-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      @include UiPadding(4);
      @include UiBorderRadius(md);
      @include UiTheme() {
        background-color: UiColor(shade-800);
      }
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
