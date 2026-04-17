<template>
  <div class="journey-view">
    <FadeTransition>
      <div v-if="!isLoading" class="journey-view__container">
        <ControlPanel class="journey-view__top-panel">
          <EssencePanel class="journey-view__essence-panel" ref="essencePanel" :isGlowing="false" />
        </ControlPanel>

        <div class="journey-view__main">
          <JourneyMapRenderer
            :map="journeyMap"
            :page="page"
            :maxPage="maxPage"
            :itemsPerPage="itemsPerPage"
            :items="displayedItems"
            @select="onItemSelect($event)"
          />
        </div>

        <ArrowPanel class="journey-view__bottom-panel">
          <UiArrowButton direction="left" :disabled="page === 0" @click="setPage(page - 1)" />
          <div class="journey-view__action">
            <ActionPanel class="journey-view__unlock-container">
              <FadeTransition>
                <div v-if="selectedItem" :key="selectedItem.tradeKey" class="journey-view__item-container">
                  <div class="journey-view__item-info">
                    <UiButton type="transparent" size="sm" @click="rewardInfoDialog.show()">
                      <UiIcon name="info" />
                    </UiButton>
                    <p class="journey-view__selected-item-name">{{ $t(`item.${selectedItem?.item?.key}.title`) }}</p>
                  </div>
                  <UiButton v-if="isSelectedItemUnlocked" type="green" disabled>
                    {{ $t('atlas.journey.unlocked') }}
                  </UiButton>
                  <UiButton v-else @click="unlockRewardDialog.show()" :disabled="!isSelectedItemActive">
                    {{ $t('atlas.journey.unlock', { cost: selectedItem.trade.tradedItemQuantity }) }}
                  </UiButton>
                </div>
                <p class="journey-view__caption" v-else>{{ $t('atlas.journey.emptyActionPlaceholder') }}</p>
              </FadeTransition>
            </ActionPanel>
          </div>
          <UiArrowButton direction="right" :disabled="page === maxPage" @click="setPage(page + 1)" />
        </ArrowPanel>
      </div>
    </FadeTransition>

    <RewardInfoDialog ref="rewardInfoDialog" :item="selectedItem?.item" />
    <UnlockRewardDialog
      ref="unlockRewardDialog"
      :essenceItemInstance="essenceItemInstance"
      :itemTrade="selectedItem?.trade"
      :item="selectedItem?.item"
      @confirm="onUnlockConfirm($event)"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import {
    ConfigService,
    ErrorTrackerService,
    KwokkaService,
    LoggerService,
    NotificationService,
    SoundService,
  } from '@/service';
  import { UiArrowButton, UiButton, UiIcon } from '@/app/ui-kit';
  import { ControlPanel, ArrowPanel, ActionPanel, EssencePanel } from '@/app/components';
  import type { JourneyMap } from '@/game-data';
  import { TraitKey } from '@/game-data/trait-key';
  import { ItemInstanceEntity, type ItemEntity, type ItemTradeEntity } from '@kwokka/entities';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';
  import RewardInfoDialog from './components/RewardInfoDialog.vue';
  import UnlockRewardDialog from './components/UnlockRewardDialog.vue';
  import { ItemKey } from '@/game-data/item-key';
  import JourneyMapRenderer, { type JourneyMapDisplayItem } from './components/JourneyMapRenderer.vue';

  @Component({
    components: {
      EssencePanel,
      UiArrowButton,
      UiButton,
      UiIcon,
      ArrowPanel,
      ControlPanel,
      JourneyMapRenderer,
      FadeTransition,
      ActionPanel,
      RewardInfoDialog,
      UnlockRewardDialog,
    },
  })
  export default class JourneyView extends Vue {
    @Ref()
    public essencePanel: EssencePanel;

    @Ref()
    public rewardInfoDialog: RewardInfoDialog;

    @Ref()
    public unlockRewardDialog: UnlockRewardDialog;

    @LazyInject(SoundService)
    public soundService: SoundService;

    @LazyInject(KwokkaService)
    public kwokkaService: KwokkaService;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService: ErrorTrackerService;

    @LazyInject(NotificationService)
    public notificationService: NotificationService;

    @LazyInject(ConfigService)
    public configService: ConfigService;

    public isLoading = true;
    public page = 0;
    public readonly itemsPerPage = 5;
    public maxPage = 0;
    public journeyMap: JourneyMap = null;
    public itemTrades: ItemTradeEntity[] = [];
    public items: ItemEntity[] = [];
    public itemInstances: ItemInstanceEntity[] = [];
    public selectedItem: JourneyMapDisplayItem = null;
    public essenceItemInstance: ItemInstanceEntity = null;

    public async setPage(page: number): Promise<void> {
      this.page = page;
      this.selectedItem = null;
      await this.fetchPage(page);
    }

    public async created(): Promise<void> {
      await this.fetchEssence();
      await this.setupJourneyMap();
      await this.fetchPage(this.page);
    }

    public get displayedItems(): JourneyMapDisplayItem[] {
      return this.journeyMap.itemTradeKeys.map((tradeKey) => {
        const trade = this.itemTrades.find((el) => el.key === tradeKey);
        const item = this.items.find((el) => el.id === trade?.itemId);
        const isCostShown = !this.isItemUnlocked(item?.id);
        const isActive = this.isItemActive(item?.id);
        const isSelected = item?.id && this.selectedItem?.item?.id === item?.id;
        const isHighlighted = isCostShown && isActive;
        return { item, trade, tradeKey, isCostShown, isActive, isHighlighted, isSelected };
      });
    }

    public get isSelectedItemUnlocked(): boolean {
      return this.isItemUnlocked(this.selectedItem?.item?.id);
    }

    public get isSelectedItemActive(): boolean {
      return this.isItemActive(this.selectedItem?.item?.id);
    }

    public get itemsSrc(): string {
      return this.configService.frontendConfig.kwokkaItemsSrc;
    }

    public isItemUnlocked(itemId: string): boolean {
      if (!itemId) {
        return false;
      }

      return this.itemInstances.some((el) => el.itemId === itemId && el.quantity);
    }

    public isItemActive(itemId: string): boolean {
      if (!itemId) {
        return true;
      }

      const trade = this.itemTrades.find((el) => el.itemId === itemId);
      return this.isItemUnlocked(itemId) || !trade?.requiredItems?.length || this.hasRequiredItems(trade);
    }

    public onItemSelect(item: JourneyMapDisplayItem): void {
      this.selectedItem = item;
    }

    public async onUnlockConfirm(arg: { item: ItemEntity; itemTrade: ItemTradeEntity }): Promise<void> {
      try {
        const itemInstance = await this.kwokkaService.client.inventory.runOwnItemTradeByid(arg.itemTrade.id);
        this.itemInstances = [...this.itemInstances.filter((el) => el.itemId !== arg.item.id), itemInstance];
        this.soundService.playSkillUnlock();
        this.essencePanel.fetchEssence();
        this.fetchEssence();
      } catch (e: any) {
        this.logger.error(e);
        this.errorTrackerService.captureError(e);
        this.notificationService.showErrors([e]);
      }
    }

    private getItemTradeKeysForPage(page: number): string[] {
      return this.journeyMap.itemTradeKeys.slice(
        this.itemsPerPage * page,
        this.itemsPerPage * page + this.itemsPerPage,
      );
    }

    private async fetchPage(page: number): Promise<void> {
      const itemTradeKeys = this.getItemTradeKeysForPage(page);
      const itemTrades = await this.fetchItemTrades(itemTradeKeys);
      this.itemTrades = [...this.itemTrades, ...itemTrades];
      if (!itemTrades.length) {
        return;
      }

      const items = await this.fetchItems();
      this.items = [...this.items, ...items];
      const itemInstances = await this.fetchItemInstances();
      this.itemInstances = [...this.itemInstances, ...itemInstances];
    }

    private async fetchItemTrades(keys: string[]): Promise<ItemTradeEntity[]> {
      const itemTradeKeysToFetch = keys.filter((key) => !this.itemTrades.find((el) => el.key === key));
      const promises = itemTradeKeysToFetch.map((key) => this.kwokkaService.client.inventory.getItemTradeByKey(key));
      const itemTrades = await Promise.all(promises);
      return itemTrades;
    }

    private async fetchItems(): Promise<ItemEntity[]> {
      const itemIds = this.itemTrades.map((el) => el.itemId);
      const itemIdsToFetch = itemIds.filter((id) => !this.items.find((el) => el.id === id));
      const items = await this.kwokkaService.client.inventory.getItemsByIds(itemIdsToFetch);
      return items;
    }

    private async fetchItemInstances(): Promise<ItemInstanceEntity[]> {
      const itemInstancesToFetch = this.items.filter((item) => !this.itemInstances.find((el) => el.itemId === item.id));
      const promises = itemInstancesToFetch.map(async (el) => {
        let itemInstance = await this.kwokkaService.client.inventory.getOwnItemInstanceByItemId(el.id);
        itemInstance ||= this.createEmptyItemInstance(el.id);
        return itemInstance;
      });
      const itemInstances = await Promise.all(promises);
      return itemInstances;
    }

    private createEmptyItemInstance(itemId: string): ItemInstanceEntity {
      return new ItemInstanceEntity({ accountId: this.kwokkaService.client.accountId, itemId, quantity: 0 });
    }

    private hasRequiredItems(trade: ItemTradeEntity): boolean {
      return trade?.requiredItems?.every((req) =>
        this.itemInstances.some((el) => el.itemId === req.itemId && el.quantity >= req.quantity),
      );
    }

    private async fetchEssence(): Promise<void> {
      this.essenceItemInstance = await this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.Essence);
    }

    private async setupJourneyMap(): Promise<void> {
      this.isLoading = true;
      try {
        const game = await this.kwokkaService.getGame();
        const traitInstance = await this.kwokkaService.client.trait.getTraitInstanceByTraitKey(
          game.applicationAccountId,
          TraitKey.JourneyMapConfig,
        );
        const map: JourneyMap = JSON.parse(traitInstance.value);
        this.journeyMap = map;
        this.maxPage = Math.ceil(map.itemTradeKeys.length / this.itemsPerPage) - 1;
        this.isLoading = false;
      } catch (e: any) {
        this.logger.error(e);
        this.errorTrackerService.captureError(e);
        this.notificationService.showErrors([e]);
      }
    }
  }
</script>

<style scoped lang="scss">
  .journey-view {
    height: 100%;
    width: 100%;
    display: flex;
    position: relative;

    &__container {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    &__top-panel {
      position: relative;
      height: UiSpacing(14);
      z-index: 1;
    }

    &__main {
      position: relative;
      flex-grow: 1;
      width: 100%;
    }

    &__bottom-panel {
      position: relative;
      height: UiSpacing(17);
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include UiPadding(1);
    }

    &__essence-panel {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 25%);
    }

    &__action {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__unlock-container {
      display: flex;
      align-items: center;
      width: 90%;
    }

    &__item-container {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;

      @include UiMediaPortrait() {
        flex-direction: column;
        @include UiGap(1);
      }
    }

    &__selected-item-name {
      @include UiTextShadow(2);
      @include UiTypographyHeading5();
      flex-grow: 1;
    }

    &__caption {
      @include UiTextShadow(2);
      @include UiTypographyHeading5();
    }

    &__item-info {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
</style>
