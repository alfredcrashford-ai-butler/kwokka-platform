<template>
  <UiDialog
    ref="dialog"
    :title="$t('atlas.journey.unlockRewardTitle')"
    :text="text"
    :primaryButtonText="$t('atlas.journey.unlockRewardConfirm')"
    :isPrimaryButtonShown="!isNotEnoughEssence"
    @primaryButtonClick="$emit('confirm', { item, itemTrade })"
  />
</template>

<script lang="ts">
  import { Component, Prop, Ref, Vue } from 'vue-facing-decorator';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import type { SkillTreeItem } from '@/game-data/skills';
  import type { ItemInstanceEntity, ItemTradeEntity } from '@kwokka/entities';

  @Component({
    components: {
      UiDialog,
    },
    emits: ['confirm'],
  })
  export default class UnlockRewardDialog extends Vue {
    @Prop({ required: true })
    private essenceItemInstance: ItemInstanceEntity;

    @Prop({ required: true })
    public item: SkillTreeItem;

    @Prop({ required: true })
    public itemTrade: ItemTradeEntity;

    @Ref()
    public dialog: UiDialog;

    public get isNotEnoughEssence(): boolean {
      return this.essenceQuantity < this.itemTrade?.tradedItemQuantity;
    }

    public get essenceQuantity(): number {
      return this.essenceItemInstance?.quantity || 0;
    }

    public get text(): string {
      if (!this.itemTrade || !this.item) {
        return '';
      }

      const name = this.$t(`item.${this.item.key}.title`);
      const cost = this.itemTrade.tradedItemQuantity;
      if (this.isNotEnoughEssence) {
        const balance = this.essenceQuantity;
        return this.$t('atlas.journey.unlockRewardNotEnoughEssence', { name, cost, balance });
      }

      return this.$t('atlas.journey.unlockRewardText', { name, cost });
    }

    public async show(): Promise<void> {
      this.dialog.show();
    }
  }
</script>
