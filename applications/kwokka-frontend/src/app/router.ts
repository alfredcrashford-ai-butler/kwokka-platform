import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from 'vue-router';
import { CapybaraAccessRight, OwlAccessRight, ZebraAccessRight } from '@kwokka/rights';
import { TrackerService } from '@/service/tracker/tracker.service';
import { AuthenticatedGuard } from '@/guard/authenticated.guard';
import { UnauthenticatedGuard } from '@/guard/unauthenticated.guard';
import type { AccessRightGuard } from '@/guard/access-right.guard';
import AuthView from './views/auth/AuthView.vue';
import MainView from './views/main/MainView.vue';
import CollectionView from './views/collection/CollectionView.vue';
import AccessSetupView from './views/access-setup/AccessSetupView.vue';
import AccessManagementView from './views/access-management/AccessManagementView.vue';
import InventoryView from './views/inventory/InventoryView.vue';
import ItemManagementView from './views/item-management/ItemManagementView.vue';
import SettingsView from './views/settings/SettingsView.vue';
import SetupProfileView from './views/setup-profile/SetupProfileView.vue';
import VerifyView from './views/verify/VerifyView.vue';
import GamesManagementView from './views/games-management/GamesManagementView.vue';
import GameManagementView from './views/game-management/GameManagementView.vue';
import AccountView from './views/account/AccountView.vue';
import type { ProfileGuard } from '@/guard/profile.guard';

export class ApplicationRouter {
  private router: Router;

  public constructor(
    private authenticatedGuard: AuthenticatedGuard,
    private unauthenticatedGuard: UnauthenticatedGuard,
    private accessRightGuard: AccessRightGuard,
    private profileGuard: ProfileGuard,
    private trackerService: TrackerService,
  ) {
    this.router = this.createRouter();
  }

  public getRouter() {
    return this.router;
  }

  private createRouter(): Router {
    const router = createRouter({
      history: createWebHistory(import.meta.env.BASE_URL),
      routes: [
        {
          path: '/',
          beforeEnter: [this.authenticatedGuard.perform, this.profileGuard.perform],
          children: [
            {
              path: '/main',
              name: 'main',
              component: MainView,
            },
            {
              path: '/collection',
              name: 'collection',
              component: CollectionView,
            },
            {
              path: '/inventory',
              name: 'inventory',
              component: InventoryView,
            },
            {
              path: '/item-management',
              name: 'item-management',
              component: ItemManagementView,
              beforeEnter: [this.accessRightGuard.withAccessRight(CapybaraAccessRight.ManageItems).perform],
            },
            {
              path: '/access-management',
              name: 'access-management',
              component: AccessManagementView,
              beforeEnter: this.accessRightGuard.withAccessRight(OwlAccessRight.ManageAccess).perform,
            },
            {
              path: '/access-management/account/:id',
              name: 'account-access-management',
              component: AccountView,
              beforeEnter: this.accessRightGuard.withAccessRight(OwlAccessRight.ManageAccess).perform,
            },
            {
              path: '/access-setup',
              name: 'access-setup',
              component: AccessSetupView,
              beforeEnter: this.accessRightGuard.withAccessRight(OwlAccessRight.SetupAccess).perform,
            },
            {
              path: '/settings',
              name: 'settings',
              component: SettingsView,
            },
            {
              path: '/verify',
              name: 'verify',
              component: VerifyView,
              beforeEnter: this.accessRightGuard.withAccessRight(OwlAccessRight.VerifyOwnCredential).perform,
            },
            {
              path: '/games-management',
              name: 'games-management',
              component: GamesManagementView,
              beforeEnter: this.accessRightGuard.withAccessRight(ZebraAccessRight.ManageGames).perform,
            },
            {
              path: '/games-management/:id',
              name: 'game-management',
              component: GameManagementView,
              beforeEnter: this.accessRightGuard.withAccessRight(ZebraAccessRight.ManageGames).perform,
            },
          ],
        },

        {
          path: '/setup-profile',
          name: 'setup-profile',
          beforeEnter: this.authenticatedGuard.perform,
          component: SetupProfileView,
        },

        // routes for unauthenticated user
        {
          path: '/auth',
          name: 'auth',
          beforeEnter: this.unauthenticatedGuard.perform,
          component: AuthView,
        },

        // redirect to app by default
        {
          path: '/:pathMatch(.*)*',
          redirect: '/main',
        },
      ],
    });

    router.afterEach((to, from) => this.onRouteChange(to, from));

    return router;
  }

  private onRouteChange(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    if (!to.name || to.name === from.name) {
      return;
    }

    this.trackerService.pageView(to.name.toString(), to.fullPath);
  }
}
