<template>
  <div class="kwokka-auth-success kwokka-auth-block" v-styles="styles?.success">
    <h1
      v-if="$te('auth.successHeading')"
      class="kwokka-auth-success__heading kwokka-auth-block"
      v-styles="styles?.successHeading"
    >
      {{ $t('auth.successHeading') }}
    </h1>
    <p
      v-if="$te('auth.successCaption') && isCaptionShown"
      class="kwokka-auth-success__caption kwokka-auth-block"
      v-styles="styles?.successCaption"
    >
      {{ $t('auth.successCaption') }}
    </p>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Provide, Vue } from 'vue-facing-decorator';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';

  @Component({
    directives: { styles: stylesDirective },
  })
  export default class Success extends Vue {
    @Provide()
    public styles: KwokkaAuthStyles;

    @Prop({ default: true })
    public isCaptionShown: boolean;
  }
</script>

<style>
  .kwokka-auth-success {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    --kwk-auth--gap: 20px;
  }

  .kwokka-auth-success__heading {
    --kwk-auth--font-size: 52px;
    --kwk-auth--line-height: 1;
    --kwk-auth--font-weight: 700;
  }

  .kwokka-auth-success__caption {
    --kwk-auth--color: rgba(255, 255, 255, 0.6);
  }
</style>
