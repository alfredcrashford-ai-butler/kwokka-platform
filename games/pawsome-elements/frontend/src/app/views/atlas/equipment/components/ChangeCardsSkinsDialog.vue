<template>
  <UiDialog
    ref="dialog"
    :title="$t('atlas.equipment.cardsSkins.dialogTitle')"
    :primaryButtonText="$t('atlas.equipment.confirm')"
    @primaryButtonClick="confirmSelection()"
  >
    <template v-slot:body>
      <UiLoader
        class="change-cards-skins-dialog-loader"
        v-if="!items?.length || !itemInstances?.length || !traits?.length"
      />
      <div v-else class="change-cards-skins-dialog">
        <div class="change-cards-skins-dialog__tabs">
          <button
            class="change-cards-skins-dialog__tab"
            :class="{ 'change-cards-skins-dialog__tab_is-selected': tab === activeTab }"
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
        <div class="change-cards-skins-dialog__container" :key="activeTab">
          <EquipmentItemCard
            :isSelected="!selectedItems[tabToTraitMap[activeTab]]"
            :isEquipped="!activeTabTraitInstance?.value"
            :name="$t(`item.pwsm_${defaultItemsMap[activeTab]}.title`)"
            @click="selectedItems[tabToTraitMap[activeTab]] = undefined"
          >
            <ItemCardSkin :traitKey="tabToTraitMap[activeTab]" />
          </EquipmentItemCard>
          <EquipmentItemCard
            v-for="item in activeTabItems"
            :key="item.id"
            :isSelected="selectedItems[tabToTraitMap[activeTab]] === item.id"
            :isEquipped="activeTabTraitInstance?.value === item.id"
            :isDisabled="!isItemAvailable(item)"
            :name="$t(`item.${item.key}.title`)"
            @click="selectedItems[tabToTraitMap[activeTab]] = item.id"
          >
            <ItemCardSkin :itemKey="item.key" :traitKey="tabToTraitMap[activeTab]" />
          </EquipmentItemCard>
        </div>
      </div>
    </template>
  </UiDialog>
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import type { ItemEntity, ItemInstanceEntity, TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
  import EquipmentItemCard from './EquipmentItemCard.vue';
  import { UiDialog, UiLoader } from '@/app/ui-kit';
  import ItemCardSkin from './ItemCardSkin.vue';
  import { TraitKey } from '@/game-data/trait-key';

  @Component({
    components: {
      UiDialog,
      UiLoader,
      EquipmentItemCard,
      ItemCardSkin,
    },
    emits: ['confirm'],
  })
  export default class ChangeCardsSkinsDialog extends Vue {
    public readonly tabs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'S'];
    public readonly tabToTraitMap = {
      ['1']: TraitKey.EquippedCardSkinSpitz,
      ['2']: TraitKey.EquippedCardSkinYork,
      ['3']: TraitKey.EquippedCardSkinDoxie,
      ['4']: TraitKey.EquippedCardSkinPug,
      ['5']: TraitKey.EquippedCardSkinCorgi,
      ['6']: TraitKey.EquippedCardSkinRetriever,
      ['7']: TraitKey.EquippedCardSkinHusky,
      ['8']: TraitKey.EquippedCardSkinDobermann,
      ['9']: TraitKey.EquippedCardSkinLabradoodle,
      ['S']: TraitKey.EquippedCardSkinSpecial,
    };
    public readonly defaultItemsMap = {
      ['1']: 'standard_spitz',
      ['2']: 'standard_york',
      ['3']: 'standard_doxie',
      ['4']: 'standard_pug',
      ['5']: 'standard_corgi',
      ['6']: 'standard_retriever',
      ['7']: 'standard_husky',
      ['8']: 'standard_dobermann',
      ['9']: 'standard_labradoodle',
      ['S']: 'standard_special',
    };
    public activeTab = '1';
    public selectedItems = {
      [TraitKey.EquippedCardSkinSpitz]: undefined,
      [TraitKey.EquippedCardSkinYork]: undefined,
      [TraitKey.EquippedCardSkinDoxie]: undefined,
      [TraitKey.EquippedCardSkinPug]: undefined,
      [TraitKey.EquippedCardSkinCorgi]: undefined,
      [TraitKey.EquippedCardSkinRetriever]: undefined,
      [TraitKey.EquippedCardSkinHusky]: undefined,
      [TraitKey.EquippedCardSkinDobermann]: undefined,
      [TraitKey.EquippedCardSkinLabradoodle]: undefined,
      [TraitKey.EquippedCardSkinSpecial]: undefined,
    };

    @Prop({ required: true })
    public items: ItemEntity[];

    @Prop({ required: true })
    public itemInstances: ItemInstanceEntity[];

    @Prop({ required: true })
    public traits: TraitEntity[];

    @Prop({ required: true })
    public traitInstances: TraitInstanceEntity[];

    @Ref()
    public dialog: UiDialog;

    public async show(): Promise<void> {
      this.traits.forEach(
        (trait) => (this.selectedItems[trait.key] = this.traitInstances.find((el) => el.traitId === trait.id)?.value),
      );
      this.activeTab = '1';
      this.dialog.show();
    }

    public get activeTabTrait(): TraitEntity {
      return (this.traits || []).find((el) => el.key === this.tabToTraitMap[this.activeTab]);
    }

    public get activeTabTraitInstance(): TraitInstanceEntity {
      return (this.traitInstances || []).find((el) => el.traitId === this.activeTabTrait?.id);
    }

    public get activeTabItems(): ItemEntity[] {
      return this.items.filter((el) => this.activeTabTrait.config.allowedItemsIds.includes(el.id));
    }

    public isItemAvailable(item: ItemEntity): boolean {
      return (this.itemInstances || []).some((el) => el?.itemId === item?.id && el?.quantity);
    }

    public confirmSelection(): void {
      const updates: any = {};
      Object.keys(this.selectedItems).forEach((key) => {
        const trait = this.traits.find((el) => el.key === key);
        const traitInstance = this.traitInstances.find((el) => el.traitId === trait.id);
        if (traitInstance?.value !== this.selectedItems[key]) {
          updates[key] = this.selectedItems[key];
        }
      });
      this.$emit('confirm', updates);
    }
  }
</script>

<style scoped lang="scss">
  .change-cards-skins-dialog-loader {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .change-cards-skins-dialog {
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__tabs {
      display: flex;
      width: 100%;
      @include UiGap(1);
    }

    &__tab {
      @include UiButtonAppearance();
      flex-grow: 1;
      flex-basis: 0;
      flex-shrink: 0;
      border: UiSpacing(0.25) solid UiColor(secondary-100);
      background-color: UiColor(secondary-900, 0.5);
      @include UiBorderRadius(2);

      &_is-selected {
        border: UiSpacing(0.25) solid UiColor(primary-100);
        background-color: UiColor(primary-900);
      }
    }

    &__container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      @include UiGap(4);

      & > * {
        aspect-ratio: 7 / 5;
      }
    }
  }
</style>
