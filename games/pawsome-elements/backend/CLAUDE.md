# Pawsome Elements Backend

WebSocket-based multiplayer card game server for "Pawsome Elements" - a competitive turn-based card game with elements, skills, bots, and ranked play. Part of the Kwokka platform.

## Project Structure

```
pawsome-elements-backend/
├── src/
│   ├── index.ts                          # Entry point: imports instrument, creates HttpServer
│   ├── instrument.ts                     # Sentry initialization (production only)
│   ├── http-server.ts                    # Express server + WebSocket game server setup
│   │
│   ├── entity/                           # Domain entities and game logic
│   │   ├── config.ts                     # Game balance constants (timings, bot params, card catalog)
│   │   ├── config-interface.ts           # PawsomeElementsConfigInterface type
│   │   ├── draw-cards-from-pile.ts       # Card drawing utility
│   │   ├── game-key.ts                   # GameKey = 'pawsome_elements'
│   │   ├── lobby-key.ts                  # LobbyKey enum (room, practice, quick, ranked)
│   │   ├── lobby-config.ts              # Lobby configuration (essence, rating, card set)
│   │   ├── item-key.ts                   # ItemKey.Essence = 'pwsm_essence'
│   │   ├── trait-key.ts                  # TraitKey (EquippedSkill, CurrentRatingSeason)
│   │   ├── decoration-key.ts            # Background & avatar image keys
│   │   │
│   │   ├── card/                         # Card type definitions
│   │   │   ├── card-type.ts              # Common | Special | Interaction
│   │   │   ├── card-id.ts               # 50+ card IDs (Nature1-9, Filth1-9, Arcane1-9, Balls, etc.)
│   │   │   ├── card-element.ts           # Nature | Filth | Arcane | Multimatter
│   │   │   ├── card-state.ts             # Runtime card state (cardInGameId, config, effects)
│   │   │   ├── card-set.ts              # Standard | Turbo deck definitions
│   │   │   ├── card-config.ts            # { type, element, power }
│   │   │   └── card-effect-id.ts         # Transform | Burn
│   │   │
│   │   ├── cards/                        # Card class implementations
│   │   │   ├── card.ts                   # Abstract Card base class
│   │   │   ├── common-card.ts            # Simple numbered cards (transfer turn)
│   │   │   ├── interaction-card.ts       # Abstract base for interactive cards
│   │   │   ├── selection-interaction-card.ts      # Player selects from options
│   │   │   ├── player-selection-interaction-card.ts # Player targets another player
│   │   │   ├── competitive-interaction-card.ts    # All players must respond
│   │   │   ├── endurance-interaction-card.ts      # Endurance-based interaction
│   │   │   ├── card-factory.ts           # CardFactory: cardId → Card instance
│   │   │   └── standard/                 # 11 standard card implementations
│   │   │       ├── hydrant-card.ts       # Competitive: all players click (extends turn 10s)
│   │   │       ├── ball-of-fortune-card.ts # Selection: pick from 2 special cards
│   │   │       ├── ball-of-curse-card.ts
│   │   │       ├── ball-of-fate-card.ts
│   │   │       ├── ball-of-luck-card.ts
│   │   │       ├── ball-of-wisdom-card.ts
│   │   │       ├── ball-of-wish-card.ts
│   │   │       ├── shaking-card.ts
│   │   │       ├── soundboard-card.ts
│   │   │       ├── treat-hiding-card.ts
│   │   │       └── trash-can-diving-card.ts
│   │   │
│   │   ├── effects/                      # Card effect system
│   │   │   ├── card-effect.ts            # Abstract CardEffect base
│   │   │   ├── card-burn-effect.ts       # Discard card(s)
│   │   │   ├── card-transform-effect.ts  # Change card identity
│   │   │   └── card-effect-factory.ts    # effectId → CardEffect instance
│   │   │
│   │   ├── skills/                       # Player skill system (8 active + 9 passive)
│   │   │   ├── skill.ts                  # Abstract Skill base (cooldown, validation, effect)
│   │   │   ├── empty-skill.ts            # No-op skill
│   │   │   ├── skill-factory.ts          # ActiveSkillItemKey → Skill instance
│   │   │   ├── active-skill-item-key.ts  # 8 active skill types
│   │   │   ├── passive-skill-item-key.ts # 9 essence multiplier levels
│   │   │   ├── reduce-start-cards-skill.ts
│   │   │   ├── selected-player-draws-cards-skill.ts
│   │   │   ├── selected-player-burns-cards-skill.ts
│   │   │   ├── transform-own-card-into-multidog-skill.ts
│   │   │   ├── replace-own-hand-skill.ts
│   │   │   ├── play-any-card-skill.ts
│   │   │   ├── transform-random-opponents-card-into-selected-skill.ts
│   │   │   └── discard-random-cards-skill.ts
│   │   │
│   │   ├── bot/                          # Bot AI system
│   │   │   ├── bot.ts                    # Bot decision logic (difficulty 0-1)
│   │   │   └── bot-profile-generator.ts  # Random names + decorations
│   │   │
│   │   └── game-instance/                # Game state machine
│   │       ├── pwsm-game-instance.entity.ts  # Core: extends GameInstanceEntity
│   │       ├── lobby-settings.ts         # Players, card set, rewards config
│   │       ├── public-state.ts           # Visible to all: discard pile, turns, interactions
│   │       ├── private-state.ts          # Server-only: card deck
│   │       ├── player-state.ts           # Per-player: hand of cards
│   │       ├── interaction-state.ts      # Active card interaction
│   │       ├── pause-state.ts            # Disconnect pause tracking
│   │       ├── skill-state.ts            # Per-player skill cooldowns
│   │       ├── results.ts                # Game outcome (positions, essence, rating)
│   │       └── feature/                  # Composable game features
│   │           ├── game-feature.ts       # Abstract GameFeature base
│   │           ├── start.game-feature.ts # Deck shuffle, initial deal, turn order
│   │           ├── pause.game-feature.ts # Disconnect pause/resume
│   │           └── bot.game-feature.ts   # Bot player management
│   │
│   ├── application/                      # Application layer (controllers)
│   │   ├── kwokka-client.ts              # KwokkaSdkNodeClient wrapper (auth, game server)
│   │   ├── pawsome-elements-game-controller.ts  # Extends GameController (WebSocket hooks)
│   │   ├── player-action.ts              # Action enum (PlayCard, SkipTurn, PlaySkill, etc.)
│   │   ├── disconnect-reason.ts          # Structured disconnect messages
│   │   │
│   │   ├── hook-param/                   # Game controller hook parameters
│   │   │   └── pwsm-game-controller-hook-param.ts
│   │   │
│   │   ├── lobby-controller/             # Lobby type handlers (Strategy pattern)
│   │   │   ├── lobby-controller.ts       # Base class (~687 lines): game actions, lifecycle
│   │   │   ├── lobby-controller-factory.ts # LobbyKey → LobbyController
│   │   │   ├── bot-lobby-controller.ts   # Adds bot AI scheduling
│   │   │   ├── room.lobby-controller.ts  # Custom rooms (public/private, kick)
│   │   │   ├── practice.lobby-controller.ts    # Solo vs easy bots
│   │   │   ├── quick-match.lobby-controller.ts # Casual auto-match (fills with bots after 10s)
│   │   │   └── ranked-match.lobby-controller.ts # Rating-based (ELO, penalties)
│   │   │
│   │   └── reward/                       # Reward calculation
│   │       └── reward-calculator.ts      # Essence + passive multipliers
│   │
│   ├── error/                            # Error definitions
│   │   └── error-code.ts                 # PlayerIsNotInGame, Forbidden, LobbyNotFound, etc.
│   │
│   └── util/                             # Cross-cutting utilities
│       ├── config.util.ts                # Type-safe env var access
│       ├── env-var-name.ts               # EnvVarName enum
│       ├── error-tracker.util.ts         # Sentry wrapper
│       └── logger.ts                     # Winston logger (console, colorized)
│
├── scripts/
│   ├── rating_simulation.ts              # Offline rating/ELO algorithm testing
│   └── essence_simulation.ts             # Offline essence reward calculation testing
│
├── data/                                 # Data files
├── Dockerfile                            # Multi-stage Node 22.14 build
├── tsconfig.json                         # ES2019, NodeNext, sourceMap: true
├── jest.config.ts                        # ts-jest, node env, coverage enabled
├── .eslintrc.cjs                         # Airbnb-base + unused-imports
├── .prettierrc.json                      # Prettier config
├── .env                                  # Development environment variables
└── package.json                          # v0.16.0
```

