<template>
  <div class="kwokka-avatar-loader" v-styles="styles?.loader"></div>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-facing-decorator';
  import { stylesDirective } from '@/styles/styles-directive';
  import type { KwokkaAvatarStyles } from '@/styles/kwokka-avatar-styles';

  @Component({
    directives: { styles: stylesDirective },
  })
  export default class Loader extends Vue {
    @Inject()
    public styles: KwokkaAvatarStyles;
  }
</script>

<style>
  .kwokka-avatar-loader {
    width: 48px;
    height: 48px;
    border: 5px solid currentColor;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: kwokka-avatar-loader-animation 1s linear infinite;
  }

  @keyframes kwokka-avatar-loader-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
