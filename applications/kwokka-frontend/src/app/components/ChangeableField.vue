<template>
  <div class="changeable-field" color="cyan">
    <div class="changeable-field__container">
      <span class="changeable-field__text">
        <b class="changeable-field__label">{{ label }} </b>
        <span class="changeable-field__value">{{ value }}</span>
      </span>

      <UiButton
        type="secondary"
        shade="accent"
        width="shrink"
        :title="$t('settings.changeButton')"
        :aria-label="$t('settings.changeButton')"
        @click="onChangeClick"
      >
        <UiIcon name="edit"/>
      </UiButton>

      <slot></slot>
    </div>
    <div class="changeable-field__bonus" v-if="$slots.bonus">
      <slot name="bonus"></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Prop, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from '@/app/ui-kit/UiIcon.vue';

  @Component({
    components: {
      UiButton,
      UiIcon,
    },
  })
  export default class ChangeableField extends Vue {

    @Prop({ required: true })
    public label: string;

    @Prop({ required: true })
    public value: string;

    @Emit('changeClick')
    public onChangeClick(): boolean {
      return true;
    }

  }
</script>

<style scoped lang="scss">
  .changeable-field {
    @include UiGap(4);
    text-align: start;

    &__container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__value {
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
    }

    &__text {
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
      @include UiMediaMobile() {
        display: flex;
        flex-direction: column;
      }
    }

    &__label {
      @include UiFontWeight(bold);
    }
  }
</style>
