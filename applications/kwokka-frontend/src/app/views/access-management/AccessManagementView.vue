<template>
  <SecondLevelLayout :title="$t('accessManagement.title')" backUrl="/main">
    <DetailContainer v-if="items" :items="items" />
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Vue } from 'vue-facing-decorator';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import type { DetailContainerItem } from '@/app/components/DetailContainer.vue';
  import DetailContainer from '@/app/components/DetailContainer.vue';
  import Accounts from './components/Accounts.vue';
  import Credentials from './components/Credentials.vue';

  @Component({
    components: {
      SecondLevelLayout,
      DetailContainer,
    },
  })
  export default class AccessManagementView extends Vue {
    public items: DetailContainerItem[] = null;

    public mounted(): void {
      this.items = markRaw([
        {
          id: 'accounts',
          labelTranslationKey: 'accessManagement.accounts.title',
          component: Accounts,
        },
        {
          id: 'credentials',
          labelTranslationKey: 'accessManagement.credentials.title',
          component: Credentials,
        },
      ]);
    }
  }
</script>
