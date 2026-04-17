# Pawsome Elements Frontend

Web client for the Pawsome Elements multiplayer card game. Built with Vue 3 + Phaser 3 for game rendering, application pages, and real-time WebSocket gameplay. Part of the Kwokka platform.

## Project Structure

```
pawsome-elements-frontend/
├── src/
│   ├── main.ts                           # Entry point: IoC setup, router, Vue app creation
│   │
│   ├── app/                              # Vue application layer
│   │   ├── App.vue                       # Root component (responsive layout, global providers)
│   │   ├── router.ts                     # ApplicationRouter class with route definitions
│   │   ├── route-name.ts                 # RouteName enum (18 routes)
│   │   │
│   │   ├── views/                        # Route-level view components
│   │   │   ├── auth/                     # AuthView - login/register (@kwokka/auth-vue)
│   │   │   ├── loading/                  # LoadingView - initial loading screen
│   │   │   ├── main/                     # MainView - main menu dashboard
│   │   │   ├── play/                     # PlayView - game mode selection
│   │   │   ├── practice/                 # PracticeView - solo vs bots
│   │   │   ├── quick-match/              # QuickMatchView - casual matchmaking
│   │   │   ├── ranked-match/             # RankedMatchView - ranked with ELO
│   │   │   ├── lobby/                    # LobbyView - browse & create rooms
│   │   │   ├── game/                     # GameView - active game sessions
│   │   │   │   ├── GameView.vue          # Root: fetches game, establishes WebSocket
│   │   │   │   ├── views/               # 4 game type views (Room, Practice, Quick, Ranked)
│   │   │   │   ├── states/              # Game state components (Preparation, InProgress, Abandoned)
│   │   │   │   ├── results/             # Results screens with rewards
│   │   │   │   ├── controller/          # PwsmGameController (WebSocket actions & state)
│   │   │   │   └── components/          # Game UI overlays
│   │   │   ├── shop/                     # ShopView - card set shop
│   │   │   ├── atlas/                    # AtlasView - card collection & equipment
│   │   │   ├── journal/                  # JournalView - progression/lore
│   │   │   ├── card-set/                 # CardSetView - deck builder
│   │   │   ├── setup-profile/            # SetupProfileView - first-time profile
│   │   │   └── tutorial/                 # TutorialView - onboarding
│   │   │
│   │   ├── components/                   # Shared Vue components (~36)
│   │   │   ├── game/                     # Game.vue (Phaser container + UI overlays)
│   │   │   ├── game-card/                # Card display components
│   │   │   ├── onboarding/              # Tutorial/onboarding components
│   │   │   ├── settings/                # Settings panel components
│   │   │   ├── ActionCard.vue           # Modal-like action panel
│   │   │   ├── MenuLayout.vue           # Main menu background & layout
│   │   │   ├── UserAvatar.vue           # Player avatar display
│   │   │   ├── EssencePanel.vue         # Currency display
│   │   │   ├── SkillIcon.vue            # Skill icon with tooltip
│   │   │   ├── CardsFan.vue             # Hand of cards visualization
│   │   │   ├── Timer.vue / Stopwatch.vue
│   │   │   └── ...                      # 25+ more reusable components
│   │   │
│   │   ├── ui-kit/                       # Base UI kit (~15 components)
│   │   │   ├── UiButton.vue, UiInput.vue, UiSwitch.vue
│   │   │   ├── UiDialog.vue, UiTooltip.vue, UiNotification.vue
│   │   │   ├── UiSlider.vue, UiLoader.vue, UiIcon.vue
│   │   │   └── ...
│   │   │
│   │   └── directives/                   # Vue directives
│   │       └── ui-sound-directive.ts     # Sound on UI interactions
│   │
│   ├── game/                             # Phaser game engine layer
│   │   ├── pwsm-game.ts                 # PwsmGame class (Phaser.Game wrapper)
│   │   ├── pwsm-game-config.ts          # PwsmGameConfig interface (callbacks)
│   │   ├── pwsm-game-constants.ts       # Visual constants (sizes, colors, timings)
│   │   ├── resource.ts                   # Resource key constants for assets
│   │   ├── event-key.ts                  # EventKey enum (game ↔ Vue communication)
│   │   ├── object-key.ts                # Phaser object registry keys
│   │   ├── registry-key.ts              # Phaser registry keys
│   │   │
│   │   ├── scenes/                       # Phaser scenes
│   │   │   ├── preload.scene.ts         # Asset loading (cards, backgrounds, skills, etc.)
│   │   │   └── game.scene.ts            # Main game scene (board, players, cards, UI)
│   │   │
│   │   ├── game-objects/                 # Phaser game objects
│   │   │   ├── card/                    # Card sprite (front face, element, power, effects)
│   │   │   ├── card-back/               # Card back sprite
│   │   │   ├── card-fan/                # Fan layout for hand of cards
│   │   │   ├── card-draw-indicator/     # Card draw animation indicator
│   │   │   ├── card-draw-renderer/      # Card drawing visual effects
│   │   │   ├── opponent/                # Opponent display (fan + panel)
│   │   │   ├── opponents-renderer/      # Positions opponents around table
│   │   │   ├── player/                  # Current player display
│   │   │   ├── player-panel/            # Player info panel (avatar, skill, cooldown)
│   │   │   ├── profile/                 # Profile image loader
│   │   │   ├── table/                   # Game table (discard pile, drop zones)
│   │   │   ├── game-timer/              # Turn timer display
│   │   │   ├── skill-renderer/          # Skill activation UI
│   │   │   │   ├── skill-renderer.ts    # Base skill renderer
│   │   │   │   ├── interactive-skill.ts # Skill requiring target selection
│   │   │   │   ├── player-select-skill.ts # Target player selection
│   │   │   │   └── own-card-select-skill.ts # Own card selection
│   │   │   ├── interaction-renderer/    # Card interaction particle effects
│   │   │   └── tooltip/                 # In-game tooltips
│   │   │
│   │   └── phaser/                       # Phaser utilities/extensions
│   │
│   ├── game-data/                        # Shared game data types & enums
│   │   ├── card/                         # CardId, CardElement, CardState, etc.
│   │   ├── game-instance/               # PwsmGameInstanceEntity (frontend wrapper)
│   │   ├── skills/                      # Skill definitions & keys
│   │   ├── journey-map/                 # Journey progression data
│   │   ├── item-key.ts                  # ItemKey enum (arenas, card backs, skins)
│   │   ├── player-action.ts             # PlayerAction enum
│   │   └── lobby-key.ts                 # LobbyKey enum
│   │
│   ├── service/                          # Application services (Inversify-managed)
│   │   ├── kwokka/                      # KwokkaService - SDK-JS client wrapper
│   │   ├── config/                      # ConfigService - env config
│   │   ├── persistence/                 # PersistenceService - localStorage
│   │   ├── translation/                 # TranslationService - i18n (12 languages)
│   │   │   └── lang/                    # Translation files per locale
│   │   ├── sound/                       # SoundService - audio/music management
│   │   ├── notification/                # NotificationService - toast pub/sub
│   │   ├── logger/                      # LoggerService - console wrapper
│   │   ├── tracker/                     # TrackerService - analytics (GA, Rybbit)
│   │   ├── error-tracker/               # ErrorTrackerService - Sentry
│   │   ├── onboarding/                  # OnboardingService - tutorial flows
│   │   ├── cache/                       # CacheService - IndexedDB caching
│   │   ├── resource-cache/              # ResourceCacheService - asset caching
│   │   ├── cookie/                      # CookieService - GDPR consent
│   │   ├── ad/                          # AdService - Google Ads
│   │   ├── dom/                         # DOMService - DOM utilities
│   │   └── voice/                       # VoiceService - text-to-speech
│   │
│   ├── guard/                            # Vue Router guards
│   │   ├── authenticated.guard.ts       # JWT validation → redirect to /auth
│   │   ├── profile.guard.ts             # Load user profile/decorations
│   │   ├── tracking.guard.ts            # Initialize analytics user
│   │   ├── active-game.guard.ts         # Detect ongoing game → resume prompt
│   │   ├── target-url-injector.guard.ts # Post-auth redirect
│   │   ├── loading.guard.ts             # Route through loading screen
│   │   └── menu-music.guard.ts          # Play menu music on menu routes
│   │
│   ├── ioc/                              # Inversify IoC container
│   │   ├── ioc-container.ts             # Container wrapper (singleton scope)
│   │   ├── shared.config.ts             # Common service bindings
│   │   ├── dev.config.ts                # Dev: DevTracker, DevErrorTracker
│   │   └── prod.config.ts               # Prod: ProdTracker, SentryErrorTracker
│   │
│   ├── util/                             # Utility functions
│   │   ├── clipboard.util.ts, timer.util.ts, route.util.ts
│   │   ├── position.ts, file.util.ts, resize-observer.ts
│   │   ├── inject.ts, item.util.ts, error-code.ts
│   │   └── share.util.ts
│   │
│   └── styles/                           # Global SCSS styles
│       ├── _colors.scss                 # Color variables
│       ├── _fonts.scss                  # Font definitions
│       ├── _reset.scss                  # CSS reset
│       ├── _global.scss                 # Global styles
│       ├── framework/                   # SCSS framework (auto-imported)
│       │   ├── _typography.scss, _spacings.scss, _media.scss
│       │   ├── _button.scss, _input.scss, _transitions.scss
│       │   ├── _background.scss, _border-radius.scss
│       │   ├── _box-shadow.scss, _drop-shadow.scss, _text-shadow.scss
│       │   ├── _9-box.scss, _functions.scss
│       │   └── _index.scss              # Framework barrel (auto-imported to all components)
│       └── elements/                    # Element-specific styles
│           ├── _ui-overlay.scss
│           └── _ui-9-box.scss
│
├── public/                               # Static assets
│   └── static/                          # Game assets (images, sounds)
│       ├── card/                        # Card face, back, value icons, effects
│       ├── skill/                       # Skill icons
│       ├── player_panel/                # Player panel backgrounds
│       ├── timer/                       # Timer background
│       ├── skill_renderer/              # Skill renderer backgrounds
│       └── ...                          # Arena backgrounds, particles, misc
│
├── scripts/
│   └── export-translations.ts           # i18n translation export utility
│
├── vite/                                 # Vite build helpers
├── index.html                            # SPA entry HTML
├── vite.config.ts                        # Vite config (Vue, PWA, Sentry, SCSS)
├── tsconfig.json                         # TS project references
├── tsconfig.app.json                     # App TS config (strict: false, decorators)
├── tsconfig.node.json                    # Build config TS
├── netlify.toml                          # Netlify SPA redirect
├── .env                                  # Environment variables
└── package.json                          # v0.27.0
```

