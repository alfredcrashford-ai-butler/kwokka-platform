<template>
  <SecondLevelLayout backUrl="/main" :title="$t('settings.title')">
    <DetailContainer v-if="items" :items="items" ref="detailContainer" />
  </SecondLevelLayout>
</template>

<script lang="ts">
  import { markRaw } from 'vue';
  import { Component, Ref, Vue } from 'vue-facing-decorator';
  import SecondLevelLayout from '@/app/layouts/SecondLevelLayout.vue';
  import CredentialsSettings from './components/CredentialsSettings.vue';
  import DetailContainer, { type DetailContainerItem } from '@/app/components/DetailContainer.vue';
  import ProfileSettings from './components/ProfileSettings.vue';
  import AppSettings from './components/AppSettings.vue';
  import { RouteUtil } from '@/utils/route-util';

  enum TabId {
    Profile = 'profile',
    App = 'app',
    Credentials = 'credentials',
  }

  @Component({
    components: {
      SecondLevelLayout,
      DetailContainer,
    },
  })
  export default class SettingsView extends Vue {
    @Ref()
    public detailContainer: DetailContainer;

    public items: DetailContainerItem[] = null;

    public created(): void {
      this.items = markRaw([
        {
          id: 'profile',
          icon: 'user-circle',
          labelTranslationKey: 'settings.profile.title',
          component: ProfileSettings,
        },
        {
          id: 'app',
          icon: 'squares-four',
          labelTranslationKey: 'settings.app.title',
          component: AppSettings,
        },
        {
          id: 'credentials',
          icon: 'key',
          labelTranslationKey: 'settings.credentials.title',
          component: CredentialsSettings,
        },
      ]);
    }

    public mounted(): void {
      let tab: any = RouteUtil.getQueryParam(this.$route.query.tab);
      if (!Object.values(TabId).includes(tab)) {
        tab = TabId.Profile;
      }
      this.detailContainer.selectItem(tab);
    }
  }
</script>
