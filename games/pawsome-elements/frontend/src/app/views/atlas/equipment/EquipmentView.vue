<template>
  <div class="equipment-view">
    <FadeTransition>
      <div v-if="state === states.Loaded" class="equipment-view__container">
        <div class="equipment-view__primary">
          <div class="equipment-view__avatar">
            <UserAvatarSettings />
          </div>
          <hr class="equipment-view__divider" />
          <EquipmentSkill
            class="equipment-view__skill"
            :skillKey="activeSkillItem?.key"
            @click="onActiveSkillClick()"
          />
          <hr class="equipment-view__divider" />
          <EquipmentSkill
            class="equipment-view__skill"
            :skillKey="passiveSkillKey"
            :isPassive="true"
            @click="onPassiveSkillClick()"
          >
            <div class="equipment-view__essence-multiplier">x{{ essenceMultiplier }}</div>
          </EquipmentSkill>
        </div>
        <UiDivider class="ui-hide_portrait" direction="vertical" />
        <UiDivider class="ui-hide_landscape" />
        <div class="equipment-view__cosmetic">
          <EquipmentArena class="equipment-view__arena" :arenaKey="arenaItem?.key" @click="onArenaClick()" />
          <div class="equipment-view__cards">
            <EquipmentCardsSkins
              class="equipment-view__cards-skins"
              :cardsSkins="cardsSkins"
              @click="onCardsSkinsClick()"
            />
            <EquipmentDeckBackface
              class="equipment-view__card-back"
              :cardKey="cardBackItem?.key"
              @click="onCardBackClick()"
            />
          </div>
        </div>
      </div>
      <div v-else-if="state === states.Error"></div>
    </FadeTransition>

    <ChangeArenaDialog
      ref="changeArenaDialog"
      :items="arenaItems"
      :itemInstances="arenaItemInstances"
      :trait="arenaTrait"
      @confirm="onArenaChangeConfirm($event)"
    />

    <ChangeCardBackDialog
      ref="changeCardBackDialog"
      :items="cardBackItems"
      :itemInstances="cardBackItemInstances"
      :trait="cardBackTrait"
      @confirm="onCardBackChangeConfirm($event)"
    />

    <ChangeCardsSkinsDialog
      ref="changeCardsSkinsDialog"
      :items="cardsSkinsItems"
      :itemInstances="cardsSkinsItemInstances"
      :traits="cardsSkinsTraits"
      :traitInstances="cardsSkinsTraitInstances"
      @confirm="onCardsSkinsChangeConfirm($event)"
    />

    <UiDialog
      ref="activeSkillHintDialog"
      :title="$t('atlas.equipment.activeSkill.dialogTitle')"
      :text="$t('atlas.equipment.activeSkill.dialogText')"
      :primaryButtonText="$t('atlas.equipment.toSkillTree')"
      :isSecondaryButtonShown="false"
      :isCloseButtonShown="true"
      @primaryButtonClick="$router.replace({ name: routeName.SkillTree })"
    />

    <UiDialog
      ref="passiveSkillHintDialog"
      :title="$t('atlas.equipment.passiveSkill.dialogTitle')"
      :text="$t('atlas.equipment.passiveSkill.dialogText')"
      :primaryButtonText="$t('atlas.equipment.toEssenceActivations')"
      :isSecondaryButtonShown="false"
      :isCloseButtonShown="true"
      @primaryButtonClick="$router.replace({ name: routeName.EssenceMultipliers })"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { ErrorTrackerService, KwokkaService, LoggerService, NotificationService, SoundService } from '@/service';
  import UiLoader from '@/app/ui-kit/UiLoader.vue';
  import UserAvatarSettings from '@/app/components/UserAvatarSettings.vue';
  import { UiDialog, UiDivider } from '@/app/ui-kit';
  import type { ItemEntity, ItemInstanceEntity, TraitEntity, TraitInstanceEntity } from '@kwokka/entities';
  import FadeTransition from '@/app/transitions/FadeTransition.vue';
  import { PassiveSkillItemKey } from '@/game-data';
  import { TraitKey } from '@/game-data/trait-key';
  import { ItemKey } from '@/game-data/item-key';
  import EquipmentSkill from './components/EquipmentSkill.vue';
  import ChangeArenaDialog from './components/ChangeArenaDialog.vue';
  import ChangeCardBackDialog from './components/ChangeCardBackDialog.vue';
  import ChangeCardsSkinsDialog from './components/ChangeCardsSkinsDialog.vue';
  import EquipmentArena from './components/EquipmentArena.vue';
  import EquipmentCardsSkins from './components/EquipmentCardsSkins.vue';
  import EquipmentDeckBackface from './components/EquipmentDeckBackface.vue';
  import { RouteName } from '@/app/route-name';

  enum State {
    Loading = 'loading',
    Loaded = 'loaded',
    Error = 'error',
  }

  @Component({
    components: {
      UiLoader,
      UiDivider,
      EquipmentSkill,
      EquipmentArena,
      EquipmentDeckBackface,
      EquipmentCardsSkins,
      UserAvatarSettings,
      FadeTransition,
      ChangeArenaDialog,
      ChangeCardBackDialog,
      ChangeCardsSkinsDialog,
      UiDialog,
    },
  })
  export default class EquipmentView extends Vue {
    public state: State = State.Loading;
    public states = State;
    public activeSkillItem: ItemEntity = null;
    public essenceMultiplier: number = 1;

    public cardBackItems: ItemEntity[] = [];
    public cardBackItemInstances: ItemInstanceEntity[] = [];
    public cardBackTrait?: TraitInstanceEntity = null;
    public cardBackItem?: ItemEntity = null;

    public cardsSkinsItems: ItemEntity[] = [];
    public cardsSkinsItemInstances: ItemInstanceEntity[] = [];
    public cardsSkinsTraits: TraitEntity[] = [];
    public cardsSkinsTraitInstances: TraitInstanceEntity[] = [];

    public arenaItem?: ItemEntity = null;
    public arenaItems: ItemEntity[] = [];
    public arenaItemInstances: ItemInstanceEntity[] = [];
    public arenaTrait: TraitInstanceEntity = null;

    public readonly routeName = RouteName;

    public readonly passiveSkillKey = PassiveSkillItemKey.EssenceMultiplication1;

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

    @Ref()
    public changeArenaDialog: ChangeArenaDialog;

    @Ref()
    public changeCardBackDialog: ChangeCardBackDialog;

    @Ref()
    public changeCardsSkinsDialog: ChangeCardsSkinsDialog;

    @Ref()
    public activeSkillHintDialog: UiDialog;

    @Ref()
    public passiveSkillHintDialog: UiDialog;

    public get cardsSkins(): { [traitKey in string]: string } {
      const skins = {};
      this.cardsSkinsTraits.forEach((trait) => {
        const traitInstance = this.cardsSkinsTraitInstances.find((el) => el.traitId === trait.id);
        const item = this.cardsSkinsItems.find((el) => el.id === traitInstance?.value);
        skins[trait.key] = item?.key || null;
      });
      return skins;
    }

    public created(): void {
      this.fetchEquipment();
    }

    public async onArenaChangeConfirm(item?: ItemEntity): Promise<void> {
      try {
        this.arenaTrait = await this.kwokkaService.client.trait.updateOwnTraitInstanceByTraitKey(
          TraitKey.EquippedArena,
          item?.id || null,
        );
        this.arenaItem = item;
        this.soundService.playSkillEquip();
      } catch (e) {
        this.notificationService.showErrors([e]);
        this.logger.error('Error in EquipmentView:', e);
        this.errorTrackerService.captureError(e);
      }
    }

    public async onCardBackChangeConfirm(item?: ItemEntity): Promise<void> {
      try {
        this.cardBackTrait = await this.kwokkaService.client.trait.updateOwnTraitInstanceByTraitKey(
          TraitKey.EquippedCardBack,
          item?.id || null,
        );
        this.cardBackItem = item;
        this.soundService.playSkillEquip();
      } catch (e) {
        this.notificationService.showErrors([e]);
        this.logger.error('Error in EquipmentView:', e);
        this.errorTrackerService.captureError(e);
      }
    }

    public async onCardsSkinsChangeConfirm(updates?: { [traitKey: string]: string }): Promise<void> {
      try {
        const promises = Object.keys(updates).map((key) =>
          this.kwokkaService.client.trait.updateOwnTraitInstanceByTraitKey(key, updates[key] || null),
        );
        const traitInstances = await Promise.all(promises);
        const updatedTraitIds = traitInstances.map((el) => el.traitId);
        this.cardsSkinsTraitInstances = [
          ...this.cardsSkinsTraitInstances.filter((el) => !updatedTraitIds.includes(el.traitId)),
          ...traitInstances,
        ];
        this.soundService.playSkillEquip();
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        this.logger.error('Error in EquipmentView:', e);
        this.errorTrackerService.captureError(e);
      }
    }

    public async onArenaClick(): Promise<void> {
      this.changeArenaDialog.show();
      this.fetchArenaItems();
      this.fetchOwnArenaItemInstances();
    }

    public onCardsSkinsClick(): void {
      this.changeCardsSkinsDialog.show();
      this.fetchCardsSkinsItems();
      this.fetchCardsSkinsItemInstances();
    }

    public onCardBackClick(): void {
      this.changeCardBackDialog.show();
      this.fetchCardBackItems();
      this.fetchOwnCardBackItemInstances();
    }

    public onActiveSkillClick(): void {
      this.activeSkillHintDialog.show();
    }

    public onPassiveSkillClick(): void {
      this.passiveSkillHintDialog.show();
    }

    private async fetchEquipment(): Promise<void> {
      this.state = State.Loading;
      try {
        await Promise.all([
          this.fetchActiveSkill(),
          this.fetchPassiveSkill(),
          this.fetchArena(),
          this.fetchDeckBackface(),
          this.fetchCardsSkins(),
        ]);
        this.state = State.Loaded;
      } catch (e: any) {
        this.notificationService.showErrors([e]);
        this.logger.error('Error in EquipmentView:', e);
        this.errorTrackerService.captureError(e);
        this.state = State.Error;
      }
    }

    private async fetchActiveSkill(): Promise<void> {
      const trait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.EquippedSkill);
      if (trait?.value) {
        this.activeSkillItem = await this.kwokkaService.client.inventory.getItemById(trait.value);
      }
    }

    private async fetchPassiveSkill(): Promise<void> {
      const keys = Object.values(PassiveSkillItemKey);
      const promises = keys.map((key) => this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(key));
      let itemInstances = await Promise.all(promises);
      itemInstances = itemInstances.filter((el) => el?.quantity);
      this.essenceMultiplier = itemInstances.length + 1;
    }

    private async fetchArena(): Promise<void> {
      this.arenaTrait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(TraitKey.EquippedArena);
      if (this.arenaTrait?.value) {
        this.arenaItem = await this.kwokkaService.client.inventory.getItemById(this.arenaTrait.value);
      }
    }

    private async fetchOwnArenaItemInstances(): Promise<void> {
      if (!this.arenaItemInstances?.length) {
        this.arenaItemInstances = await Promise.all([
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.ArenaFlowerField),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.ArenaLoneMountain),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.ArenaLab),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.ArenaLibrary),
        ]);
      }
    }

    private async fetchArenaItems(): Promise<void> {
      if (!this.arenaItems?.length) {
        this.arenaItems = await Promise.all([
          this.kwokkaService.client.inventory.getItemByKey(ItemKey.ArenaFlowerField),
          this.kwokkaService.client.inventory.getItemByKey(ItemKey.ArenaLoneMountain),
          this.kwokkaService.client.inventory.getItemByKey(ItemKey.ArenaLab),
          this.kwokkaService.client.inventory.getItemByKey(ItemKey.ArenaLibrary),
        ]);
      }
    }

    private async fetchOwnCardBackItemInstances(): Promise<void> {
      if (!this.cardBackItemInstances?.length) {
        this.cardBackItemInstances = await Promise.all([
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.DeckBackfaceArcane),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.DeckBackfaceNature),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.DeckBackfaceFilth),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.DeckBackfaceBloom),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.DeckBackfaceFury),
        ]);
      }
    }

    private async fetchCardBackItems(): Promise<void> {
      if (!this.cardBackItems?.length) {
        this.cardBackItems = await this.kwokkaService.client.inventory.getItemsByKeys([
          ItemKey.DeckBackfaceArcane,
          ItemKey.DeckBackfaceNature,
          ItemKey.DeckBackfaceFilth,
          ItemKey.DeckBackfaceBloom,
          ItemKey.DeckBackfaceFury,
        ]);
      }
    }

    private async fetchCardsSkinsItemInstances(): Promise<void> {
      if (!this.cardsSkinsItemInstances?.length) {
        this.cardsSkinsItemInstances = await Promise.all([
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenSpecial),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenLabradoodle),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenDobermann),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenHusky),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenRetriever),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenCorgi),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenPug),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenDoxie),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenYork),
          this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.CardSkinGoldenSpitz),
        ]);
      }
    }

    private async fetchCardsSkinsItems(): Promise<void> {
      let keys = [
        ItemKey.CardSkinGoldenSpitz,
        ItemKey.CardSkinGoldenYork,
        ItemKey.CardSkinGoldenDoxie,
        ItemKey.CardSkinGoldenPug,
        ItemKey.CardSkinGoldenCorgi,
        ItemKey.CardSkinGoldenRetriever,
        ItemKey.CardSkinGoldenHusky,
        ItemKey.CardSkinGoldenDobermann,
        ItemKey.CardSkinGoldenLabradoodle,
        ItemKey.CardSkinGoldenSpecial,
      ];
      keys = keys.filter((key) => !this.cardsSkinsItems.some((el) => el.key === key));
      if (keys?.length) {
        const items = await this.kwokkaService.client.inventory.getItemsByKeys(keys);
        this.cardsSkinsItems = [...this.cardsSkinsItems, ...items];
      }
    }

    private async fetchDeckBackface(): Promise<void> {
      this.cardBackTrait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(
        TraitKey.EquippedCardBack,
      );
      if (this.cardBackTrait?.value) {
        this.cardBackItem = await this.kwokkaService.client.inventory.getItemById(this.cardBackTrait.value);
      }
    }

    private async fetchCardsSkins(): Promise<void> {
      const traitKeys = [
        TraitKey.EquippedCardSkinSpitz,
        TraitKey.EquippedCardSkinYork,
        TraitKey.EquippedCardSkinDoxie,
        TraitKey.EquippedCardSkinPug,
        TraitKey.EquippedCardSkinCorgi,
        TraitKey.EquippedCardSkinRetriever,
        TraitKey.EquippedCardSkinHusky,
        TraitKey.EquippedCardSkinDobermann,
        TraitKey.EquippedCardSkinLabradoodle,
        TraitKey.EquippedCardSkinSpecial,
      ];
      const traitInstances = [];
      const traits = [];
      const items = [];
      const promises = traitKeys.map(async (key) => {
        const trait = await this.kwokkaService.client.trait.getOwnTraitInstanceByTraitKey(key);
        traitInstances.push(trait);
        if (trait?.value) {
          const item = await this.kwokkaService.client.inventory.getItemById(trait.value);
          items.push(item);
        }
      });
      promises.push(
        ...traitKeys.map(async (key) => {
          const trait = await this.kwokkaService.client.trait.getTraitByKey(key);
          traits.push(trait);
        }),
      );
      await Promise.all(promises);
      this.cardsSkinsTraitInstances = traitInstances;
      this.cardsSkinsTraits = traits;
      this.cardsSkinsItems = items;
    }
  }
