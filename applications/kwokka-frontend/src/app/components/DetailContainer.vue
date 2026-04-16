<template>
  <div class="detail-container">
    <div class="detail-container__nav">
      <UiButton
        class="detail-container__nav-item"
        v-for="item in items"
        :key="item.id"
        :type="item.id === value ? 'primary' : 'subdued'"
        @click="selectItem(item.id)"
      >
        <UiIcon v-if="item.icon" :name="item.icon" />
        <span>{{ $t(item.labelTranslationKey) }}</span>
      </UiButton>
    </div>
    <div class="detail-container__main">
      <component :is="selectedItem.component" v-if="value" v-bind="props" v-on="emits" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  export interface DetailContainerItem {
    id: string;
    icon?: string;
    labelTranslationKey: string;
    component: typeof Vue;
  }

  @Component({
    components: {
      UiButton,
      UiIcon,
    },
    emits: ['input'],
  })
  export default class DetailContainer extends Vue {
    @Prop({ required: true })
    public items: DetailContainerItem[];

    @Prop({ default: {} })
    public props: Record<string, any>;

    @Prop({ default: {} })
    public emits: Record<string, (args: any) => any>;

    public value: string = null;

    public get selectedItem(): DetailContainerItem {
      return this.items.find((el) => el.id === this.value);
    }

    public mounted(): void {
      if (!this.value) {
        this.selectItem(this.items[0]?.id);
      }
    }

    public selectItem(itemId: string): void {
      this.value = itemId;
      this.$emit('input', this.value);
    }
  }
</script>

<style scoped lang="scss">
  .detail-container {
    display: flex;
    height: 100%;
    width: 100%;
    @include UiGap(1);
    @include UiMediaMobile() {
      flex-direction: column;
    }

    &__nav {
      display: flex;
      @include UiGap(1);
      flex-shrink: 0;
      flex-direction: column;

      @include UiMediaMobile() {
        width: 100%;
      }
    }

    &__nav-item {
      justify-content: flex-start;
      width: 100%;
    }

    &__main {
      position: relative;
      flex-grow: 1;
      width: 0;
      @include UiPadding(4);
      @include UiBorderRadius(md);
      @include UiTheme() {
        background-color: UiColor(shade-700);
        border: 2px solid;
      }
      @include UiMediaMobile() {
        width: 100%;
      }
    }

    &__close-button {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  }
</style>