## Tech Stack

- **Runtime**: Node.js 22
- **Language**: TypeScript 5.8 (target ES2019, module NodeNext, strict: false)
- **Framework**: Express 5.1 (HTTP) + WebSocket via @kwokka/sdk-node
- **Logging**: Winston 3.17
- **Monitoring**: Sentry 8.52 (production only, with profiling)
- **Testing**: Jest 29 + ts-jest
- **Linting**: ESLint (airbnb-base) + Prettier
- **Container**: Docker (Node 22.14)

## Architecture

### Overview

The service is a **stateless WebSocket game server** with no direct database access. Game state is persisted via the Kwokka SDK. The architecture follows a simplified Clean Architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│  HTTP Layer (Express)                                           │
│  └─ /healthcheck (only HTTP endpoint)                          │
├─────────────────────────────────────────────────────────────────┤
│  WebSocket Layer (via @kwokka/sdk-node GameController)          │
│  └─ PawsomeElementsGameController                              │
│     └─ Hooks: onPlayerConnected, onPlayerDisconnected,         │
│                onPlayerAction, onUnhandledError                 │
├─────────────────────────────────────────────────────────────────┤
│  Application Layer (Lobby Controllers)                         │
│  └─ LobbyControllerFactory → Room | Practice | QuickMatch |   │
│                                Ranked                          │
│  └─ RewardCalculator                                           │
├─────────────────────────────────────────────────────────────────┤
│  Domain Layer (Entities)                                       │
│  └─ PwsmGameInstanceEntity (state machine)                     │
│  └─ Cards (CardFactory, 11 card types, effects)                │
│  └─ Skills (SkillFactory, 8 active types)                      │
│  └─ Bot AI (difficulty-based decision making)                  │
│  └─ GameFeatures (Start, Pause, Bot)                           │
├─────────────────────────────────────────────────────────────────┤
│  External Services (via @kwokka/sdk-node)                      │
│  └─ Owl (auth): service-to-service clientId + secret           │
│  └─ Zebra (games): lobby, game instance persistence            │
│  └─ Capybara (profiles): traits, inventory, items              │
└─────────────────────────────────────────────────────────────────┘
```

### Boot Sequence

1. `instrument.ts` - Sentry initialization (prod only)
2. `HttpServer` constructor - Express setup (CORS, body parser, health check)
3. `KwokkaClient.initialize()` - SDK auth (clientId/secret → owl sign-in)
4. `KwokkaClient.setupGameServer()` - WebSocket server at `/game` path
5. Listen on PORT (default 9001)

### Design Patterns

- **Factory**: CardFactory, SkillFactory, CardEffectFactory, LobbyControllerFactory
- **Strategy**: Lobby controllers (Room, Practice, QuickMatch, Ranked)
- **Template Method**: LobbyController base with override points per lobby type
- **Composition**: GameFeatures (Start, Pause, Bot) composed into PwsmGameInstanceEntity
- **State Machine**: Game lifecycle (Initial → InProgress → Finished/Abandoned)
- **Event-Driven**: WebSocket hooks from SDK

## Internal Dependencies

```
@kwokka/utils (1.3.4) ← base utilities
    │
