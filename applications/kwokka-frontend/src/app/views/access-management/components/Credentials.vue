<template>
  <div class="credentials">
    <UiHeading size="2">{{ $t('accessManagement.credentials.title') }}</UiHeading>
    <CredentialsList />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import CredentialsList from '@/app/components/credentials/CredentialsList.vue';

  @Component({
    components: {
      UiHeading,
      CredentialsList,
    },
  })
  export default class Credentials extends Vue {}
</script>

<style scoped lang="scss">
  .credentials {
    @include UiGap(4);
    display: flex;
    flex-direction: column;
  }
</style>
