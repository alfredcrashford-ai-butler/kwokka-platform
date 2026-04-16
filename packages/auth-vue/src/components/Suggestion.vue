<template>
  <div
    class="kwokka-auth-suggestion kwokka-auth-block"
    :class="{
      'kwokka-auth-suggestion_positive': isValid === true,
      'kwokka-auth-suggestion_negative': isValid === false,
    }"
    v-styles="
      isValid === true
        ? styles?.suggestionPositive
        : isValid === false
        ? styles?.suggestionNegative
        : styles?.suggestion
    "
  >
    <Icon
      class="kwokka-auth-suggestion__icon"
      v-styles="styles?.suggestionIcon"
      :name="isValid === null ? 'dot' : isValid ? 'check' : 'x'"
    />
    <span>{{ $t(translationKey) }}</span>
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import Icon from '@/components/Icon.vue';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';

  @Component({
    components: { Icon },
    directives: { styles: stylesDirective },
  })
  export default class Suggestion extends Vue {
    @Inject()
    public styles: KwokkaAuthStyles;

    @Prop({ required: true })
    public translationKey: string;

    @Prop({ required: true })
    public isValid: boolean;
  }
</script>

<style>
  .kwokka-auth-suggestion {
    display: inline-flex;
    align-items: center;
    --kwk-auth--font-size: 12px;
    --kwk-auth--line-height: 1.25;
  }

  .kwokka-auth-suggestion__icon {
    --kwk-auth--width: 16px;
    --kwk-auth--height: 16px;
    flex-shrink: 0;
  }

  .kwokka-auth-suggestion_positive {
    --kwk-auth--color: #00bfa6;
  }
  .kwokka-auth-suggestion_negative {
    --kwk-auth--color: #e25144;
  }
</style>
