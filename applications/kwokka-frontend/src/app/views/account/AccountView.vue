<template>
  <SecondLevelLayout :title="$t('account.title')" backUrl="/access-management">
    <div class="account-view">
      <AccountDetailsCard class="account-view__account" v-if="account" :account="account" />
      <AccountProfileCard class="account-view__profile" v-if="account" :account="account" />
      <AccountActionsCard
        class="account-view__actions"
        v-if="account"
        :account="account"
        @reset="onReset"
        @delete="onDelete"
      />
      <AccountTraitsCard class="account-view__traits" v-if="account" :account="account" />
      <AccountRolesCard class="account-view__roles" v-if="account" :account="account" />
      <AccountCredentialsCard class="account-view__credentials" v-if="account" :account="account" />
      <AccountTokensCard class="account-view__tokens" v-if="account" :account="account" />
    </div>
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import { LazyInject } from '@/ioc';
  import { AccountApi } from '@/api/auth/account/account.api';
  import { LoggerService } from '@/service/logger/logger.service';
  import type { AccountEntity } from '@kwokka/entities';
  import AccountDetailsCard from './components/AccountDetailsCard.vue';
  import AccountActionsCard from './components/AccountActionsCard.vue';
  import AccountCredentialsCard from './components/AccountCredentialsCard.vue';
  import AccountTokensCard from './components/AccountTokensCard.vue';
  import AccountRolesCard from './components/AccountRolesCard.vue';
  import AccountProfileCard from './components/AccountProfileCard.vue';
  import AccountTraitsCard from './components/AccountTraitsCard.vue';

  @Component({
    components: {
      SecondLevelLayout,
      AccountDetailsCard,
      AccountActionsCard,
      AccountCredentialsCard,
      AccountTokensCard,
      AccountTraitsCard,
      AccountRolesCard,
      AccountProfileCard,
    },
  })
  export default class AccountView extends Vue {
    @LazyInject(AccountApi)
    public accountApi: AccountApi;

    @LazyInject(LoggerService)
    public logger: LoggerService;

    public account: AccountEntity = null;

    public async mounted(): Promise<void> {
      if (!this.$route.params.id) {
        this.redirectToMainWithErrorMessage();
      }

      try {
        this.account = await this.accountApi.getById(this.$route.params.id as string);
      } catch (error: any) {
        this.redirectToMainWithErrorMessage(error);
      }
    }

    public onReset(): void {
      window.location.reload();
    }

    public onDelete(): void {
      this.$router.replace('/access-management');
    }

    private redirectToMainWithErrorMessage(error?: any): void {
      this.logger.error(error);
      this.$router.replace({ name: 'main' });
    }
  }
</script>

<style scoped lang="scss">
  .account-view {
    display: grid;
    grid-template-areas:
      'a a b b b'
      'c c c d d'
      'e e e e e'
      'f f f f f'
      'g g g g g';
    grid-template-rows: auto;
    grid-template-columns: repeat(5, 1fr);
    @include UiGap(3);

    @include UiMediaMobile() {
      grid-template-areas:
        'a a a a a'
        'b b b b b'
        'c c c d d'
        'e e e e e'
        'f f f f f'
        'g g g g g';
    }

    &__account {
      grid-area: a;
    }

    &__traits {
      grid-area: e;
    }

    &__profile {
      grid-area: b;
    }

    &__roles {
      grid-area: c;
    }

    &__actions {
      grid-area: d;
    }

    &__credentials {
      grid-area: f;
    }

    &__tokens {
      grid-area: g;
    }
  }
</style>
