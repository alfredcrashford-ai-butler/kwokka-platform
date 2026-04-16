<template>
  <button
    class="kwokka-auth-button kwokka-auth-block"
    @click="$emit('click', $event)"
    v-styles="styles?.button"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';

  @Component({
    emits: ['click'],
    directives: { styles: stylesDirective },
  })
  export default class Button extends Vue {
    @Inject()
    public styles: KwokkaAuthStyles;
  }
</script>

<style>
  .kwokka-auth-button {
    --kwk-auth--padding: 0 24px;
    --kwk-auth--border-radius: 12px;
    --kwk-auth--background-color: #30194D;
    --kwk-auth--color: #FFF;
    --kwk-auth--border: 2px solid #FFF;
    --kwk-auth--gap: 8px;
    --kwk-auth--height: 40px;
    --kwk-auth--width: fit-content;
    --kwk-auth--font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .kwokka-auth-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
</style>
