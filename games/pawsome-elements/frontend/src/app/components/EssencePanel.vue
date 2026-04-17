<template>
  <div class="essence-panel" v-ui-sound @click="$emit('click', $event)">
    <OptionPanel size="md" class="essence-panel__container">
      <UiLoader v-if="isLoading" />
      <span class="essence-panel__num" v-else>{{ essence }}</span>
      <div class="essence-panel__essence-container">
        <Essence class="essence-panel__essence" :isGlowing="isGlowing" />
      </div>
    </OptionPanel>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { KwokkaService } from '@/service/kwokka/kwokka.service';
  import Essence from '@/app/components/Essence.vue';
  import OptionPanel from '@/app/components/OptionPanel.vue';
  import { ItemKey } from '@/game-data/item-key';
  import { UiLoader } from '@/app/ui-kit';

  @Component({
    components: {
      OptionPanel,
      Essence,
      UiLoader,
    },
    emits: ['click'],
  })
  export default class EssencePanel extends Vue {
    @LazyInject(KwokkaService)
    private kwokkaService: KwokkaService;

    @Prop({ default: true })
    public isGlowing: boolean;

    public essence: number = 0;
    public isLoading: boolean = true;

    public created(): void {
      this.fetchEssence();
    }

    public async fetchEssence(): Promise<void> {
      this.isLoading = true;
      const itemInstance = await this.kwokkaService.client.inventory.getOwnItemInstanceByItemKey(ItemKey.Essence);

      this.isLoading = false;
      this.essence = itemInstance?.quantity || 0;
    }
  }
</script>

<style scoped lang="scss">
  .essence-panel {
    padding-right: UiSpacing(6);
    @include UiButtonAppearance();

    &__container {
      height: UiSpacing(12);
      width: UiSpacing(33);
      padding-right: UiSpacing(9);
      position: relative;
    }

    &__essence-container {
      position: absolute;
      background-image: url('/static/elements/circle_panel.webp');
      background-size: 70%;
      background-position: center;
      background-repeat: no-repeat;
      aspect-ratio: 1;
      right: calc(-1 * UiSpacing(6));
    }

    &__essence {
      width: UiSpacing(18);
    }

    &__num {
      @include UiTypographyHeading3();
      flex-grow: 1;
      text-align: center;
      @include UiTextShadow(1);
    }
  }
</style>
