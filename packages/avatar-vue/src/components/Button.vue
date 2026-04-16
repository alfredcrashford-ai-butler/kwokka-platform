<template>
  <button
    class="kwokka-avatar-button kwokka-avatar-block"
    @click="$emit('click', $event)"
    v-styles="styles?.button"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import type { KwokkaAvatarStyles } from '@/styles/kwokka-avatar-styles';
  import { stylesDirective } from '@/styles/styles-directive';

  @Component({
    emits: ['click'],
    directives: { styles: stylesDirective },
  })
  export default class Button extends Vue {
    @Inject()
    public styles: KwokkaAvatarStyles;
  }
</script>

<style>
  .kwokka-avatar-button {
    --kwk-avatar--padding: 0 24px;
    --kwk-avatar--border-radius: 12px;
    --kwk-avatar--background-color: #30194D;
    --kwk-avatar--color: #FFF;
    --kwk-avatar--border: 2px solid #FFF;
    --kwk-avatar--gap: 8px;
    --kwk-avatar--height: 40px;
    --kwk-avatar--width: fit-content;
    --kwk-avatar--font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .kwokka-avatar-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
</style>
