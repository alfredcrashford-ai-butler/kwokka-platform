<template>
  <div class="ui-pagination">
    <UiButton type="secondary" size="sm" width="shrink" :disabled="isPrevDisabled" @click="$emit('prev')">
      <UiIcon name="arrow-left" size="sm" />
    </UiButton>
    <b>{{ page + 1 }}</b>
    <UiButton type="secondary" size="sm" width="shrink" :disabled="isNextDisabled" @click="$emit('next')">
      <UiIcon name="arrow-right" size="sm" />
    </UiButton>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import UiButton from '@/app/ui-kit/UiButton.vue';
  import UiIcon from './UiIcon.vue';

  @Component({
    components: {
      UiButton,
      UiIcon,
    },
    emits: ['next', 'prev'],
  })
  export default class UiPagination extends Vue {
    @Prop({ default: false })
    public isNextDisabled: boolean;

    @Prop({ default: true })
    public isPrevDisabled: boolean;

    @Prop({ default: 0 })
    public page: number;
  }
</script>

<style scoped lang="scss">
  .ui-pagination {
    @include UiGap(2, false);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
