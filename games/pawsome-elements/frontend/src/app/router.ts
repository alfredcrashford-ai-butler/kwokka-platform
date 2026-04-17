import { createRouter, createWebHistory, type RouteLocationNormalized, type Router } from 'vue-router';
import type { TrackerService } from '@/service';
import type {
  ActiveGameGuard,
  AuthenticatedGuard,
  LoadingGuard,
  MenuMusicGuard,
  ProfileGuard,
  TargetUrlInjectorGuard,
  TrackingGuard,
} from '@/guard';
import {
  AuthView,
  QuickMatchView,
  MainView,
  SetupProfileView,
  LobbyView,
  GameView,
  PracticeView,
  TutorialView,
  AtlasView,
  PlayView,
  EquipmentView,
  JourneyView,
  SkillTreeView,
  TreasuryView,
  JournalView,
  ShopView,
  CardSetView,
  LoadingView,
  RankedMatchView,
  EssenceMultipliersView,
} from '@/app/views';
import { RouteName } from './route-name';

export class ApplicationRouter {
  private router: Router;

  public constructor(
    private authenticatedGuard: AuthenticatedGuard,
    private trackingGuard: TrackingGuard,
    private profileGuard: ProfileGuard,
    private trackerService: TrackerService,
    private targetUrlInjectorGuard: TargetUrlInjectorGuard,
    private menuMusicGuard: MenuMusicGuard,
    private loadingGuard: LoadingGuard,
    private activeGameGuard: ActiveGameGuard,
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
          beforeEnter: [
            this.authenticatedGuard.perform,
            this.profileGuard.perform,
            this.trackingGuard.perform,
            this.activeGameGuard.perform,
            this.targetUrlInjectorGuard.perform,
          ],
          children: [
            {
              path: '/main',
              name: RouteName.Main,
              beforeEnter: [this.menuMusicGuard.perform],
              component: MainView,
            },
            {
              path: '/play',
              name: RouteName.Play,
              beforeEnter: [this.menuMusicGuard.perform],
              component: PlayView,
            },
            {
              path: '/shop',
              name: RouteName.Shop,
              beforeEnter: [this.menuMusicGuard.perform],
              component: ShopView,
            },
            {
              path: '/lobby',
              name: RouteName.Lobby,
              beforeEnter: [this.menuMusicGuard.perform],
              component: LobbyView,
            },
            {
              path: '/game/:id',
              name: RouteName.Game,
              component: GameView,
            },
            {
              path: '/practice',
              name: RouteName.Practice,
              component: PracticeView,
            },
            {
              path: '/atlas',
              beforeEnter: [this.menuMusicGuard.perform],
              component: AtlasView,
              children: [
                { path: 'equipment', name: RouteName.Equipment, component: EquipmentView },
                { path: 'skill-tree', name: RouteName.SkillTree, component: SkillTreeView },
                { path: 'essence-multipliers', name: RouteName.EssenceMultipliers, component: EssenceMultipliersView },
                { path: 'journey', name: RouteName.Journey, component: JourneyView },
                { path: 'treasury', name: RouteName.Treasury, component: TreasuryView },
                { path: '', name: RouteName.Atlas, redirect: '/atlas/equipment' },
              ],
            },
            {
              path: '/quick-match',
              name: RouteName.QuickMatch,
              beforeEnter: [this.menuMusicGuard.perform],
              component: QuickMatchView,
            },
            {
              path: '/ranked-match',
              name: RouteName.RankedMatch,
              beforeEnter: [this.menuMusicGuard.perform],
              component: RankedMatchView,
            },
            {
              path: '/journal',
              name: RouteName.Journal,
              beforeEnter: [this.menuMusicGuard.perform],
              component: JournalView,
            },
            {
              path: '/card-set',
              name: RouteName.CardSet,
              beforeEnter: [this.menuMusicGuard.perform],
              component: CardSetView,
            },
          ],
        },

        {
          path: '/setup-profile',
          name: RouteName.SetupProfile,
          beforeEnter: [this.authenticatedGuard.perform, this.menuMusicGuard.perform],
          component: SetupProfileView,
        },

        {
          path: '/auth',
          name: RouteName.Auth,
          component: AuthView,
        },

        {
          path: '/loading',
          name: RouteName.Loading,
          component: LoadingView,
        },

        {
          path: '/tutorial',
          name: RouteName.Tutorial,
          component: TutorialView,
        },

        // redirect to app by default
        {
          path: '/:pathMatch(.*)*',
          redirect: { name: RouteName.Main },
        },
      ],
    });

    router.beforeEach(this.loadingGuard.perform);
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