</script>

<style scoped lang="scss">
  .equipment-view {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &__container {
      height: 100%;
      width: 100%;
      display: flex;
      background-image: url('/static/ui/bricks.webp');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      @include UiMediaPortrait() {
        flex-direction: column;
      }
    }

    &__primary {
      @include UiPadding(2);
      @include UiGap(2);
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-image: linear-gradient(45deg, UiColor(shade-900), UiColor(secondary-300));
    }

    &__cosmetic {
      @include UiPadding(2);
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      @include UiGap(2);
      overflow: hidden;
    }

    &__avatar {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__skill {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      display: flex;
      align-items: center;
    }

    &__arena {
      width: 100%;
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;

      @include UiMediaPortrait() {
        width: auto;
        height: calc(50% - #{UiSpacing(1)});
      }
    }

    &__cards {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 0;
      display: flex;
      width: 100%;
      height: 100%;
      @include UiGap(2);

      @include UiMediaPortrait() {
        height: calc(50% - #{UiSpacing(1)});
      }
    }

    &__cards-skins {
      flex-grow: 3;
      flex-shrink: 0;
      flex-basis: 0;
    }

    &__card-back {
      flex-grow: 2;
      flex-shrink: 0;
      flex-basis: 0;
    }

    &__divider {
      height: UiSpacing(0.25);
      background-color: UiColor(shade-100);
      width: 50%;
      align-self: center;
      opacity: 0.5;
    }

    &__essence-multiplier {
      @include UiTextShadow(2);
    }
  }
</style>
