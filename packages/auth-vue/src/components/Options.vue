<template>
  <div class="kwokka-auth-options kwokka-auth-block" v-styles="styles?.optionsList">
    <Button
      v-if="googleItem"
      class="kwokka-auth-options__item kwokka-auth-options__item_google"
      @click="$emit('select', options.Google)"
      v-styles="styles?.googleButton"
    >
      <Icon name="google" /> {{ googleItem.text }}
    </Button>

    <Button
      v-if="discordItem"
      class="kwokka-auth-options__item kwokka-auth-options__item_discord"
      @click="$emit('select', options.Discord)"
      v-styles="styles?.discordButton"
    >
      <Icon name="discord" /> {{ discordItem.text }}
    </Button>

    <Button
      v-if="emailPasswordItem"
      class="kwokka-auth-options__item"
      @click="$emit('select', options.EmailPassword)"
      v-styles="styles?.emailButton"
    >
      <Icon name="letter" /> {{ emailPasswordItem.text }}
    </Button>

    <template v-if="anonymousItem">
      <div class="kwokka-auth-options__delimiter kwokka-auth-block" v-styles="styles?.delimiter">
        <span>{{ $t('auth.or') }}</span>
      </div>

      <Button
        class="kwokka-auth-options__item"
        @click="$emit('select', options.Anonymous)"
        v-styles="styles?.anonButton"
      >
        <Icon name="incognito" /> {{ anonymousItem.text }}
      </Button>
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Prop, Vue } from 'vue-facing-decorator';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';
  import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
  import { stylesDirective } from '@/styles/styles-directive';
  import { CredentialEntityType } from '@kwokka/entities';

  @Component({
    components: { Button, Icon },
    emits: ['select'],
    directives: { styles: stylesDirective },
  })
  export default class Options extends Vue {
    @Prop({ default: Object.values(CredentialEntityType) })
    public items: { type: CredentialEntityType; text: string }[];

    @Inject()
    public styles: KwokkaAuthStyles;

    public options = CredentialEntityType;

    public get emailPasswordItem(): { type: CredentialEntityType; text: string } {
      return this.items.find((el) => el.type === CredentialEntityType.EmailPassword);
    }

    public get anonymousItem(): { type: CredentialEntityType; text: string } {
      return this.items.find((el) => el.type === CredentialEntityType.Anonymous);
    }

    public get googleItem(): { type: CredentialEntityType; text: string } {
      return this.items.find((el) => el.type === CredentialEntityType.Google);
    }

    public get discordItem(): { type: CredentialEntityType; text: string } {
      return this.items.find((el) => el.type === CredentialEntityType.Discord);
    }
  }
</script>

<style>
  .kwokka-auth-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    --kwk-auth--gap: 8px;
    --kwk-auth--width: 100%;
  }

  .kwokka-auth-options__delimiter {
    display: flex;
    align-items: center;
    justify-content: center;
    --kwk-auth--margin: 4px;
    --kwk-auth--color: #dfd3e6;
    --kwk-auth--font-size: 14px;
  }

  .kwokka-auth-options__item {
    --kwk-auth--width: 100%;
  }

  .kwokka-auth-options__item_google {
    --kwk-auth--background-color: #fff;
    --kwk-auth--color: #1f1f1f;
    --kwk-auth--border: 2px solid #d6d6d6;
  }

  .kwokka-auth-options__item_discord {
    --kwk-auth--background-color: #5865F2;
    --kwk-auth--color: #fff;
    --kwk-auth--border: 2px solid #737ef9;
  }
</style>
