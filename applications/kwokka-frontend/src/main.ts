import { createApp } from 'vue';

import '@/polyfills';

import App from '@/app/App.vue';
import { ApplicationRouter } from '@/app/router';
import { container } from './ioc';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { UnauthenticatedGuard } from './guard/unauthenticated.guard';
import { AccessRightGuard } from './guard/access-right.guard';
import { ProfileGuard } from './guard/profile.guard';
import { ConfigService } from './service/config/config.service';
import { LoggerService } from './service/logger/logger.service';
import { TrackerService } from './service/tracker/tracker.service';
import { TranslationService } from './service/translation/translation.service';
import { HttpService } from './service/network/http.service';

// include global styles
import '@kwokka/auth-vue/style.css';
import '@kwokka/avatar-vue/style.css';
import './styles/main.scss';

// include service worker
import './registerServiceWorker';
import { AuthRequestInterceptor } from './service/network/auth.request-interceptor';
import { AuthResponseInterceptor } from './service/network/auth.response-interceptor';
import { ContentTypeRequestInterceptor } from './service/network/content-type.request-interceptor';

(function initApp() {
  const logger = container.get(LoggerService);
  const translationService: TranslationService = container.get(TranslationService);
  const authenticatedRouteGuard = container.get(AuthenticatedGuard);
  const unauthenticatedRouteGuard = container.get(UnauthenticatedGuard);
  const accessRightGuard = container.get(AccessRightGuard);
  const profileGuard = container.get(ProfileGuard);
  const trackerService = container.get(TrackerService);
  const configService = container.get(ConfigService);
  const httpService = container.get(HttpService);
  const authRequestInterceptor = container.get(AuthRequestInterceptor);
  const authResponseInterceptor = container.get(AuthResponseInterceptor);
  const contentTypeRequestInterceptor = container.get(ContentTypeRequestInterceptor);
  httpService.setRequestInterceptors([contentTypeRequestInterceptor, authRequestInterceptor]);
  httpService.setResponseInterceptors([authResponseInterceptor]);

  const router = new ApplicationRouter(
    authenticatedRouteGuard,
    unauthenticatedRouteGuard,
    accessRightGuard,
    profileGuard,
    trackerService,
  );

  const app = createApp(App);
  app.use(router.getRouter());
  app.use(translationService.i18n);

  app.mount('#app');

  logger.log(`Version: ${configService.frontendConfig.version}`);
})();
