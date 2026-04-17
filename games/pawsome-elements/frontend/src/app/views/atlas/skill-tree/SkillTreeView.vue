<template>
  <div class="skill-tree-view">
    <FadeTransition>
      <div v-if="!isLoading" class="skill-tree-view__container">
        <div class="skill-tree-view__tree-container">
          <SkillTreeRenderer
            :tree="tree"
            :ownedItems="ownedItems"
            :selectedItem="selectedItem"
            :equippedItemKey="equippedItemKey"
            :activeItems="activeItems"
            @select="selectedItem = $event"
          />
        </div>

        <div class="skill-tree-view__divider">
          <UiDivider />
          <EssencePanel class="skill-tree-view__essence-panel" ref="essencePanel" :isGlowing="false" />
        </div>

        <SkillAction
          :item="selectedItem"
          :isOwned="ownedItems[selectedItem?.key]"
          :isEquipped="selectedItem?.key === equippedItemKey"
          :isActive="activeItems.includes(selectedItem)"
          @unlock="onUnlock($event)"
          @equip="onEquip($event)"
        />
      </div>
    </FadeTransition>

    <UnlockSkillDialog ref="unlockSkillDialog" @confirm="onUnlockConfirm($event)" />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import type { ItemInstanceEntity, ItemTradeEntity } from '@kwokka/entities';
  import { LazyInject } from '@/ioc';
  import { ErrorTrackerService, KwokkaService, LoggerService, NotificationService, SoundService } from '@/service';
  import { type SkillTree, type SkillTreeItem } from '@/game-data/skills';
  import { UiDivider } from '@/app/ui-kit';
  import { TraitKey } from '@/game-data/trait-key';
  import { FadeTransition } from '@/app/transitions';
  import { EssencePanel } from '@/app/components';
  import { SkillTreeRenderer, SkillAction, UnlockSkillDialog } from '../components';

  @Component({
    components: {
      UiDivider,
      SkillTreeRenderer,
      SkillAction,
      UnlockSkillDialog,
      EssencePanel,
      FadeTransition,
    },
  })
  export default class SkillTreeView extends Vue {
    public tree: SkillTree = null;
    public selectedItem: SkillTreeItem = null;
    public equippedItemKey: string = null;
    public ownedItems: Record<string, boolean> = {};
    public ownedItemInstances: ItemInstanceEntity[] = [];
    public isLoading = true;

    @Ref()
    public unlockSkillDialog: UnlockSkillDialog;

    @Ref()
    public essencePanel: EssencePanel;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService: ErrorTrackerService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(SoundService)
    public soundService: SoundService;

    public get columns(): SkillTreeItem[][] {
      const items = [];
      this.tree.items.forEach((el) => (items[el.tier] = [...(items[el.tier] || []), el]));
      return items;
    }

    public mounted(): void {
      this.setupSkillTree();
    }

    public get activeItems(): SkillTreeItem[] {
      const allOwnedItems = Object.keys(this.ownedItems).filter((key) => this.ownedItems[key]);
      return this.tree.items.filter(
        (el) =>
          this.ownedItems[el.key] || !el.requires?.length || el.requires.every((req) => allOwnedItems.includes(req)),
      );
    }

    public onUnlock(item: SkillTreeItem): void {
      this.unlockSkillDialog.show(item);
    }

    public async onUnlockConfirm(itemTrade: ItemTradeEntity): Promise<void> {
      try {
        const itemInstance = await this.kwokkaService.client.inventory.runOwnItemTradeByid(itemTrade.id);
        this.ownedItemInstances = [...this.ownedItemInstances, itemInstance];
        const item = await this.kwokkaService.client.inventory.getItemById(itemInstance.itemId);
        this.ownedItems = { ...this.ownedItems, [item.key]: true };
        this.soundService.playSkillUnlock();
        this.essencePanel.fetchEssence();
      } catch (e: any) {
        this.logger.error(e);
        this.errorTrackerService.captureError(e);
        this.notificationService.showErrors([e]);
      }
    }

    public async onEquip(item: SkillTreeItem): Promise<void> {
      try {
        const skillItem = await this.kwokkaService.client.inventory.getItemByKey(item.key);
        await this.kwokkaService.client.trait.updateOwnTraitInstanceByTraitKey(TraitKey.EquippedSkill, skillItem.id);
        this.equippedItemKey = skillItem.key;
        this.soundService.playSkillEquip();
      } catch (e: any) {
        this.logger.error(e);
        this.errorTrackerService.captureError(e);
        this.notificationService.showErrors([e]);
      }
    }

    private async setupSkillTree(): Promise<void> {
      this.isLoading = true;
      await this.fetchSkillTree();
      await this.fetchSkillsInformation();
      this.isLoading = false;
    }

    private async fetchSkillsInformation(): Promise<void> {
      const skillKeys = Object.keys(this.ownedItems);
      const inventoryClient = this.kwokkaService.client.inventory;
      const promises = skillKeys.map((key: string) => inventoryClient.getOwnItemInstanceByItemKey(key));
      const itemInstances = await Promise.all(promises);
      this.ownedItemInstances = itemInstances.filter(Boolean).filter((el) => el.quantity);
      const ownedItemsPromises = this.ownedItemInstances.map((itemInstance) =>
        inventoryClient.getItemById(itemInstance.itemId),
      );
      const ownedItems = await Promise.all(ownedItemsPromises);
      ownedItems.forEach((el) => (this.ownedItems[el.key] = true));
      const trait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.EquippedSkill);
      if (trait.value) {
        const equippedItem = await await this.kwokkaService.client.inventory.getItemById(trait.value);
        this.equippedItemKey = equippedItem?.key;
      }
    }

    private async fetchSkillTree(): Promise<void> {
      const game = await this.kwokkaService.getGame();
      const skillTreeTrait = await this.kwokkaService.client.trait.getTraitInstanceByTraitKey(
        game.applicationAccountId,
        TraitKey.SkillTreeConfig,
      );
      const skillTree = JSON.parse(skillTreeTrait.value);
      skillTree.items.map((el) => el.key).forEach((key) => (this.ownedItems[key] = false));
      this.tree = skillTree;
    }
  }
</script>

<style scoped lang="scss">
  .skill-tree-view {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    &__divider {
      position: relative;
      width: 100%;
    }

    &__essence-panel {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    &__tree-container {
      width: 100%;
      flex-grow: 1;
      overflow: auto;
    }

    &__container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
</style>
