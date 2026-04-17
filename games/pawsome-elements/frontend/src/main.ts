import { createApp } from 'vue';

import '@/polyfills';

import App from '@/app/App.vue';
import { container } from '@/ioc';
import { TrackerService } from '@/service/tracker/tracker.service';
import { TranslationService } from '@/service/translation/translation.service';
import { ApplicationRouter } from '@/app/router';
import { uiSoundDirective } from '@/app/directives';
import {
  MenuMusicGuard,
  AuthenticatedGuard,
  TrackingGuard,
  ProfileGuard,
  LoadingGuard,
  TargetUrlInjectorGuard,
  ActiveGameGuard,
} from './guard';

// include global styles
import '@kwokka/auth-vue/style.css';
import '@kwokka/avatar-vue/style.css';
import '@kwokka/cookie-consent/style.css';
import '@/styles/main.scss';

(function initApp() {
  const translationService = container.get(TranslationService);
  const authenticatedRouteGuard = container.get(AuthenticatedGuard);
  const trackingGuard = container.get(TrackingGuard);
  const profileGuard = container.get(ProfileGuard);
  const trackerService = container.get(TrackerService);
  const menuMusicGuard = container.get(MenuMusicGuard);
  const loadingGuard = container.get(LoadingGuard);
  const targetUrlInjectorGuard = container.get(TargetUrlInjectorGuard);
  const activeGameGuard = container.get(ActiveGameGuard);

  const router = new ApplicationRouter(
    authenticatedRouteGuard,
    trackingGuard,
    profileGuard,
    trackerService,
    targetUrlInjectorGuard,
    menuMusicGuard,
    loadingGuard,
    activeGameGuard,
  );

  const app = createApp(App);
  app.use(router.getRouter());
  app.use(translationService.i18n);
  app.directive('ui-sound', uiSoundDirective);

  app.mount('#app');
})();
