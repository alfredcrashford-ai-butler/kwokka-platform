<template>
  <SecondLevelLayout :title="$t('accessSetup.title')" backUrl="/main">
    <DetailContainer v-if="items" :items="items" />
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Vue } from 'vue-facing-decorator';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import DetailContainer, { type DetailContainerItem } from '@/app/components/DetailContainer.vue';
  import AccessRightsSetup from './components/access-rights-setup/AccessRightsSetup.vue';
  import AccessRolesSetup from './components/access-roles-setup/AccessRolesSetup.vue';
  import AccountTypeRolesSetup from './components/account-type-roles-setup/AccountTypeRolesSetup.vue';

  @Component({
    components: {
      SecondLevelLayout,
      DetailContainer,
    },
  })
  export default class AccessSetupView extends Vue {
    public items: DetailContainerItem[] = null;

    public mounted(): void {
      this.items = markRaw([
        {
          id: 'accessRights',
          labelTranslationKey: 'accessSetup.accessRights.title',
          component: AccessRightsSetup,
        },
        {
          id: 'accessRoles',
          labelTranslationKey: 'accessSetup.accessRoles.title',
          component: AccessRolesSetup,
        },
        {
          id: 'accountTypeRoles',
          labelTranslationKey: 'accessSetup.accountTypeRoles.title',
          component: AccountTypeRolesSetup,
        },
      ]);
    }
  }
</script>
