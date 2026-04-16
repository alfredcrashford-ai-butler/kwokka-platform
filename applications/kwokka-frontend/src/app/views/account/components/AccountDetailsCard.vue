<template>
  <UiCard v-if="account" class="account-details-card">
    <UiHeading size="2">{{ $t('account.details.title') }}</UiHeading>
    <div>
      <p class="account-details-card__entry"><b>Id:</b> {{ account.id }}</p>
      <p class="account-details-card__entry"><b>Type:</b> {{ account.type }}</p>
      <p class="account-details-card__entry"><b>Is verified:</b> {{ account.isVerified }}</p>
      <p class="account-details-card__entry"><b>Is active:</b> {{ account.isActive }}</p>
    </div>
  </UiCard>
  <UiSkeleton v-else />
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-facing-decorator';
  import type { AccountEntity } from '@kwokka/entities';
  import UiCard from '@/app/ui-kit/UiCard.vue';
  import UiSkeleton from '@/app/ui-kit/UiSkeleton.vue';
  import UiHeading from '@/app/ui-kit/UiHeading.vue';

  @Component({
    components: {
      UiCard,
      UiHeading,
      UiSkeleton,
    },
  })
  export default class AccountDetailsCard extends Vue {
    @Prop()
    public account: AccountEntity = null;
  }
</script>

<style scoped lang="scss">
  .account-details-card {
    @include UiPadding(4);
    display: flex;
    flex-direction: column;
    @include UiGap(4);

    &__entry {
      @include UiMargin(1, bottom, false);

      & > b {
        @include UiFontWeight(bold);
      }
    }
  }
</style>
