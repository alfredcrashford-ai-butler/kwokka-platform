<template>
  <TopLevelLayout>
    <div class="main-view">
      <MainViewItem class="main-view__inventory" to="/inventory" iconName="backpack" :text="$t('inventory.title')" />
      <MainViewItem
        class="main-view__item-management"
        to="/item-management"
        iconName="backpack-setting"
        :text="$t('itemManagement.title')"
        v-if="accessService.hasRight(capybaraRights.ManageItems)"
      />
      <MainViewItem
        class="main-view__collection"
        to="/collection"
        iconName="game-controller"
        :text="$t('collection.title')"
        v-if="accessService.hasRight(zebraRights.ReadGame)"
      />
      <MainViewItem
        class="main-view__game-management"
        to="/games-management"
        iconName="game-setting"
        :text="$t('gamesManagement.title')"
        v-if="accessService.hasRight(zebraRights.ManageGames)"
      />
      <MainViewItem
        class="main-view__access-management"
        to="/access-management"
        iconName="key"
        :text="$t('accessManagement.title')"
        v-if="accessService.hasRight(owlRights.ManageAccess)"
      />
      <MainViewItem
        class="main-view__access-setup"
        to="/access-setup"
        iconName="key-setting"
        :text="$t('accessSetup.title')"
        v-if="accessService.hasRight(owlRights.SetupAccess)"
      />
    </div>
  </TopLevelLayout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { CapybaraAccessRight, OwlAccessRight, ZebraAccessRight } from '@kwokka/rights';
  import TopLevelLayout from '@/app/layouts/TopLevelLayout.vue';
  import MainViewItem from './components/MainViewItem.vue';
  import { LazyInject } from '@/ioc';
  import { AccessService } from '@/service/access/access.service';

  @Component({
    components: {
      TopLevelLayout,
      MainViewItem,
    },
  })
  export default class MainView extends Vue {
    public owlRights = OwlAccessRight;
    public capybaraRights = CapybaraAccessRight;
    public zebraRights = ZebraAccessRight;

    @LazyInject(AccessService)
    public accessService: AccessService;
  }
</script>

<style scoped lang="scss">
  .main-view {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    @include UiGap(4);

    @include UiMediaMobile() {
      grid-template-columns: 1fr;
    }

    &__collection {
      --main-view-item-bg-color1: #4b6cb7;
      --main-view-item-bg-color2: #0abfbc;
      --main-view-item-bg-offset1: 0%;
      --main-view-item-bg-offset2: 100%;
    }

    &__game-management {
      --main-view-item-bg-color1: #01016d;
      --main-view-item-bg-color2: #1f9ee3;
      --main-view-item-bg-offset1: 0%;
      --main-view-item-bg-offset2: 100%;
    }

    &__inventory {
      --main-view-item-bg-color1: #38ef7d;
      --main-view-item-bg-color2: #11998e;
      --main-view-item-bg-offset1: 0%;
      --main-view-item-bg-offset2: 100%;
    }

    &__access-management {
      --main-view-item-bg-color1: #cb356b;
      --main-view-item-bg-color2: #bd3f32;
      --main-view-item-bg-offset1: 0%;
      --main-view-item-bg-offset2: 100%;
    }

    &__access-setup {
      --main-view-item-bg-color1: #d8c714;
      --main-view-item-bg-color2: #b94400;
      --main-view-item-bg-offset1: 0%;
      --main-view-item-bg-offset2: 100%;
    }
    &__item-management {
      --main-view-item-bg-color1: #004f48;
      --main-view-item-bg-color2: #09a043;
      --main-view-item-bg-offset1: 0%;
      --main-view-item-bg-offset2: 100%;
    }
  }
</style>