@kwokka/entities (1.16.0) ← shared domain models (GameInstanceEntity, etc.)
    │
@kwokka/sdk-node (1.11.3) ← platform SDK (auth, WebSocket game server, service APIs)
    │
pawsome-elements-backend ← this service
```

### SDK-Node Usage

```typescript
// Auth
client.initialize()                          // Service-to-service sign-in

// Game server
client.setupGameServer(server, config)       // WebSocket setup
client.updateGameInstance(gameInstance)       // Broadcast state to players
client.persistGameInstance(gameInstance)      // Persist to game store
client.getGameInstance(id)                   // Load game instance
client.disconnectPlayer(accountId, reason)   // Kick player
client.broadcastError(accountId, code, msg)  // Send error to player

// Scheduler
client.scheduler.set(callback, delay, name)  // Schedule timeout
client.scheduler.clear(name)                 // Cancel timeout

// Zebra (game management)
client.game.getLobbyById(lobbyId)
client.game.getLobbyByKey(key)
client.game.getGameByKey(key)

// Capybara (profile/inventory)
client.trait.getTraitInstanceByTraitKey(accountId, key)
client.trait.updateTraitInstanceByTraitKey(accountId, key, value)
client.inventory.getItemInstanceByItemKey(key, accountId)
client.inventory.giveItemInstanceByItemKey(key, accountId, quantity)
```

## Game Domain

### Game Flow

```
Initial                  InProgress                      Finished
┌────────┐              ┌────────────┐                  ┌──────────┐
│ Players│─StartGame──→ │ Turn-based │──canFinish──→    │ Results  │
│ connect│              │ card play  │                  │ rewards  │
│ +bots  │              │            │──disconnect──→ Paused ─┐    │
└────────┘              │            │←─reconnect─── (10s)  ──┘    │
     │                  └────────────┘──timeout────→ Abandoned     │
     └──all leave──→ Abandoned                                     │
                                                                   │
                                                     DoubleReward  │
                                                     (optional)    │
