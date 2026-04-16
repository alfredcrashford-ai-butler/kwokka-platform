<template>
  <span class="kwokka-auth-icon kwokka-auth-block" v-styles="styles?.icon">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :aria-label="name">
      <use :xlink:href="iconId"></use>
    </svg>
  </span>
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';

  @Component({
    directives: { styles: stylesDirective },
  })
  export default class Icon extends Vue {
    @Prop()
    public name: string;

    @Inject()
    public styles: KwokkaAuthStyles;

    public get iconId() {
      return `#icon-${this.name}`;
    }
  }
</script>

<style>
  .kwokka-auth-icon {
    --kwk-auth--width: 20px;
    --kwk-auth--height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .kwokka-auth-icon > svg {
    width: 100%;
    height: 100%;
  }
</style>