## Tech Stack

- **Runtime**: Browser (PWA-enabled)
- **Language**: TypeScript 5.8 (strict: false, experimental decorators)
- **Framework**: Vue 3.5 (Composition API + vue-facing-decorator class components)
- **Game Engine**: Phaser 3.88
- **Build Tool**: Vite 6.3
- **Styling**: SCSS (Sass 1.71) with auto-imported framework
- **IoC**: Inversify 7.5 + inversify-inject-decorators
- **Routing**: Vue Router 4.5
- **i18n**: Vue I18n 11.1 (12 languages)
- **State**: No Vuex/Pinia - Inversify services + prop drilling
- **Error Tracking**: Sentry 9.12 (browser + Vite source maps)
- **Analytics**: Google Analytics, Rybbit, Microsoft Clarity
- **PWA**: vite-plugin-pwa with Workbox (CacheFirst strategy)
- **Deployment**: Netlify (SPA redirect)
- **Dev Server**: Port 9000 (host: local.kwokka.co)

## Architecture

### Overview

The application has two main rendering layers: **Vue 3** handles application pages, routing, and overlay UI, while **Phaser 3** renders the actual card game in a canvas element. They communicate via Phaser's event system and callback props.

```
┌─────────────────────────────────────────────────────────────────┐
│  Vue Application Layer                                          │
│  ├─ App.vue (root: responsive layout, global providers)        │
│  ├─ Router (18 routes, 7 guards)                               │
│  ├─ Views (auth, main, play, lobby, game, shop, atlas, ...)   │
│  └─ Components (36 shared + 15 ui-kit)                         │
├─────────────────────────────────────────────────────────────────┤
│  Game Integration (GameView → Game.vue)                         │
│  ├─ PwsmGameController (WebSocket actions & state sync)        │
│  ├─ PwsmGameConfig (callbacks: onCardPlay, onSkillPlay, ...)   │
│  └─ EventKey enum (Vue ↔ Phaser communication)                 │
├─────────────────────────────────────────────────────────────────┤
│  Phaser Game Engine                                             │
│  ├─ PreloadScene (asset loading: cards, skills, arenas)        │
│  ├─ GameScene (board, players, cards, interactions, timer)     │
│  └─ Game Objects (Card, CardFan, Opponent, Table, Skill, ...)  │
├─────────────────────────────────────────────────────────────────┤
│  Service Layer (Inversify IoC)                                  │
│  ├─ KwokkaService (SDK-JS client: REST + WebSocket)            │
│  ├─ SoundService, TranslationService, PersistenceService       │
│  ├─ TrackerService, ErrorTrackerService, NotificationService   │
│  └─ ConfigService, CacheService, OnboardingService, ...        │
├─────────────────────────────────────────────────────────────────┤
│  External Services (via @kwokka/sdk-js)                         │
│  ├─ Owl (auth): JWT tokens, sign-in/up, OAuth                 │
│  ├─ Zebra (games): lobbies, game instances                     │
│  ├─ Capybara (profiles): traits, inventory, decorations        │
│  └─ Game Server (WebSocket): real-time game state              │
└─────────────────────────────────────────────────────────────────┘
```

