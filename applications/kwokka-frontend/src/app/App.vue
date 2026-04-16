<template>
  <div class="app" :class="{ 'app_theme-main': theme === themes.MAIN }">
    <UiIconsDefinition />
    <NotificationsPresenter />
    <OnboardingPresenter />

    <div class="app__wrapper">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-facing-decorator';
  import { LazyInject } from '@/ioc';
  import { ErrorTrackerService } from '@/service/error-tracker/error-tracker.service';
  import { PersistenceService } from '@/service/persistence/persistence.service';
  import { ThemeEntity, Theme } from '@/entity/theme.entity';
  import UiIconsDefinition from '@/app/ui-kit/UiIconsDefinition.vue';
  import NotificationsPresenter from '@/app/components/NotificationsPresenter.vue';
  import OnboardingPresenter from '@/app/components/OnboardingPresenter.vue';

  @Component({
    components: {
      UiIconsDefinition,
      NotificationsPresenter,
      OnboardingPresenter,
    },
  })
  export default class App extends Vue {
    public theme = ThemeEntity.MAIN;

    public themes = Theme;

    @LazyInject(ErrorTrackerService)
    public errorTrackerService: ErrorTrackerService;

    @LazyInject(PersistenceService)
    public persistenceService: PersistenceService;

    public created() {
      this.errorTrackerService.setupErrorTracking();
    }
  }
</script>

<style scoped lang="scss">
  .app {
    &__loader {
      @include UiPadding(10, top);
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    &__wrapper {
      height: 100%;
      overflow: auto;
    }
  }
</style>
