<template>
  <div class="item-action" :class="[`item-action_trigger-${action.trigger}`]">
    <h5 class="item-action__heading">{{ $t(`items.${item.key}.actions.${action.key}.title`) }}</h5>
    <div class="item-action__sub-heading">
      {{ $t(`inventory.actions.${action.trigger}.title`) }}
      <UiTooltip :content="$t(`inventory.actions.${action.trigger}.tip`)">
        <UiIcon size="xs" name="info" />
      </UiTooltip>
    </div>
    <template v-if="$te(`items.${item.key}.actions.${action.key}.description`)">
      <hr class="item-action__divider" />
      <p class="item-action__description" v-html="$t(`items.${item.key}.actions.${action.key}.description`)"></p>
    </template>
    <UiButton
      v-if="isRunnable"
      size="xs"
      type="secondary"
      @click="$emit('run', { itemInstance, actionKey: action.key })"
    >
      <UiIcon name="arrow-right" size="xs" />
      {{ $t(`items.${item.key}.actions.${action.key}.action`) }}
    </UiButton>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import { ItemEntity, ItemInstanceEntity, type ItemEntityAction } from '@kwokka/entities';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiTooltip from '@/app/ui-kit/UiTooltip.vue';

  @Component({
    components: {
      UiIcon,
      UiHeading,
      UiButton,
      UiTooltip,
    },
    emits: ['run'],
  })
  export default class ItemAction extends Vue {
    @Prop({ required: true })
    public action: ItemEntityAction;

    @Prop({ required: true })
    public item: ItemEntity;

    @Prop({ required: true })
    public itemInstance: ItemInstanceEntity;

    public get isRunnable(): boolean {
      return ItemEntity.runnableTriggers.includes(this.action.trigger);
    }
  }
</script>

<style scoped lang="scss">
  .item-action {
    @include UiPadding(2);
    border: 1px solid;
    @include UiBorderRadius(md);
    width: 100%;

    &_trigger-have {
      @include UiTheme() {
        background-color: UiColor(item-trigger-have-1);
        color: UiColor(item-trigger-have-2);
      }
    }

    &_trigger-use {
      @include UiTheme() {
        background-color: UiColor(item-trigger-use-1);
        color: UiColor(item-trigger-use-2);
      }
    }

    &__heading {
      @include UiTypographyParagraph2();
    }

    &__sub-heading {
      @include UiTypographyParagraph4();
      display: flex;
      align-items: center;
      @include UiGap(1, false);
    }

    &__description {
      @include UiTypographyParagraph3();
    }

    &__divider {
      border-bottom: 1px solid currentColor;
      @include UiMargin(1, bottom, false);
      @include UiMargin(1, top, false);
    }
  }
</style>