### Boot Sequence

1. `main.ts` - Create Inversify container (dev/prod config)
2. Setup services: TrackerService, TranslationService, ConfigService
3. Create ApplicationRouter with guards
4. Create Vue app, install router + i18n plugin
5. Mount to `#app`
6. Route guards cascade: Auth → Profile → Tracking → ActiveGame → TargetUrl

### Routing & Guards

**Guard Execution Order** (on root `/` route):

1. **AuthenticatedGuard** - Validates JWT via sdk-js, redirects to `/auth` if unauthenticated
2. **ProfileGuard** - Loads user profile & decorations from Capybara
3. **TrackingGuard** - Sets user in analytics tracker
4. **ActiveGameGuard** - Checks for ongoing game, shows resume prompt
5. **TargetUrlInjectorGuard** - Handles post-auth redirect from persistence
6. **LoadingGuard** - Routes through loading screen on first visit
7. **MenuMusicGuard** - Plays menu music (applied per-route on menu routes)

**Routes:**

| Path             | View             | Guards            | Description                                           |
| ---------------- | ---------------- | ----------------- | ----------------------------------------------------- |
| `/auth`          | AuthView         | none              | Login/register (Google, Discord, Email, Anonymous)    |
| `/loading`       | LoadingView      | none              | Initial loading screen                                |
| `/setup-profile` | SetupProfileView | Auth              | First-time profile creation                           |
| `/main`          | MainView         | Auth+Profile+Menu | Main menu dashboard                                   |
| `/play`          | PlayView         | Auth+Profile+Menu | Game mode selection                                   |
| `/practice`      | PracticeView     | Auth+Profile      | Solo vs bots                                          |
| `/quick-match`   | QuickMatchView   | Auth+Profile      | Casual matchmaking                                    |
| `/ranked-match`  | RankedMatchView  | Auth+Profile      | Ranked with ELO                                       |
| `/lobby`         | LobbyView        | Auth+Profile+Menu | Browse & create rooms                                 |
| `/game/:id`      | GameView         | Auth+Profile      | Active game session                                   |
| `/shop`          | ShopView         | Auth+Profile+Menu | Card set shop                                         |
| `/atlas`         | AtlasView        | Auth+Profile+Menu | Card collection (nested: equipment, skill-tree, etc.) |
| `/journal`       | JournalView      | Auth+Profile+Menu | Progression/lore                                      |
| `/card-set`      | CardSetView      | Auth+Profile+Menu | Deck builder                                          |
| `/tutorial`      | TutorialView     | Auth+Profile      | Tutorial flows                                        |

