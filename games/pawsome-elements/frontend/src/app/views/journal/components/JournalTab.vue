<template>
  <button
    v-ui-sound
    class="journal-tab"
    :class="{
      'journal-tab_color-yellow': color === 'yellow',
      'journal-tab_color-red': color === 'red',
      'journal-tab_color-blue': color === 'blue',
      'journal-tab_color-green': color === 'green',
      'journal-tab_color-purple': color === 'purple',
      'journal-tab_color-pink': color === 'pink',
      'journal-tab_is-active': isActive,
    }"
    @click="$emit('click', $event)"
  >
    <UiIcon :name="icon" />
  </button>
</template>

<script lang="ts">
  import { UiIcon } from '@/app/ui-kit';
  import { Component, Prop, Vue } from 'vue-facing-decorator';

  @Component({
    components: {
      UiIcon,
    },
    emits: ['click'],
  })
  export default class JournalTab extends Vue {
    @Prop({ required: true })
    public color: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'pink';

    @Prop({ default: false })
    public isActive: boolean;

    @Prop({ required: true })
    public icon: string;
  }
</script>

<style scoped lang="scss">
  .journal-tab {
    @include UiButtonAppearance();
    aspect-ratio: 103/85;
    display: flex;
    align-items: center;
    justify-content: center;
    height: UiSpacing(8);
    @include UiPadding(2, right);
    background-image: var(--pwsm-journal-tab-bg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: UiColor(shade-100);

    &_is-active {
      aspect-ratio: 160/85;
      background-image: var(--pwsm-journal-tab-active-bg);
    }

    &_color-yellow {
      --pwsm-journal-tab-bg: url('/static/journal/book_tab_yellow.webp');
      --pwsm-journal-tab-active-bg: url('/static/journal/book_tab_active_yellow.webp');
    }

    &_color-blue {
      --pwsm-journal-tab-bg: url('/static/journal/book_tab_blue.webp');
      --pwsm-journal-tab-active-bg: url('/static/journal/book_tab_active_blue.webp');
    }

    &_color-red {
      --pwsm-journal-tab-bg: url('/static/journal/book_tab_red.webp');
      --pwsm-journal-tab-active-bg: url('/static/journal/book_tab_active_red.webp');
    }

    &_color-green {
      --pwsm-journal-tab-bg: url('/static/journal/book_tab_green.webp');
      --pwsm-journal-tab-active-bg: url('/static/journal/book_tab_active_green.webp');
    }

    &_color-purple {
      --pwsm-journal-tab-bg: url('/static/journal/book_tab_purple.webp');
      --pwsm-journal-tab-active-bg: url('/static/journal/book_tab_active_purple.webp');
    }

    &_color-pink {
      --pwsm-journal-tab-bg: url('/static/journal/book_tab_pink.webp');
      --pwsm-journal-tab-active-bg: url('/static/journal/book_tab_active_pink.webp');
    }
  }
</style>
