<template>
  <UiDialog
    ref="dialog"
    :title="$t('atlas.equipment.arena.dialogTitle')"
    :primaryButtonText="$t('atlas.equipment.confirm')"
    @primaryButtonClick="confirmSelection(selectedItemId)"
  >
    <template v-slot:body>
      <UiLoader v-if="!items?.length || !itemInstances?.length || !trait" class="change-arena-dialog-loader" />
      <div v-else class="change-arena-dialog">
        <EquipmentItemCard
          :isSelected="!selectedItemId"
          :isEquipped="!trait?.value"
          :name="$t('item.pwsm_arena_standard.title')"
          @click="selectedItemId = undefined"
        >
          <ItemArena />
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
          <ItemArena :arenaKey="item.key" />
        </EquipmentItemCard>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { ItemEntity, ItemInstanceEntity, TraitInstanceEntity } from '@kwokka/entities';
  import EquipmentItemCard from './EquipmentItemCard.vue';
  import ItemArena from './ItemArena.vue';
  import { UiLoader, UiDialog } from '@/app/ui-kit';

  @Component({
    components: {
      UiDialog,
      UiLoader,
      EquipmentItemCard,
      ItemArena,
    },
    emits: ['confirm'],
  })
  export default class ChangeArenaDialog extends Vue {
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
  .change-arena-dialog-loader {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .change-arena-dialog {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    @include UiGap(4);

    > * {
      aspect-ratio: 7 / 5;
    }
  }
</style>
