<template>
  <div class="item-action-effect-setup">
    <UiSimpleSelect
      v-model="value.type"
      width="block"
      :options="effectTypesOptions"
      :placeholder="$t('itemManagement.items.effectTypePlaceholder')"
      :label="$t('itemManagement.items.effectTypeLabel')"
      :required="true"
      @update:modelValue="onEffectUpdate(value)"
    />

    <UiTextarea
      v-if="[effectTypes.GetItems, effectTypes.UnlockDecorations, effectTypes.GetRandomItems].includes(value.type)"
      v-model="stringifiedSettings"
      width="block"
      :placeholder="$t('itemManagement.items.effectSettingsPlaceholder')"
      :label="$t('itemManagement.items.effectSettingsLabel')"
      :invalid="!isJsonString(stringifiedSettings)"
      :required="true"
    />

    <UiButton
      class="item-action-effect-setup__remove-button"
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
  import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
  import { ItemEntityActionEffectType, type ItemEntityActionEffectSettings } from '@kwokka/entities';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiSimpleSelect from '@/app/ui-kit/UiSimpleSelect.vue';
  import UiTextarea from '@/app/ui-kit/UiTextarea.vue';

  @Component({
    components: {
      UiButton,
      UiIcon,
      UiSimpleSelect,
      UiTextarea,
    },
    emits: ['update', 'delete'],
  })
  export default class ItemActionEffectSetup extends Vue {
    @Prop()
    public value: ItemEntityActionEffectSettings;

    @Prop()
    public effectTypesOptions: ItemEntityActionEffectType[];

    public readonly effectTypes = ItemEntityActionEffectType;
    public stringifiedSettings = '';

    public onEffectUpdate(effect: ItemEntityActionEffectSettings): void {
      if (effect.type === ItemEntityActionEffectType.Destroy) {
        (effect as any).settings = null;
      }
    }

    public created(): void {
      const maybeSettings = (this.value as any).settings;
      if (maybeSettings) {
        this.stringifiedSettings = JSON.stringify(maybeSettings);
      }
    }

    @Watch('stringifiedSettings')
    public onSettingsUpdated(str: string): void {
      if (this.isJsonString(str)) {
        (this.value as any).settings = JSON.parse(str);
      } else {
        (this.value as any).settings = null;
      }
      this.$emit('update', this.value);
    }

    public isJsonString(str: string): boolean {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
  }
</script>

<style scoped lang="scss">
  .item-action-effect-setup {
    position: relative;
    display: flex;
    flex-direction: column;
    @include UiGap(2, false);
    @include UiPadding(4);
    @include UiBorderRadius(md);

    @include UiTheme() {
      border: 1px solid UiColor(shade-600);
    }

    &__remove-button {
      position: absolute;
      top: - UiGridSpacing(1);
      right: - UiGridSpacing(1);
    }
  }
</style>