```

### Player Actions

| Action | When | Description |
|--------|------|-------------|
| `StartGame` | Initial, host only | Initialize deck, deal cards, start turns |
| `PlayCard` | InProgress, own turn | Play card matching element/power/multimatter |
| `PlayCardInOthersTurn` | InProgress, not own turn | Play card matching BOTH element AND power |
| `SkipTurn` | InProgress, own turn | Draw 1 card, pass turn |
| `PlaySkill` | InProgress, own turn | Use active skill (3-turn cooldown) |
| `InteractCard` | InProgress, during interaction | Respond to interactive card |
| `DoubleReward` | Finished | Double essence reward (once per player) |
| `AddBot` | Initial, host only | Add AI bot to room |

### Card System

**4 Elements**: Nature, Filth, Arcane, Multimatter (wild)

**Card Play Rules**:
- Own turn: card must match last discard's element OR power, or be Multimatter
- Other's turn: card must match BOTH element AND power

**Card Hierarchy**:
```
Card (abstract)
├── CommonCard (numbered 1-9 per element, transfers turn)
├── InteractionCard (abstract)
│   ├── CompetitiveInteractionCard (all players respond)
│   │   └── HydrantCard (3-way competitive, +10s)
│   ├── SelectionInteractionCard (single player picks option)
│   │   └── BallOfFortuneCard (pick from 2 special cards)
│   ├── PlayerSelectionInteractionCard (target a player)
│   └── EnduranceInteractionCard
└── Special Cards (Shaking, TrashCanDiving, TreatHiding, Balls, etc.)
```

**Card Effects**: Attached to CardState, lifecycle hooks:
- `onPlay()` - when card is played
- `onTopPlay()` - when another card is played on top
- `onOtherCardPlay()` - when another card plays while in hand
- `onShuffle()` - when card returns to deck
- Types: `CardBurnEffect` (discard), `CardTransformEffect` (change identity)

**Card Sets**:
- **Standard**: Full deck (~102-106 cards across 3 elements + specials)
- **Turbo**: Reduced deck (fewer high-power cards)

### Skill System

**8 Active Skills** (one equipped per player, 3-turn cooldown):

| Skill | Payload | Effect |
|-------|---------|--------|
| ReduceStartCards | none | Remove 2 cards before game start |
| SelectedPlayerDrawsCards | playerId | Force opponent to draw cards |
| SelectedPlayerBurnsCards | playerId | Force opponent to discard |
| TransformOwnCardIntoMultidog | cardInGameId | Transform own card to Multimatter |
| ReplaceOwnHand | none | Shuffle hand back, redraw |
| PlayAnyCard | cardInGameId | Play any card ignoring rules |
| TransformRandomOpponentsCard | cardInGameId | Transform opponent's card |
| DiscardRandomCards | none | Discard random cards from hand |

**9 Passive Skills** (essence multipliers): Each owned PassiveSkill item adds +1x to essence reward.

### Bot AI

**Difficulty** (0.0-1.0): Controls random-loss probability.
- Practice: 0.4 (easy)
- QuickMatch fill: 0.75 (medium)
- Ranked fill: 1.0 (hard)

**Decision Timing** (% of remaining turn time):
- Turn: 4-7% delay
- Out-of-turn: 5-8% delay
- Interaction: 30-70% delay
- Random extra delay: 3% chance
- Skill use: 65% chance

**Bot Profile**: Random name (77 names + prefix/suffix) + random decoration (5 backgrounds, 5 avatars).

### Lobby Types

| Lobby Key | Controller | Bots | Rating | Special |
|-----------|-----------|------|--------|---------|
| `pwsm_room` | RoomLobbyController | Host adds manually | No | Public/private, kick |
| `pwsm_practice` | PracticeLobbyController | Auto-fill (easy) | No | Solo vs bots |
| `pwsm_quick_match` | QuickMatchLobbyController | Auto-fill after 10s | No | Casual matchmaking |
| `pwsm_ranked_match` | RankedMatchLobbyController | Auto-fill after 20s | Yes | ELO, penalties |

### Reward System

**Essence** (in-game currency):
```
reward = ceil(base * positionMultiplier) * passiveSkillMultiplier
```
- Can be doubled once per player after game ends
- Distributed via `client.inventory.giveItemInstanceByItemKey()`

**Rating** (ranked only):
```
matchPoints = config.reward[position]
if matchPoints > 0:
  multiplier = clamp(linearInterpolate(rating, softCap→hardCap, 1→0), hardCapMultiplier, 1)
  matchPoints = ceil(matchPoints * multiplier)