### Design Patterns

- **IoC Container**: Inversify with singleton scope; `@LazyInject` decorator in Vue components
- **Class Components**: `vue-facing-decorator` for Vue 3 class syntax with `@Component`, `@Provide`
- **Strategy**: Game views per lobby type (Room, Practice, Quick, Ranked)
- **State Machine**: Game status drives view rendering (Initial → InProgress → Finished/Abandoned)
- **Pub/Sub**: NotificationService for toasts, EventKey for Phaser ↔ Vue
- **Guard Chain**: Route guards compose as middleware pipeline
- **Throttle**: Player actions throttled at 300ms to prevent spam

## Internal Dependencies

```
@kwokka/utils (1.3.3) ← base utilities
    │
@kwokka/entities (1.16.0) ← shared domain models
    │
@kwokka/sdk-js (0.16.3) ← platform SDK (auth, REST API, WebSocket game client)
    │
@kwokka/auth-vue (1.7.1) ← authentication UI components
@kwokka/avatar-vue (1.8.7) ← avatar display/customization components
@kwokka/sound (1.3.1) ← audio/sound management
@kwokka/cookie-consent (1.0.2) ← GDPR cookie consent
    │
pawsome-elements-frontend ← this application
```

## Game Domain

### Vue ↔ Phaser Integration

