<template>
  <div class="sign-up-banner">
    <UiButton type="blue" width="block" size="lg" @click="addCredentialDialog.show()">
      <UiIcon name="cloud-arrow-up" />
      {{ $t('main.signUp.button') }}
    </UiButton>
    <RedDot />
    <AddCredentialDialog
      ref="addCredentialDialog"
      @error="$emit('error', $event)"
      @created="$emit('created', $event)"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import { UiButton, UiIcon } from '@/app/ui-kit';
  import { RedDot } from '@/app/components';
  import AddCredentialDialog from './AddCredentialDialog.vue';

  @Component({
    components: {
      UiButton,
      UiIcon,
      RedDot,
      AddCredentialDialog,
    },
    emits: ['error', 'created'],
  })
  export default class SignUpBanner extends Vue {
    @Ref()
    public addCredentialDialog: AddCredentialDialog;

    public showCallback(): void {
      this.addCredentialDialog.showCallback();
    }
  }
</script>

<style scoped lang="scss">
  .sign-up-banner {
    position: relative;
  }
</style>
