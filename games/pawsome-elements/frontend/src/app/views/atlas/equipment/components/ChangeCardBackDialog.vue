<template>
  <UiDialog
    ref="dialog"
    :title="$t('atlas.equipment.cardBack.dialogTitle')"
    :primaryButtonText="$t('atlas.equipment.confirm')"
    @primaryButtonClick="confirmSelection(selectedItemId)"
  >
    <template v-slot:body>
      <UiLoader class="change-card-back-dialog-loader" v-if="!items?.length || !itemInstances?.length || !trait" />
      <div v-else class="change-card-back-dialog">
        <EquipmentItemCard
          :isSelected="!selectedItemId"
          :isEquipped="!trait?.value"
          :name="$t('item.pwsm_deck_backface_standard.title')"
          @click="selectedItemId = undefined"
        >
          <ItemCardBack />
        </EquipmentItemCard>
        <EquipmentItemCard
          v-for="item in items"
          :key="item.id"
          :isSelected="selectedItemId === item.id"
          :isEquipped="trait?.value === item.id"
          :isDisabled="!isItemAvailable(item)"
          :name="$t(`item.${item.key}.title`)"
          @click="selectedItemId = item.id"
        >
          <ItemCardBack :cardKey="item.key" />
        </EquipmentItemCard>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { ItemEntity, ItemInstanceEntity, TraitInstanceEntity } from '@kwokka/entities';
  import EquipmentItemCard from './EquipmentItemCard.vue';
  import { UiDialog, UiLoader } from '@/app/ui-kit';
  import ItemCardBack from './ItemCardBack.vue';

  @Component({
    components: {
      UiDialog,
      UiLoader,
      EquipmentItemCard,
      ItemCardBack,
    },
    emits: ['confirm'],
  })
  export default class ChangeCardBackDialog extends Vue {
    public selectedItemId: string = null;

    @Prop({ required: true })
    public items: ItemEntity[];

    @Prop({ required: true })
    public itemInstances: ItemInstanceEntity[];

    @Prop({ required: true })
    public trait: TraitInstanceEntity;

    @Ref()
    public dialog: UiDialog;

    public async show(): Promise<void> {
      this.selectedItemId = this.trait?.value;
      this.dialog.show();
    }

    public isItemAvailable(item: ItemEntity): boolean {
      return (this.itemInstances || []).some((el) => el?.itemId === item?.id && el?.quantity);
    }

    public confirmSelection(itemId?: string): void {
      if (itemId === this.trait?.value) {
        return;
      }

      const item = this.items.find((el) => el.id === itemId) || null;
      this.$emit('confirm', item);
    }
  }
</script>

<style scoped lang="scss">
  .change-card-back-dialog-loader {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .change-card-back-dialog {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    @include UiGap(4);

    > * {
      aspect-ratio: 7 / 5;
    }
  }
</style>