The Game.vue component creates a Phaser game instance and bridges Vue state to Phaser:

```
GameView.vue (route: /game/:id)
  ├─ Fetches gameInstance, game, lobby via KwokkaService
  ├─ Creates PwsmGameController (WebSocket handler)
  ├─ Establishes WebSocket via kwokkaService.connect()
  └─ Renders game type view based on lobby.key:
      └─ RoomGameView / PracticeGameView / QuickMatchGameView / RankedMatchGameView
          └─ GameState.vue (status === InProgress)
              └─ Game.vue (Phaser container)
                  ├─ Creates PwsmGame (Phaser.Game)
                  ├─ Passes PwsmGameConfig with callbacks
                  ├─ Overlays Vue UI (avatars, settings, pause)
                  └─ Watches gameInstance for state updates
```

**PwsmGameConfig callbacks** (Vue → Phaser → Vue):

- `onCardPlay(card)` → sends PlayCard action
- `onInteract(data)` → sends InteractCard action
- `onSkillPlay(data)` → sends PlaySkill action
- `onCardDraw()` → sends card draw request
- `onSkipTurn()` → sends SkipTurn action
- `onReady()` → game scene fully loaded
- `onCardPlayed()` → animation complete callback

**EventKey enum** (Phaser internal events):

- `SetState` - push new game state to scene
- `SetConfig` - push new config to scene
- `CardDragStart/End` - card drag interaction
- `TableDropZoneCardEnter/Drop/Leave` - discard pile drops
- `SkillClick` - skill button pressed
- `OuterCardPlay/OuterInteract/OuterSkillPlay` - action dispatches

### Phaser Scenes

**PreloadScene**: Loads all game assets:

- Card faces, backs, value icons (per element)
- Card effects (transform, burn, curse)
- Player panel backgrounds, skill frames
- Skill icons (8 active skills)
- Timer, particles, arena backgrounds
- Sound effects loaded separately via SoundService

**GameScene**: Main game rendering:

- **Table**: Discard pile with card stack, drop zones for playing cards
- **Player**: Current player's hand as draggable card fan
- **OpponentsRenderer**: Positions 1-3 opponents around the table
- **GameTimer**: Turn countdown display
- **SkillRenderer**: Skill activation UI (target selection modes)
- **InteractionRenderer**: Particle effects for card interactions

### Game Objects Hierarchy

```
GameScene
├── Table (discard pile, drop zones)
├── Player (hand of cards - draggable CardFan)
├── OpponentsRenderer
│   └── Opponent[] (CardBackFan + PlayerPanel per opponent)
├── GameTimer (countdown display)
├── SkillRenderer (skill activation modes)
│   ├── InteractiveSkill (basic skill)
│   ├── PlayerSelectSkill (target opponent)
│   └── OwnCardSelectSkill (select own card)
├── InteractionRenderer (particle effects)
├── CardDrawRenderer (draw animation)
└── Tooltip (hover info)
```

### PwsmGameController

Extends SDK-JS `GameController` for WebSocket game communication:

```typescript
// Throttled action senders (300ms)
sendPlayCardAction(card: CardState)
sendPlayCardInOthersTurnAction(card: CardState)
sendSkipTurnAction()
sendAddBotAction()
sendKickPlayerAction(playerId: string)
sendInteractCardAction(content: any)
sendPlaySkillAction(content: any)
sendUpdateRoomVisibilityAction(isPrivate: boolean)
sendDoubleRewardAction()

// Event handlers
onGameInstanceUpdated(data)     // Game state patches from server
onConnectivityUpdated(record)   // Player online/offline status
onDisconnected(reason)          // Connection lost handling
onErrorMessage(error)           // Server error messages
```

