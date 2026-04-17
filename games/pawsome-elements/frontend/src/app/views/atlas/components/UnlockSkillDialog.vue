<template>
  <UiDialog
    ref="dialog"
    :title="$t('atlas.skillTree.unlockSkillTitle')"
    :text="text"
    :primaryButtonText="$t('atlas.skillTree.unlockSkillConfirm')"
    :isPrimaryButtonShown="!isNotEnoughEssence"
    @primaryButtonClick="$emit('confirm', itemTrade)"
    @hide="skillTreeItem = null"
  />
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import UiDialog from '@/app/ui-kit/UiDialog.vue';
  import type { SkillTreeItem } from '@/game-data/skills';
  import type { ItemInstanceEntity, ItemTradeEntity } from '@kwokka/entities';
  import { KwokkaService } from '@/service';
  import { LazyInject } from '@/ioc';
  import { ItemKey } from '@/game-data/item-key';

  @Component({
    components: {
      UiDialog,
    },
    emits: ['confirm'],
  })
  export default class UnlockSkillDialog extends Vue {
    public skillTreeItem: SkillTreeItem = null;
    public itemTrade: ItemTradeEntity = null;
    public essenceItemInstance: ItemInstanceEntity = null;

    @Ref()
    public dialog: UiDialog;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    public get isNotEnoughEssence(): boolean {
      return this.essenceQuantity < this.itemTrade?.tradedItemQuantity;
    }

    public get essenceQuantity(): number {
      return this.essenceItemInstance?.quantity || 0;
    }

    public get text(): string {
      if (!this.itemTrade || !this.skillTreeItem) {
        return '';
      }

      const name = this.$t(`skill.${this.skillTreeItem.key}.title`);
      const cost = this.itemTrade.tradedItemQuantity;
      if (this.isNotEnoughEssence) {
        const balance = this.essenceQuantity;
        return this.$t('atlas.skillTree.unlockSkillNotEnoughEssence', { name, cost, balance });
      }

      return this.$t('atlas.skillTree.unlockSkillText', { name, cost });
    }

    public show(skillTreeItem: SkillTreeItem): void {
      this.skillTreeItem = skillTreeItem;
      this.fetchTrade();
      this.dialog.show();
    }

    private async fetchTrade(): Promise<void> {
      this.essenceItemInstance = await this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.Essence);
      this.itemTrade = await this.kwokkaService.client.inventory.getItemTradeByKey(this.skillTreeItem.itemTradeKey);
    }
  }
</script>
