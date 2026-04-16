<template>
  <div class="item-action-setup">
    <UiInput
      v-model="value.key"
      mode="compact"
      width="block"
      :label="$t('itemManagement.items.keyLabel')"
      :placeholder="$t('itemManagement.items.keyPlaceholder')"
      :required="true"
    />
    <UiSimpleSelect
      v-model="value.trigger"
      width="block"
      :options="actionTriggersOptions"
      :placeholder="$t('itemManagement.items.triggerPlaceholder')"
      :label="$t('itemManagement.items.triggerLabel')"
      :required="true"
      @update:modelValue="onTriggerUpdate"
    />
    <div class="item-action-setup__row">
      <UiHeading size="5">{{ $t('itemManagement.items.effects') }}</UiHeading>
      <UiButton
        class="item-action-setup__add-effect-button"
        type="secondary"
        :disabled="!value.trigger"
        @click="onAddEffectClick()"
      >
        <UiIcon name="plus" />
        <span>{{ $t('itemManagement.items.addEffect') }}</span>
      </UiButton>
    </div>

    <div class="item-action-setup__effects" v-if="value.effects.length">
      <ItemActionEffectSetup
        v-for="(effect, i) in value.effects"
        :key="`${i}${effect.type}`"
        :effectTypesOptions="effectTypesOptions"
        :value="effect"
        @delete="onEffectDelete($event)"
      />
    </div>
    <div v-else class="item-action-setup__empty-effects">{{ $t('itemManagement.items.effectsEmpty') }}</div>

    <UiButton
      class="item-action-setup__remove-button"
      shade="negative"
      width="shrink"
      size="sm"
      @click="$emit('delete', value)"
    >
      <UiIcon name="minus" size="sm" />
    </UiButton>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import {
    ItemEntity,
    ItemEntityActionEffectType,
    ItemEntityActionTrigger,
    type ItemEntityAction,
    type ItemEntityActionEffectSettings,
  } from '@kwokka/entities';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiInput from '@/app/ui-kit/UiInput.vue';
  import UiSimpleSelect from '@/app/ui-kit/UiSimpleSelect.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import ItemActionEffectSetup from './ItemActionEffectSetup.vue';

  @Component({
    components: {
      UiButton,
      UiIcon,
      UiHeading,
      UiInput,
      UiSimpleSelect,
      ItemActionEffectSetup,
    },
    emits: ['delete'],
  })
  export default class ItemActionSetup extends Vue {
    @Prop()
    public value: ItemEntityAction;

    public readonly effectTypes = ItemEntityActionEffectType;
    public readonly actionTriggersOptions = Object.values(ItemEntityActionTrigger);

    public get effectTypesOptions(): ItemEntityActionEffectType[] {
      return ItemEntity.triggerToActionWhitelist[this.value.trigger];
    }

    public onAddEffectClick(): void {
      this.value.effects = [...(this.value.effects || []), { type: null } as any];
    }

    public onTriggerUpdate(): void {
      this.value.effects = [];
    }

    public onEffectUpdate(effect: ItemEntityActionEffectSettings): void {
      if (effect.type === ItemEntityActionEffectType.Destroy) {
        (effect as any).settings = null;
      }
    }

    public onEffectDelete(effect: ItemEntityActionEffectSettings): void {
      this.value.effects = this.value.effects.filter((el) => el !== effect);
    }
  }
</script>

<style scoped lang="scss">
  .item-action-setup {
    display: flex;
    flex-direction: column;
    position: relative;
    @include UiGap(4, false);
    @include UiPadding(4, null, false);
    @include UiBorderRadius(md);

    @include UiTheme() {
      background-color: UiColor(shade-800);
    }

    &__effects {
      display: flex;
      flex-direction: column;
      @include UiGap(2, false);
    }

    &__remove-button {
      position: absolute;
      top: - UiGridSpacing(2);
      right: - UiGridSpacing(2);
    }

    &__add-effect-button {
      align-self: flex-end;
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 2px solid rgba(#fff, 0.35);
      @include UiPadding(4, top);
    }

    &__empty-effects {
      display: flex;
      align-items: center;
      justify-content: center;
      @include UiPadding(4);
      @include UiBorderRadius(md);
      @include UiTheme() {
        border: 1px solid UiColor(shade-600);
      }
    }
  }
</style>