### Game State Flow

```
Route to /game/:id
    │
    ▼
GameView: fetch gameInstance + game + lobby
    │
    ▼
Connect WebSocket via kwokkaService.connect()
    │
    ▼
Select view by lobby.key ──→ RoomGameView / PracticeGameView / ...
    │
    ▼
Watch gameInstance.status:
    ├── Initial ──→ PreparationState (lobby UI, player list, start button)
    ├── InProgress ──→ GameState ──→ Game.vue ──→ Phaser game
    ├── Finished ──→ Results overlay (rewards, double essence)
    └── Abandoned ──→ AbandonedState (game over)
```

## Service Layer

| Service                | Purpose                           | Key Methods                                                                            |
| ---------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `KwokkaService`        | SDK-JS client wrapper             | `getGame()`, `connect()`, `createRoomMatch()`, `findQuickMatch()`, `findRankedMatch()` |
| `ConfigService`        | Env config (frozen object)        | `frontendConfig` (endpoints, OAuth, links, analytics)                                  |
| `PersistenceService`   | localStorage (`[pwsm]` namespace) | `storeValue()`, `loadValue()`, `clearValue()`                                          |
| `TranslationService`   | i18n (vue-i18n wrapper)           | `localize()`, `localizePlural()`, `localizeDate()`, `setLocale()`                      |
| `SoundService`         | Audio via @kwokka/sound           | `play()`, `playMenuMusic()`, `playGameMusic()`, `mute()`                               |
| `NotificationService`  | Toast notifications (pub/sub)     | `show()`, `showErrors()`, `subscribe()`                                                |
| `LoggerService`        | Console wrapper with prefix       | `log()`, `error()`, `warn()`, `debug()`                                                |
| `TrackerService`       | Analytics (abstract + workers)    | `event()`, `pageView()`, `setUser()`                                                   |
| `ErrorTrackerService`  | Sentry error reporting            | `setup()`, `captureError()`, `captureMessage()`                                        |
| `OnboardingService`    | Tutorial/onboarding flows         | `runScenario()`, `runStep()`, `finishScenario()`                                       |
| `CacheService`         | IndexedDB asset caching           | Web Worker based                                                                       |
| `ResourceCacheService` | Static resource caching           | Service Worker integration                                                             |
| `CookieService`        | GDPR cookie consent               | External library integration                                                           |
| `AdService`            | Google Ads                        | `setup()`, `configure()`                                                               |

## Internationalization

**12 Supported Languages:**
English (en), German (de), Portuguese (pt), French (fr), Dutch (nl), Polish (pl), Spanish (es), Italian (it), Russian (ru), Turkish (tr), Japanese (ja), Chinese (zh)

**Default**: English. Auto-detects browser language on first visit. Persisted to localStorage.

**Translation modules**: atlas, auth, avatar, card, card-set, cookie-consent, effect, error, game, general, item, journal, loading, lobby, main, onboarding, play, quick-match, ranked-match, settings, shop, skill

## Environment Variables

