<template>
  <UiCard v-if="account" class="account-credentials-card">
    <UiHeading class="account-details-card__heading" size="2">
      {{ $t('account.credentials.title') }}
    </UiHeading>
    <CredentialsList :accountId="account.id" />
  </UiCard>
  <UiSkeleton v-else />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { AccountEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';
  import CredentialsList from '@/app/components/credentials/CredentialsList.vue';

  @Component({
    components: {
      UiCard,
      UiHeading,
      UiSkeleton,
      CredentialsList,
    },
  })
  export default class AccountCredentialsCard extends Vue {
    @Prop()
    public account: AccountEntity = null;
  }
</script>

<style scoped lang="scss">
  .account-credentials-card {
    @include UiPadding(4);
    display: flex;
    flex-direction: column;
    @include UiGap(4);
  }
</style>