cardPenalty = cardsRemaining * config.cardPenalty
newRating = max(0, oldRating + matchPoints - cardPenalty)
```
- Soft cap: 2000 (gains start decreasing)
- Hard cap: 3000 (minimum 0.5x multiplier)
- Leave penalty: flat deduction for abandoning

### Game State Structure

```typescript
// Visible to all players
PublicState {
  discardPile: CardState[]              // Played cards
  pileCardCount: number                 // Remaining deck size
  currentTurnPlayerId: string           // Whose turn
  turnEndAt: number                     // Turn deadline (unix ms)
  playerCardCount: Record<id, number>   // Hand sizes
  interaction: InteractionState         // Active card interaction
  skills: Record<id, { key, cooldown }> // Skill states
  pause?: PauseState                    // Disconnect pause info
}

// Server-only
PrivateState {
  pile: CardState[]                     // Hidden deck
}

// Per-player (only visible to that player)
PlayerState {
  cards: CardState[]                    // Player's hand
}
```

### Game Configuration Constants

| Parameter | Value | Description |
|-----------|-------|-------------|
| `turnDuration` | 30s | Standard turn time |
| `firstTurnDuration` | 60s | First turn time |
| `startCardsCount` | 4 | Cards dealt at start |
| `skillCooldownTurns` | 3 | Turns before skill reuse |
| `hydrantMaxDuration` | 10s | Hydrant interaction time |
| `ballOfFortuneMaxDuration` | 10s | Ball of Fortune selection time |
| `soundboardMaxDuration` | 10s | Soundboard interaction time |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `APP_NAME` | `pawsome-elements-backend` | Service name |
| `PORT` | `9001` | HTTP/WebSocket server port |
| `LOG_LEVEL` | `debug` | Winston log level |
| `KWOKKA_ENDPOINT` | `http://local.kwokka.co:8081` | Owl/platform endpoint |
| `KWOKKA_CLIENT_ID` | *(in .env)* | Service account client ID |
| `KWOKKA_SECRET` | *(in .env)* | Service account secret |
| `GAME_SERVER_HOST` | `http://local.kwokka.co:9001` | Public WebSocket host |
| `GAME_SERVER_PATH` | `/game` | WebSocket path |
| `SENTRY_DSN` | *(empty in dev)* | Sentry error tracking URL |

## Common Commands

```bash
# Development (auto-reload with nodemon, port 9001)
npm run start

# Production (after build)
npm run start:prod

# Build TypeScript → dist/
npm run build

# Run tests
npm run test

# Lint + auto-fix
npm run lint

# Format code
npm run format

# Run rating simulation
npm run scripts:rating_simulation

# Run essence simulation
npm run scripts:essence_simulation
```

## Error Handling

### Error Codes

```typescript
enum ErrorCode {
  PlayerIsNotInGame,
  Forbidden,
  LobbyNotFound,
  TooManyPlayers,
  ForbiddenGameStatus,
}
```

### Disconnect Reasons

| Code | Message |
|------|---------|
| `kick` | "You have been kicked from the room." |
| `leave` | "You have left the room." |
| `game_already_in_progress` | "Game is already in progress..." |
| `game_belongs_to_other_player` | "This game belongs to another player." |
| `too_many_players` | "There is no place left in this game." |
| `game_abandoned` | "Game is abandoned and you can not join it." |
| `player_left` | "A player left this game..." |

## Testing

- **Framework**: Jest 29 with ts-jest
- **Config**: `jest.config.ts` (node environment, coverage enabled)
- **Test files**: Co-located with source (`.spec.ts` suffix)
- **Existing tests**: `src/entity/cards/interaction-card.spec.ts`

## Deployment

- **Docker**: Multi-stage build (Node 22.14 base)
- **Source maps**: Uploaded to Sentry via `npm run sentry:sourcemaps`
- **Private registry**: `.npmrc` with `NODE_AUTH_TOKEN` for @kwokka packages

## Known TODOs (from code comments)

- Bug: when current user disconnects, timer advances by 30s + pause duration
- Duplicated method in lobby controller and PlayAnyCardSkill needs combining
- `drawCardsFromPile` function exists to avoid cycle dependency - needs redesign
- Soundboard card partially disabled (commented out)
- Leave action not implemented (commented in PlayerAction enum)