| Variable                             | Default                                          | Description                  |
| ------------------------------------ | ------------------------------------------------ | ---------------------------- |
| `VITE_APP_KWOKKA_ENDPOINT`           | `http://localhost:8081`                          | Kwokka platform API endpoint |
| `VITE_APP_GAME_SERVER_URL`           | `http://localhost:9001/game`                     | WebSocket game server URL    |
| `VITE_APP_ROOT_URL`                  | `http://local.kwokka.co:9000`                    | Frontend root URL            |
| `VITE_APP_KWOKKA_DECORATIONS_SRC`    | `http://local.kwokka.co:8080/assets/decorations` | Decoration assets CDN        |
| `VITE_APP_KWOKKA_ITEMS_SRC`          | `http://local.kwokka.co:8080/assets/items`       | Item assets CDN              |
| `VITE_APP_GOOGLE_API_CLIENT_ID`      | _(in .env)_                                      | Google OAuth client ID       |
| `VITE_APP_DISCORD_API_CLIENT_ID`     | _(in .env)_                                      | Discord OAuth client ID      |
| `VITE_APP_DISCORD_AUTH_REDIRECT_URI` | _(in .env)_                                      | Discord OAuth redirect       |
| `VITE_APP_H_CAPTCHA_KEY`             | _(in .env)_                                      | hCaptcha site key            |
| `VITE_APP_SENTRY_DSN`                | _(empty in dev)_                                 | Sentry error tracking        |
| `VITE_APP_GA_RESOURCE_ID`            | _(empty in dev)_                                 | Google Analytics ID          |
| `VITE_APP_RYBBIT_SITE_ID`            | _(empty in dev)_                                 | Rybbit analytics ID          |
| `VITE_APP_CLARITY_PROJECT_ID`        | _(empty in dev)_                                 | Microsoft Clarity ID         |
| `VITE_APP_RESOURCES_CACHE_NAME`      | `resources_v1`                                   | Service Worker cache name    |
| `VITE_APP_VERSION`                   | _(auto: git describe)_                           | App version from git         |

## Common Commands

```bash
# Development (Vite dev server, port 9000, host exposed)
npm run start

# Production build (parallel: type-check + vite build)
npm run build

# Preview production build
npm run preview

# Type checking only
npm run type-check

# Lint + auto-fix
npm run lint

# Format code
npm run format

# Bundle size analysis
npm run size

# Export translations
npm run scripts:export_translations
```

## Conventions

### File Naming

- Vue components: `PascalCase.vue` (e.g., `GameView.vue`, `UiButton.vue`)
- TypeScript files: `kebab-case.ts` (e.g., `pwsm-game-config.ts`, `route-name.ts`)
- SCSS files: `_kebab-case.scss` with underscore prefix for partials
- Guards: `kebab-case.guard.ts`
- Services: `kebab-case.service.ts`
- Phaser scenes: `kebab-case.scene.ts`

### Component Pattern

```typescript
@Component({ components: { ... } })
export default class MyView extends Vue {
  @LazyInject(SomeService) public someService: SomeService;
  @Provide() public sharedState: boolean = false;

  public created(): void { /* init */ }
  public beforeDestroy(): void { /* cleanup */ }
}
```

### Code Style

- **ESLint**: vue3-essential + TypeScript + Prettier
- **Prettier**: single quotes, trailing commas, 120 print width, 2-space indent
- **Explicit member accessibility**: all class members must declare `public`/`private`/`protected`
- **Unused imports**: auto-removed by eslint-plugin-unused-imports
- **No tests**: testing infrastructure not implemented

### IoC Pattern

- All services registered as singletons in `src/ioc/`
- Dev vs Prod bindings (tracker, error tracker)
- `@LazyInject` decorator for Vue component injection
- `@injectable()` decorator on all service classes

## Build Configuration

### Vite

- **Dev server**: Port 9000, host `local.kwokka.co`
- **SCSS**: Auto-imports `@/styles/framework/_index.scss` to all components
- **Path alias**: `@` → `./src`
- **Manual chunks**: Phaser separated into own chunk (~2-3MB)
- **Source maps**: Enabled, uploaded to Sentry on production build
- **PWA**: Workbox with CacheFirst strategy for static assets

### TypeScript

- `strict: false`
- `experimentalDecorators: true` + `emitDecoratorMetadata: true`
- `lib: ["ES2020", "DOM", "DOM.Iterable"]`
- Path alias: `@/*` → `src/*`

## Deployment

- **Platform**: Netlify
- **Config**: SPA catch-all redirect (`/* → /index.html`)
- **Source maps**: Uploaded to Sentry (org: kwokka, project: pawsome-elements-frontend)
- **PWA**: Service worker with Workbox runtime caching
- **Assets**: Static files in `/public/static/` with cache-first strategy

## Sound System

**3 Sound Groups**: Music, Sfx, Voice

**Music Tracks**: Menu (3 variants), Game (3 variants), GameEnd (1 variant) - with 3s fade transitions

**Sound Effects**: Card play, card draw, card fail, UI select, UI hover, UI fail, skill activation, etc.

**Narrator Voices**: 5 tone variants per emotion (question, mystery, etc.)

**Settings**: Persisted to localStorage (mute, master gain, per-group gain)
