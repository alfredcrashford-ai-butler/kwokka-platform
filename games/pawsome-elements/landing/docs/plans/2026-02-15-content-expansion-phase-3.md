# Content Expansion Phase 3 – 20 New Blog Articles

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 20 new SEO-friendly blog articles (EN + RU) to the Pawsome Elements landing site, covering card mechanics deep dives, competitive strategy, game lore, progression systems, and general card gaming topics.

**Architecture:** Static 11ty site with Nunjucks templates, bilingual EN/RU. Blog posts use `layouts/blogpost.njk` with date/categories/tags frontmatter. Each article creates 2 files: `src/en/news/blog/YYYY_MM_DD_slug.md` and `src/ru/news/blog/YYYY_MM_DD_slug.md`.

**Tech Stack:** 11ty (Eleventy), Nunjucks, Markdown

---

## Verified Game Facts (Source of Truth)

These facts were verified against `pawsome-elements-backend/src/entity/` source code:

### Card System
- **Elements**: Nature, Filth, Arcane (+ Multimatter for wildcards)
- **Basic cards**: 9 values per element (1-9), 27 basic cards total, 2 copies each in Standard
- **Standard deck**: 91 cards total
- **Turbo deck**: 65 cards (values 1-5 only per element)
- **Card play rules (own turn)**: Match Element OR Value of top discard
- **Card play rules (out-of-turn)**: Must match BOTH Element AND Value (exact match)

### Special Cards (each exists in all 3 elements)
- **Hydrant** (power 1000): Transforms 1 random card from EACH opponent into a random card from the active card set. Automatic, no player interaction.
- **Shaking** (power 101): All opponents draw 1 card each from the pile.
- **Trash Can Diving** (power 100): Next player draws up to 2 cards from the discard pile.
- **Treat Hiding** (power 102): Reduces the player's spell cooldown by 1 turn. 2 copies per element (6 total in Standard).

### Wildcard Cards
- **Multidog** (Multimatter element, power 0): Plays on anything, anything plays on it. 4 copies in Standard.
- **Ball of Fortune** (Multimatter, power 1002, interaction): Plays on anything. Player picks from 2 of 5 random sub-balls. 4 copies in Standard.

### Ball of Fortune Sub-balls
- **Ball of Curse** (111): All opponents draw 1 card
- **Ball of Fate** (112): 1 random card from your hand shuffled back to deck
- **Ball of Luck** (113): ALL cards in hand transform into random cards
- **Ball of Wisdom** (114): Spell cooldown instantly reset to 0
- **Ball of Wish** (115): 1 random card in hand becomes Multidog

### Spells (6 publicly named, equipped 1 per match, 3-turn cooldown)
- **Pawgularity**: Transform any card into Multidog
- **Hesitant Paw**: Start with 2 fewer cards (cooldown 0, triggers at start)
- **Unleashed Will**: Play any card ignoring matching rules
- **Tailspin**: Shuffle 1 random card from hand back to deck
- **Fresh Scent**: Shuffle entire hand back, redraw same number
- **Transmutation**: Each opponent's 1 random card transforms into copy of your selected card

### Game Modes
- **Practice**: Solo vs easy bots (difficulty 0.4)
- **Quick Match**: 2-6 players, bots fill after 10s (difficulty 0.75)
- **Ranked Match**: 4 players, bots fill after 20s (difficulty 1.0)

### Timing
- Turn duration: 30 seconds
- First turn: 60 seconds
- Skill cooldown: 3 turns
- Hydrant/Ball of Fortune interaction: 10 seconds

### Rating System
- Hard point system: 1st earns most, 2nd/3rd still gain, 4th loses (scaled)
- Soft cap: 2000 (gains decrease), Hard cap: 3000 (minimum 0.5x multiplier)
- Card penalty: remaining cards × penalty factor
- Leave penalty for abandoning

### Progression
- **Essence**: Performance-based currency earned per match
- **Passive skills**: 9 essence multiplier tiers
- **Atlas**: Progression hub — Spells tab (unlock spells) + Journey tab (cosmetics: card skins, arena skins)
- **Double reward**: Optional ad watch after match

### Lore
- Dogs built advanced civilization 1000+ years ago
- **The Enchanter Root**: Mysterious glowing tree appeared in **Barkswille**
- **The Shatter**: Magical catastrophe when first dog touched the Root
- World is called **Keta**
- **Characters**: Ruffini the Great (first to touch Root), Savvini the Elusive, Captain Paw (Crimson Fur Order founder), General Rags, Major Tumbox, Priest Woofried (explains spells/elements), The Princess

### CRITICAL: Things that DO NOT exist
- NO minigames, NO bubble popping, NO number tapping, NO device shaking
- Soundboard card is DISABLED (commented out in code) — never reference
- Card effects are automatic, not interactive (except Ball of Fortune selection)

---

## Existing Blog Posts (DO NOT duplicate these topics)

1. How Card Games Work: Core Mechanics (2025-06-30)
2. How UNO Works — and How PE Flips the Deck (2025-07-01)
3. How PE Is Different from Hearthstone (2025-06-12)
4. Common Card Game Strategies (2025-06-25)
5. What Makes a Good Competitive Ranking System (2025-06-28)
6. Understanding the Three Elements (2026-01-15)
7. Which Spell Should You Choose? Complete Comparison (2026-01-22)
8. Mastering Out-of-Turn Play (2026-01-29)
9. Ball of Fortune Guide: Every Effect (2026-02-05)
10. Tips for Climbing Ranked (2026-02-08)
11. Best Free Card Games Online in 2026 (2026-02-11)

---

## Article Schedule

| # | Date | Slug | Topic |
|---|------|------|-------|
| 1 | 2026-02-15 | hydrant_card_guide | Hydrant Card Deep Dive |
| 2 | 2026-02-18 | treat_hiding_the_most_underrated_card | Treat Hiding Strategy |
| 3 | 2026-02-22 | shaking_vs_trash_can_diving | Disruption Cards Compared |
| 4 | 2026-02-25 | the_multidog_when_to_play_and_when_to_hold | Multidog Strategy |
| 5 | 2026-03-01 | standard_vs_turbo_understanding_card_sets | Card Sets Explained |
| 6 | 2026-03-04 | the_art_of_the_comeback | Winning From Behind |
| 7 | 2026-03-08 | practice_mode_vs_quick_match | Training Modes Compared |
| 8 | 2026-03-11 | how_to_play_with_friends_room_mode_guide | Room Mode Guide |
| 9 | 2026-03-15 | five_mistakes_every_new_player_makes | Beginner Mistakes |
| 10 | 2026-03-18 | the_world_of_keta | Game Lore Overview |
| 11 | 2026-03-22 | ruffini_the_great | Lore: Ruffini Character |
| 12 | 2026-03-25 | the_crimson_fur_order | Lore: Captain Paw |
| 13 | 2026-03-29 | priest_woofried_and_the_elements | Lore: Woofried |
| 14 | 2026-04-01 | essence_guide | Essence Economy |
| 15 | 2026-04-04 | the_atlas_explained | Atlas Progression |
| 16 | 2026-04-08 | why_card_games_are_making_a_comeback | Industry Trends |
| 17 | 2026-04-11 | online_card_games_vs_physical_card_games | Digital vs Physical |
| 18 | 2026-04-15 | the_psychology_of_card_games | Reading Opponents |
| 19 | 2026-04-18 | what_makes_a_fair_free_to_play_card_game | Fair F2P Design |
| 20 | 2026-04-22 | card_game_terminology_every_player_should_know | Glossary Article |

---

## Task 1: "How the Hydrant Card Works — And When to Play It"

**SEO targets:** "hydrant card pawsome elements", "card game special card strategy"

**Files:**
- Create: `src/en/news/blog/2026_02_15_hydrant_card_guide.md`
- Create: `src/ru/news/blog/2026_02_15_hydrant_card_guide.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_02_15_hydrant_card_guide.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | How the Hydrant Card Works — And When to Play It'
pageTitle: 'How the Hydrant Card Works — And When to Play It'
date: 2026-02-15
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

The **Hydrant** is one of the most impactful special cards in _Pawsome Elements_. When played,
it transforms one random card from each opponent's hand into a completely different card.
Understanding when and how to use it is key to competitive play.

## How the Hydrant Works

Hydrant exists in all three Elements — Nature, Filth, and Arcane. Like any card, you play it
by matching the Element or Value of the top card on the pile.

When a Hydrant is played, every opponent has **one random card** in their hand transformed
into a random card from the current card set. This happens automatically — no interaction
or choice is involved.

## What Makes Hydrant Powerful

### It Disrupts Opponents' Plans

Every opponent loses a card they chose to keep and gets a random replacement. If they were
holding a Multidog for the perfect moment, it might suddenly become an unmatchable basic card.
If they had a carefully assembled hand of matching Elements, Hydrant can break that synergy.

### It Affects Everyone

Unlike Trash Can Diving (which targets the next player) or Shaking (which makes everyone
draw), Hydrant directly interferes with every opponent's hand simultaneously. In a 4-player
ranked match, that means three players are disrupted at once.

### The Element Sets the Pile

Playing a Hydrant also changes the top of the pile to that Hydrant's Element. This can be a
strategic move in itself — switching the active Element to one that favors your remaining hand.

## When to Play Hydrant

### Late Game Is Best

In the late game, opponents have fewer cards. Transforming one card in a 2-card hand is
devastating — there is a 50% chance of losing the most important card. Early in the game,
when hands are large, the impact is diluted.

### When Opponents Have Small Hands

If you see opponents down to 2-3 cards, that is prime Hydrant timing. Fewer cards means
higher probability that the transformed card was critical to their strategy.

### Pair with Element Control

If you play a Nature Hydrant, the pile becomes Nature. If your hand is Nature-heavy, this
sets you up for strong follow-up turns.

## When NOT to Play Hydrant

### When You Are About to Win

If you are down to 1-2 cards and can finish soon, Hydrant may delay your win. Consider
whether disruption is worth using up your turn.

### When It Might Help Opponents

The transformed card is random. An opponent might get a _better_ card than what they had.
If opponents are already struggling with bad hands, Hydrant could accidentally help them.

## Hydrant After Effects

If an opponent's Hydrant transforms one of your cards, check the new card immediately. It
might be an exact match for the current pile — enabling an [out-of-turn play](/en/game/strategy).
Always stay alert after Hydrant effects resolve.

## Quick Summary

- Hydrant transforms 1 random card from each opponent
- Strongest in late game when hands are small
- Also changes the pile's Element — use this strategically
- Be aware it can randomly help opponents
- Watch for out-of-turn opportunities after a Hydrant

For more on special cards, visit the [Cards page](/en/game/cards).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_02_15_hydrant_card_guide.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Как Работает Карта Гидрант — И Когда Её Играть'
pageTitle: 'Как Работает Карта Гидрант — И Когда Её Играть'
date: 2026-02-15
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

**Гидрант** — одна из самых влиятельных особых карт в _Pawsome Elements_. При розыгрыше
она превращает одну случайную карту у каждого противника в совершенно другую. Понимание,
когда и как её использовать — ключ к успешной игре.

## Как работает Гидрант

Гидрант существует во всех трёх Элементах — Природа, Скверна и Аркана. Как и любая карта,
он разыгрывается совпадением по Элементу или Значению верхней карты стола.

При розыгрыше Гидранта у каждого противника **одна случайная карта** превращается в
случайную карту из текущего набора. Это происходит автоматически — никакого выбора или
взаимодействия.

## Почему Гидрант так силён

### Нарушает планы противников

Каждый противник теряет карту, которую решил сохранить, и получает случайную замену. Если
кто-то берёг Мультипса для идеального момента — он может превратиться в несовпадающую
обычную карту. Тщательно собранная рука по одному Элементу может рассыпаться.

### Действует на всех

В отличие от Мусорного Дайвинга (действует на следующего) или Встряски (все берут карту),
Гидрант напрямую вмешивается в руки всех противников одновременно. В рейтинговом матче
на 4 игроков это означает помеху трём игрокам сразу.

### Задаёт Элемент стола

Розыгрыш Гидранта также меняет верхнюю карту стола на Элемент этого Гидранта. Это само
по себе может быть стратегическим ходом — переключение на Элемент, выгодный для вашей руки.

## Когда играть Гидрант

### Лучше всего в конце игры

В поздней игре у противников меньше карт. Превращение одной карты из двух разрушительно —
50% шанс потерять самую важную карту. В начале игры, когда руки большие, эффект размывается.

### Когда у противников мало карт

Если противники опустились до 2-3 карт — идеальное время для Гидранта. Меньше карт означает
большую вероятность, что трансформированная карта была ключевой.

### В паре с контролем Элемента

Если вы играете Гидрант Природы — стол становится Природой. Если ваша рука богата
Природой, это подготавливает сильные следующие ходы.

## Когда НЕ стоит играть Гидрант

### Когда вы вот-вот победите

Если у вас 1-2 карты и вы можете быстро финишировать, Гидрант может задержать победу.
Оцените, стоит ли помеха использованного хода.

### Когда это может помочь противникам

Новая карта — случайная. Противник может получить _лучшую_ карту, чем та, что была.
Если противники и так мучаются с плохими руками, Гидрант может случайно им помочь.

## Последствия Гидранта

Если чужой Гидрант превратил вашу карту — сразу проверьте новую. Она может оказаться
точным совпадением с текущим столом, открывая возможность для
[хода вне очереди](/ru/game/strategy). Будьте внимательны после эффектов Гидранта.

## Итоги

- Гидрант превращает 1 случайную карту у каждого противника
- Сильнее всего в конце игры при маленьких руках
- Также меняет Элемент стола — используйте стратегически
- Может случайно помочь противникам
- Следите за возможностями хода вне очереди после Гидранта

Подробнее об особых картах — на странице [Карты](/ru/game/cards).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_02_15_* src/ru/news/blog/2026_02_15_*
```

---

## Task 2: "Treat Hiding: The Most Underrated Card in Pawsome Elements"

**SEO targets:** "treat hiding pawsome elements", "spell cooldown card game strategy"

**Files:**
- Create: `src/en/news/blog/2026_02_18_treat_hiding_the_most_underrated_card.md`
- Create: `src/ru/news/blog/2026_02_18_treat_hiding_the_most_underrated_card.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_02_18_treat_hiding_the_most_underrated_card.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Treat Hiding: The Most Underrated Card'
pageTitle: 'Treat Hiding: The Most Underrated Card in Pawsome Elements'
date: 2026-02-18
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Every card in _Pawsome Elements_ has a purpose. But if you asked most players which card they
overlook, the answer would likely be the same: **Treat Hiding**.

This humble special card does not deal damage, does not force opponents to draw, and does not
transform anything. Instead, it does something quietly powerful: it **reduces your spell
cooldown by 1 turn**.

## How Treat Hiding Works

Treat Hiding exists in all three Elements — Nature, Filth, and Arcane. There are **2 copies
per Element** in the Standard deck, making it one of the most common special cards with **6
total copies**.

When you play Treat Hiding, your spell cooldown decreases by 1 turn. That is the entire
effect. Simple — but the implications for your strategy are significant.

## Why Cooldown Reduction Matters

Spells have a **3-turn cooldown** after use. That means after casting a spell, you normally
wait 3 full turns before you can use it again. Treat Hiding shortens that wait.

### Faster Spell Cycling

Playing one Treat Hiding reduces your wait from 3 turns to 2. Playing two in sequence brings
it to 1. If you manage to play three Treat Hidings during a cooldown window, your spell is
ready immediately.

### Spell-Focused Strategies

If your strategy revolves around a spell like **Pawgularity** or **Transmutation**, getting
it back faster gives you more opportunities to use it. In longer matches, this can mean the
difference between using your spell once or three times.

### Synergy with Ball of Wisdom

Ball of Wisdom (from Ball of Fortune) resets your cooldown to 0 instantly. But it is random —
you cannot count on getting it. Treat Hiding is the reliable way to accelerate your cooldown.

## When to Prioritize Treat Hiding

### When Your Spell Is on Cooldown

This is obvious but worth stating: Treat Hiding is most valuable immediately after you have
used your spell. Every Treat Hiding played brings your next spell activation closer.

### When Your Spell Is Key to Winning

If you are running Hesitant Paw (which activates at the start), Treat Hiding has no value for
spell cooldown. But if you are using a combat spell like Unleashed Will or Transmutation,
every cooldown reduction directly improves your chances.

### When You Can Match It Naturally

Do not hold Treat Hiding waiting for the perfect moment — it is still a card in your hand.
If you can match it by Element or Value, play it and take the cooldown bonus.

## Strategic Interactions

- **Treat Hiding + Pawgularity**: Accelerate your Multidog generation rate
- **Treat Hiding + Transmutation**: Disrupt opponents more frequently
- **Treat Hiding + Fresh Scent**: Get a faster hand reset if the first one was not ideal
- **Multiple Treat Hidings**: Each one stacks, compounding the benefit

## The Numbers Advantage

With 6 copies in the Standard deck, you will see Treat Hiding frequently during a match.
Players who actively play them gain a compounding advantage over those who treat them as
ordinary cards.

## Quick Summary

- Treat Hiding reduces spell cooldown by 1 turn
- 6 copies in Standard deck (most common special card)
- Most valuable when your spell is on cooldown
- Stacks with multiple plays for rapid spell cycling
- Pairs powerfully with spell-focused strategies

For the full spell breakdown, read [Which Spell Should You Choose?](/en/game/spells).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_02_18_treat_hiding_the_most_underrated_card.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Прятки с Лакомством: Самая Недооценённая Карта'
pageTitle: 'Прятки с Лакомством: Самая Недооценённая Карта'
date: 2026-02-18
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

У каждой карты в _Pawsome Elements_ есть своя роль. Но если спросить большинство игроков,
какую карту они недооценивают, ответ будет одинаковым: **Прятки с Лакомством**.

Эта скромная особая карта не наносит урон, не заставляет противников брать карты и ничего
не превращает. Вместо этого она делает нечто тихо могущественное: **уменьшает перезарядку
заклинания на 1 ход**.

## Как работают Прятки с Лакомством

Прятки с Лакомством существуют во всех трёх Элементах — Природа, Скверна и Аркана. В
стандартной колоде **2 копии на Элемент**, что делает её одной из самых распространённых
особых карт — **6 копий** всего.

При розыгрыше перезарядка вашего заклинания уменьшается на 1 ход. Простой эффект, но с
серьёзными стратегическими последствиями.

## Почему уменьшение перезарядки важно

У заклинаний **3 хода перезарядки** после использования. Три полных хода ожидания. Прятки
с Лакомством сокращают это ожидание.

### Ускоренный цикл заклинаний

Одна карта уменьшает ожидание с 3 до 2 ходов. Две подряд — до 1. Три — заклинание
готово немедленно.

### Стратегии на заклинаниях

Если ваша стратегия строится на Сингупёсности или Трансмутации, более быстрый возврат
заклинания даёт больше возможностей. В долгих матчах это может означать разницу между
одним и тремя применениями.

### Синергия с Шаром Мудрости

Шар Мудрости (из Шара Фортуны) сбрасывает перезарядку до 0 мгновенно. Но он случаен —
рассчитывать на него нельзя. Прятки с Лакомством — надёжный путь к ускорению перезарядки.

## Когда играть Прятки с Лакомством

### Когда заклинание перезаряжается

Наиболее ценны сразу после использования заклинания. Каждая сыгранная карта приближает
следующую активацию.

### Когда заклинание — ключ к победе

Если вы используете боевое заклинание (Освобождённая Воля, Трансмутация), каждое
уменьшение перезарядки улучшает ваши шансы. Исключение — Лапа Отказа (активируется
на старте и не использует перезарядку в бою).

### Когда можно совпасть

Не копите Прятки с Лакомством ради идеального момента — это карта в руке. Если можете
совпасть по Элементу или Значению, играйте и получите бонус.

## Стратегические связки

- **Прятки + Сингупёсность**: Ускоренная генерация Мультипсов
- **Прятки + Трансмутация**: Чаще мешайте противникам
- **Прятки + Свежесть**: Быстрый повторный сброс руки
- **Несколько Пряток**: Эффект суммируется

## Преимущество в числах

С 6 копиями в стандартной колоде Прятки с Лакомством часто попадаются. Игроки, активно
разыгрывающие их, получают нарастающее преимущество над теми, кто считает их обычными
картами.

## Итоги

- Уменьшает перезарядку заклинания на 1 ход
- 6 копий в стандартной колоде (самая частая особая карта)
- Ценнее всего при перезарядке заклинания
- Суммируется при нескольких розыгрышах
- Мощная синергия со стратегиями на заклинаниях

Подробнее о заклинаниях — в [сравнении заклинаний](/ru/game/spells).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_02_18_* src/ru/news/blog/2026_02_18_*
```

---

## Task 3: "Shaking vs Trash Can Diving: Which Disruption Card Is Better?"

**SEO targets:** "card game disruption strategy", "pawsome elements shaking trash can diving"

**Files:**
- Create: `src/en/news/blog/2026_02_22_shaking_vs_trash_can_diving.md`
- Create: `src/ru/news/blog/2026_02_22_shaking_vs_trash_can_diving.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_02_22_shaking_vs_trash_can_diving.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Shaking vs Trash Can Diving: Which Disruption Card Is Better?'
pageTitle: 'Shaking vs Trash Can Diving: Which Disruption Card Is Better?'
date: 2026-02-22
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

_Pawsome Elements_ has two special cards that force opponents to draw: **Shaking** and
**Trash Can Diving**. Both disrupt opponents, but they work very differently. Understanding
when each card shines will help you make better decisions during matches.

## How Each Card Works

### Shaking

When you play Shaking, **all opponents draw 1 card** from the pile. In a 4-player match, that
means three players each get one additional card. The effect is broad but shallow — everyone
is affected equally.

### Trash Can Diving

When you play Trash Can Diving, the **next player draws up to 2 cards from the discard pile**.
Only one opponent is affected, but the impact is more concentrated. The cards come from the
discard pile, not the main deck.

## Key Differences

| Feature | Shaking | Trash Can Diving |
|---------|---------|------------------|
| Targets | All opponents | Next player only |
| Cards drawn | 1 per opponent | Up to 2 |
| Source | Main pile | Discard pile |
| Total cards added | 3 (in 4-player) | Up to 2 |

## When Shaking Is Better

### Multiple Opponents Are Close to Winning

When two or more opponents have small hands, Shaking punishes all of them at once. Trash Can
Diving only hits one player, leaving others unaffected.

### You Want Broad Disruption

Shaking maintains your advantage against the entire table. If you are in first place by card
count, widening the gap against everyone is more valuable than targeting a single player.

### Late Game with Multiple Threats

In the closing rounds of a ranked match, you are competing against three players for a top-3
finish. Shaking disrupts all competitors equally.

## When Trash Can Diving Is Better

### One Specific Opponent Is About to Win

If a single player is down to 1-2 cards and others are not a threat, Trash Can Diving delivers
a heavier targeted blow — forcing them to pick up 2 cards instead of just 1.

### The Discard Pile Has Bad Cards

Since Trash Can Diving draws from the discard pile, you can sometimes predict what cards the
next player will receive. If the pile is full of Element-mismatched cards, they will be stuck
with cards they cannot play.

### You Want to Remove Cards from the Discard

Drawing from the discard pile reduces the number of cards available there. This can matter in
longer games where the pile recycles.

## Using Both Together

The best strategy is not choosing one over the other — it is recognizing which card fits each
specific situation. Keep both options in mind as you play:

- **Shaking** when the table is competitive and multiple opponents need to be slowed
- **Trash Can Diving** when you need targeted disruption against a specific player

## Quick Summary

- Shaking = broad, hitting all opponents for 1 card each
- Trash Can Diving = targeted, hitting one opponent for up to 2 cards
- Both exist in all three Elements (Nature, Filth, Arcane)
- Choose based on whether you need wide or focused disruption

For more on special cards, visit the [Cards page](/en/game/cards).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_02_22_shaking_vs_trash_can_diving.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Встряска vs Мусорный Дайвинг: Какая Карта Помех Лучше?'
pageTitle: 'Встряска vs Мусорный Дайвинг: Какая Карта Помех Лучше?'
date: 2026-02-22
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

В _Pawsome Elements_ есть две особые карты, заставляющие противников брать карты:
**Встряска** и **Мусорный Дайвинг**. Обе мешают противникам, но работают по-разному.
Понимание, когда какая карта лучше, поможет принимать верные решения в матчах.

## Как работает каждая карта

### Встряска

При розыгрыше Встряски **все противники берут по 1 карте** из колоды. В матче на 4 игроков
трое получают по одной дополнительной карте. Эффект широкий, но неглубокий — все
затронуты одинаково.

### Мусорный Дайвинг

При розыгрыше Мусорного Дайвинга **следующий игрок берёт до 2 карт из стопки сброса**.
Только один противник затронут, но удар сконцентрирован. Карты берутся из сброса, а не
из основной колоды.

## Ключевые отличия

| Параметр | Встряска | Мусорный Дайвинг |
|----------|----------|------------------|
| Цели | Все противники | Только следующий |
| Карт берётся | 1 на каждого | До 2 |
| Источник | Основная колода | Стопка сброса |
| Всего карт | 3 (в игре на 4) | До 2 |

## Когда Встряска лучше

### Несколько противников близки к победе

Когда у двух или более игроков маленькие руки, Встряска наказывает всех сразу. Мусорный
Дайвинг бьёт только одного, оставляя других нетронутыми.

### Нужна широкая помеха

Встряска поддерживает преимущество против всего стола. Если вы первый по количеству
карт — расширение разрыва со всеми выгоднее, чем удар по одному.

### Поздняя игра с несколькими угрозами

В финале рейтингового матча вы конкурируете с тремя игроками за топ-3. Встряска
одинаково мешает всем.

## Когда Мусорный Дайвинг лучше

### Один конкретный противник вот-вот выиграет

Если у одного игрока 1-2 карты, а остальные не угрожают, Мусорный Дайвинг наносит
более тяжёлый целевой удар — заставляя взять 2 карты вместо 1.

### В сбросе плохие карты

Мусорный Дайвинг берёт из сброса, и иногда можно предсказать, какие карты получит
следующий игрок. Если стопка полна несовпадающих по Элементу карт, противник застрянет.

### Нужно уменьшить стопку сброса

Взятие из сброса уменьшает количество доступных там карт. В длинных партиях это
может иметь значение.

## Использование обеих

Лучшая стратегия — не выбирать одну навсегда, а определять, какая подходит каждой
конкретной ситуации:

- **Встряска** — когда стол конкурентный и нужно замедлить нескольких
- **Мусорный Дайвинг** — когда нужна целевая помеха конкретному игроку

## Итоги

- Встряска = широкий эффект, все противники берут по 1 карте
- Мусорный Дайвинг = целевой, один противник берёт до 2 карт
- Обе существуют во всех трёх Элементах
- Выбирайте в зависимости от того, нужна широкая или точечная помеха

Подробнее об особых картах — на странице [Карты](/ru/game/cards).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_02_22_* src/ru/news/blog/2026_02_22_*
```

---

## Task 4: "The Multidog: When to Play Your Best Card (And When to Hold It)"

**SEO targets:** "multidog wildcard pawsome elements", "best card to hold card game"

**Files:**
- Create: `src/en/news/blog/2026_02_25_the_multidog_when_to_play_and_when_to_hold.md`
- Create: `src/ru/news/blog/2026_02_25_the_multidog_when_to_play_and_when_to_hold.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_02_25_the_multidog_when_to_play_and_when_to_hold.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | The Multidog: When to Play and When to Hold'
pageTitle: 'The Multidog: When to Play Your Best Card (And When to Hold It)'
date: 2026-02-25
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

The **Multidog** is the most versatile card in _Pawsome Elements_. It belongs to the
Multimatter Element, meaning it can be played on any card — and any card can be played on top
of it. With only **4 copies** in the Standard deck, Multidogs are rare and powerful.

But knowing _when_ to play your Multidog is just as important as having one.

## How the Multidog Works

- Belongs to the **Multimatter** Element
- Can be played on top of any card, regardless of Element or Value
- Any card can be played on top of a Multidog
- Has no special effect — its power is pure flexibility

## When to Play the Multidog

### When You Are Stuck

The most straightforward use: you have no other playable cards. Rather than drawing from the
pile (and potentially getting another unmatchable card), play your Multidog to stay in the game
and keep your card count low.

### When You Want to Finish

If you are down to 2 cards and one is a Multidog, it guarantees you can play your
second-to-last card situation: play the other card if possible, then finish with the Multidog.
Or play the Multidog to set up your final card.

### When You Want to Change the Element

Since any card can be played on a Multidog, playing one effectively resets the pile. This is
useful when the current Element does not match your hand — play the Multidog, and the next
player can play anything, but more importantly, _you_ can plan your next move based on what
ends up on top.

## When to Hold the Multidog

### When You Have Other Playable Cards

If you can match the pile by Element or Value with a regular card, save the Multidog for later.
Regular cards are expendable; Multidogs are not.

### Early in the Match

In the early game, when hands are large and options are plentiful, using a Multidog wastes its
potential. You are more likely to need it later when your hand is smaller and matching options
narrow.

### When You Are Winning

If you are already in first place by card count, holding the Multidog gives you insurance for
a future bad draw. Playing it now gains you nothing extra that a regular card could not achieve.

## Multidog and Spells

Several spells interact with Multidogs:

- **Pawgularity** transforms any card into a Multidog — effectively creating an extra one
- **Ball of Wish** (from Ball of Fortune) randomly transforms a card into a Multidog
- **Transmutation** can copy a Multidog into opponents' hands — but this actually helps them

Be thoughtful about Transmutation: copying a Multidog _gives_ opponents wildcards, which is
usually bad for you.

## Common Mistakes

### Playing It Too Early

The most common mistake. Beginners often drop Multidogs in the first few turns because they
can. Resist the urge — save them for when they matter.

### Forgetting Out-of-Turn Potential

A Multidog cannot be played out of turn (it has no Element/Value to match exactly). But after
someone plays a Multidog, your exact-match opportunities might open up since any card can
follow it.

### Hoarding Too Long

The opposite mistake: holding a Multidog forever and losing with it still in hand. If you
are in a tight spot and need to reduce your card count, play it.

## Quick Summary

- Multidog plays on anything and anything plays on it
- 4 copies in Standard deck — rare and valuable
- Save for when you have no other options or need to finish the game
- Avoid playing early when regular cards can do the job
- Pairs with Pawgularity and Ball of Wish for extra Multidog generation

For a complete card breakdown, visit the [Cards page](/en/game/cards).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_02_25_the_multidog_when_to_play_and_when_to_hold.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Мультипёс: Когда Играть и Когда Беречь'
pageTitle: 'Мультипёс: Когда Играть и Когда Беречь'
date: 2026-02-25
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

**Мультипёс** — самая универсальная карта в _Pawsome Elements_. Он принадлежит Элементу
Мультиматерия и может быть сыгран на любую карту. Любая карта может быть сыграна поверх
него. С **4 копиями** в стандартной колоде Мультипсы редки и ценны.

Но знать _когда_ его играть так же важно, как и иметь его на руке.

## Как работает Мультипёс

- Принадлежит Элементу **Мультиматерия**
- Играется поверх любой карты, независимо от Элемента или Значения
- Любая карта может быть сыграна поверх Мультипса
- Не имеет особого эффекта — его сила в чистой гибкости

## Когда играть Мультипса

### Когда вы застряли

Самое простое применение: у вас нет других играемых карт. Вместо взятия из колоды
сыграйте Мультипса, чтобы остаться в игре и сохранить низкое количество карт.

### Когда нужно финишировать

Если у вас 2 карты и одна — Мультипёс, он гарантирует выход из любой ситуации.
Сыграйте обычную карту, если возможно, и добейте Мультипсом. Или наоборот.

### Когда нужно сменить Элемент

Так как любая карта играется на Мультипса, его розыгрыш по сути сбрасывает стол. Это
полезно, когда текущий Элемент не совпадает с вашей рукой.

## Когда беречь Мультипса

### Когда есть другие играемые карты

Если можете совпасть по Элементу или Значению обычной картой — сохраните Мультипса.
Обычные карты расходны; Мультипсы — нет.

### В начале матча

В ранней игре, когда руки большие и вариантов много, использование Мультипса расточительно.
Скорее всего, он понадобится позже, когда рука уменьшится и варианты сузятся.

### Когда вы побеждаете

Если вы уже первый по карточному счёту, Мультипёс — страховка на будущее. Играть его
сейчас не даёт ничего, чего обычная карта не могла бы дать.

## Мультипёс и заклинания

Несколько заклинаний взаимодействуют с Мультипсами:

- **Сингупёсность** превращает любую карту в Мультипса — создавая дополнительный
- **Шар Желания** (из Шара Фортуны) случайно превращает карту в Мультипса
- **Трансмутация** может копировать Мультипса в руки противников — но это помогает _им_

Будьте осторожны с Трансмутацией: копирование Мультипса _даёт_ противникам вайлдкард.

## Частые ошибки

### Слишком ранний розыгрыш

Самая частая ошибка. Новички часто сбрасывают Мультипсов в первые ходы просто потому, что
могут. Сдержитесь — сохраните для момента, когда это действительно важно.

### Слишком долгое удержание

Обратная ошибка: беречь Мультипса вечно и проиграть с ним на руке. Если вы в трудной
ситуации и нужно уменьшить руку — играйте.

## Итоги

- Мультипёс играется на что угодно и что угодно играется на него
- 4 копии в стандартной колоде — редкий и ценный
- Берегите для безвыходных ситуаций или финиша
- Не играйте рано, когда обычные карты справляются
- Синергия с Сингупёсностью и Шаром Желания

Полный разбор карт — на странице [Карты](/ru/game/cards).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_02_25_* src/ru/news/blog/2026_02_25_*
```

---

## Task 5: "Standard vs Turbo: Understanding Card Sets in Pawsome Elements"

**SEO targets:** "pawsome elements card sets", "turbo mode card game"

**Files:**
- Create: `src/en/news/blog/2026_03_01_standard_vs_turbo_understanding_card_sets.md`
- Create: `src/ru/news/blog/2026_03_01_standard_vs_turbo_understanding_card_sets.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_01_standard_vs_turbo_understanding_card_sets.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Standard vs Turbo: Understanding Card Sets'
pageTitle: 'Standard vs Turbo: Understanding Card Sets in Pawsome Elements'
date: 2026-03-01
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

_Pawsome Elements_ uses shared decks — everyone draws from the same pool of cards. But not
every game uses the same deck. Two **card sets** are available: **Standard** and **Turbo**.
Understanding the difference helps you adapt your strategy.

## Standard Card Set

The Standard set is the full deck used in most game modes. It contains **91 cards**:

- **Basic cards**: Values 1-9 across Nature, Filth, and Arcane (2 copies each = 54 cards)
- **Special cards per Element**: Hydrant (1), Shaking (1), Trash Can Diving (1), Treat
  Hiding (2) = 15 special cards across 3 Elements
- **Multidog**: 4 copies
- **Ball of Fortune**: 4 copies
- **Hybrid cards**: Additional element-specific cards

Standard provides the widest variety of cards and the longest matches. There are more high-
value cards (6-9), which means more matching options and longer card chains.

## Turbo Card Set

The Turbo set is a reduced deck with **65 cards**:

- **Basic cards**: Values 1-5 only (no 6-9) across all three Elements (2 copies each = 30 cards)
- **Special cards**: Same as Standard (15 cards across 3 Elements)
- **Multidog**: 4 copies
- **Ball of Fortune**: 4 copies
- **Hybrid cards**: Additional element-specific cards

By removing values 6-9, Turbo creates faster, more aggressive games. Fewer basic cards means
special cards and wildcards appear more frequently, and matches resolve quicker.

## How Card Set Affects Strategy

### Value Range Matters

In Standard, matching by Value is easier because there are 9 possible values. In Turbo, only
5 values exist, which means:

- **Fewer Value matches** — you rely more on Element matching
- **More duplicate values** — exact-match out-of-turn plays become more common
- **Tighter games** — less room for strategic maneuvering

### Special Card Frequency

With fewer basic cards in Turbo, special cards make up a larger percentage of the deck. You
will encounter Hydrants, Shaking, Trash Can Diving, and Treat Hiding more often. This makes
Turbo more chaotic and unpredictable.

### Multidog and Ball of Fortune Impact

Both sets contain 4 Multidogs and 4 Balls of Fortune. In the smaller Turbo deck, these
represent a higher proportion of available cards, making them appear more frequently. This
amplifies the wildcard element.

## Which Set to Practice With

- **Standard** is better for learning fundamentals — the larger deck gives you more time to
  practice Element tracking, hand management, and spell timing.
- **Turbo** is better for practicing quick decisions — the faster pace forces you to think
  on your feet and adapt rapidly.

## Quick Summary

| Feature | Standard | Turbo |
|---------|----------|-------|
| Total cards | 91 | 65 |
| Value range | 1-9 | 1-5 |
| Match pace | Moderate | Fast |
| Special card frequency | Normal | Higher |
| Out-of-turn frequency | Normal | Higher |

Both card sets use the same rules and mechanics. The difference is pace and card distribution.
Choose the set that matches the experience you want.

For more on game mechanics, visit the [Gameplay page](/en/game/gameplay).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_01_standard_vs_turbo_understanding_card_sets.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Стандарт vs Турбо: Наборы Карт'
pageTitle: 'Стандарт vs Турбо: Наборы Карт в Pawsome Elements'
date: 2026-03-01
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

В _Pawsome Elements_ все тянут из общей колоды. Но не каждая игра использует одну и ту же
колоду. Доступны два **набора карт**: **Стандарт** и **Турбо**. Понимание разницы поможет
адаптировать стратегию.

## Стандартный набор

Полная колода для большинства режимов — **91 карта**:

- **Обычные карты**: Значения 1-9 во всех Элементах (по 2 копии = 54 карты)
- **Особые карты на Элемент**: Гидрант (1), Встряска (1), Мусорный Дайвинг (1),
  Прятки с Лакомством (2) = 15 особых на 3 Элемента
- **Мультипёс**: 4 копии
- **Шар Фортуны**: 4 копии

Стандарт даёт самый широкий выбор карт и более длинные матчи. Больше карт с высокими
значениями (6-9) означает больше вариантов совпадения.

## Набор Турбо

Уменьшенная колода — **65 карт**:

- **Обычные карты**: Только значения 1-5 (без 6-9, по 2 копии = 30 карт)
- **Особые карты**: Те же, что в Стандарте (15 карт)
- **Мультипёс**: 4 копии
- **Шар Фортуны**: 4 копии

Убрав значения 6-9, Турбо создаёт более быстрые и агрессивные игры. Меньше обычных
карт — особые карты и вайлдкарды появляются чаще, матчи заканчиваются быстрее.

## Как набор влияет на стратегию

### Диапазон значений

В Стандарте совпадение по Значению проще — 9 возможных значений. В Турбо только 5:

- **Меньше совпадений по Значению** — больше опоры на совпадение по Элементу
- **Больше дубликатов** — ходы вне очереди случаются чаще
- **Более плотные игры** — меньше пространства для манёвров

### Частота особых карт

С меньшим количеством обычных карт в Турбо особые карты составляют большую долю колоды.
Гидрант, Встряска, Мусорный Дайвинг и Прятки с Лакомством встречаются чаще. Турбо более
хаотичен и непредсказуем.

### Мультипёс и Шар Фортуны

Оба набора содержат по 4 Мультипса и 4 Шара Фортуны. В меньшей колоде Турбо они
составляют большую долю, появляясь чаще и усиливая элемент случайности.

## С каким набором тренироваться

- **Стандарт** — для изучения основ. Большая колода даёт больше времени на практику
  отслеживания Элементов, управления рукой и тайминга заклинаний.
- **Турбо** — для тренировки быстрых решений. Высокий темп заставляет думать на ходу.

## Итоги

| Параметр | Стандарт | Турбо |
|----------|----------|-------|
| Всего карт | 91 | 65 |
| Значения | 1-9 | 1-5 |
| Темп | Умеренный | Быстрый |
| Частота особых карт | Обычная | Повышенная |
| Ходы вне очереди | Обычные | Чаще |

Оба набора используют одни правила и механики. Разница — в темпе и распределении карт.

Подробнее о механиках — на странице [Геймплей](/ru/game/gameplay).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_03_01_* src/ru/news/blog/2026_03_01_*
```

---

## Task 6: "The Art of the Comeback: How to Win From Behind"

**SEO targets:** "card game comeback strategy", "how to win from behind in card games"

**Files:**
- Create: `src/en/news/blog/2026_03_04_the_art_of_the_comeback.md`
- Create: `src/ru/news/blog/2026_03_04_the_art_of_the_comeback.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_04_the_art_of_the_comeback.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | The Art of the Comeback: How to Win From Behind'
pageTitle: 'The Art of the Comeback: How to Win From Behind'
date: 2026-03-04
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

You are staring at a hand full of cards. Your opponents are down to 2-3 each. It looks
hopeless. But in _Pawsome Elements_, comebacks are not just possible — they happen all the
time. Here is how to turn a losing position into a win.

## Why Comebacks Are Common

Unlike many card games where falling behind is nearly irreversible, _Pawsome Elements_ has
built-in mechanics that create comeback opportunities:

- **Special cards** affect all opponents, letting you disrupt leaders
- **Spells** give you a powerful move regardless of your card situation
- **Out-of-turn play** lets you play extra cards between turns
- **Ball of Fortune** can completely reset your hand or disrupt the table
- **Hydrant** can transform opponents' carefully curated hands

## Step 1: Stop the Bleeding

When you are behind, the first priority is to stop drawing more cards. Play what you can
match, even if the card is not "optimal." Every card played is one fewer in your hand.

Do not hold cards for a perfect moment if you are falling further behind. Getting cards out
of your hand is more important than perfect timing.

## Step 2: Use Disruption Cards Aggressively

This is when Shaking and Hydrant shine. If opponents are close to finishing:

- **Shaking** gives everyone a card, narrowing the gap between you and the leaders
- **Hydrant** transforms their carefully held cards, potentially ruining their winning hand
- **Trash Can Diving** targets the player closest to winning

Do not save these for later — if opponents win before you use them, they are wasted.

## Step 3: Time Your Spell

Your spell is your strongest comeback tool. In a losing position:

- **Pawgularity** creates a guaranteed playable card
- **Unleashed Will** lets you play any card, bypassing matching rules
- **Fresh Scent** gives you a completely new hand if yours is unplayable
- **Transmutation** fills opponents' hands with copies of your worst cards

The timing is critical. Do not waste your spell when you still have playable cards. Save it
for the moment when it has maximum impact — ideally when it lets you play 2-3 cards in rapid
succession.

## Step 4: Hunt for Out-of-Turn Plays

When behind, every extra card you can play matters. Watch the pile constantly — if an opponent
plays a card that you can exactly match (same Element AND same Value), play it immediately.

Out-of-turn plays are the fastest way to reduce your hand outside your normal turn. In a
comeback scenario, landing even one out-of-turn play can close the gap significantly.

## Step 5: Accept the Risk

Comebacks require taking risks you would not normally take:

- Use **Ball of Luck** (if offered) to completely randomize your hand
- Use **Ball of Fate** to discard a random card even if you might lose something good
- Play aggressively rather than defensively

When you are in 4th place, playing safe guarantees a loss. Calculated risks are your only
path to victory.

## Remember: Top 3 Still Counts

In ranked matches, you do not need to finish 1st. If you are in last place, your immediate
goal is to pass one player and finish 3rd. That still earns you rating points.

Shift your focus from "winning" to "not losing" — and the comeback becomes much more
achievable.

## Quick Summary

1. Stop drawing — play any matchable card
2. Use disruption cards (Shaking, Hydrant) to slow leaders
3. Save your spell for maximum-impact moment
4. Hunt for out-of-turn plays
5. Take calculated risks — playing safe in last place guarantees a loss
6. In ranked, aim for top 3, not just 1st

For more strategy, visit the [Strategy Guide](/en/game/strategy).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_04_the_art_of_the_comeback.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Искусство Камбэка: Как Победить, Отставая'
pageTitle: 'Искусство Камбэка: Как Победить, Отставая'
date: 2026-03-04
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Вы смотрите на руку, полную карт. У противников по 2-3. Кажется безнадёжным. Но в _Pawsome
Elements_ камбэки — не просто возможны, а случаются постоянно. Вот как превратить
проигрышную позицию в победу.

## Почему камбэки часты

В отличие от многих карточных игр, где отставание необратимо, _Pawsome Elements_ имеет
встроенные механики для камбэков:

- **Особые карты** влияют на всех, позволяя мешать лидерам
- **Заклинания** дают мощный ход независимо от ситуации
- **Ходы вне очереди** позволяют играть дополнительные карты
- **Шар Фортуны** может полностью перезагрузить руку или нарушить стол
- **Гидрант** может превратить тщательно собранные руки противников

## Шаг 1: Остановите падение

Когда вы отстаёте, приоритет — перестать брать карты. Играйте всё, что совпадает, даже
если карта не «оптимальна». Каждая сыгранная карта — на одну меньше в руке.

Не держите карты ради идеального момента, если отстаёте всё дальше. Избавление от карт
важнее идеального тайминга.

## Шаг 2: Используйте карты помех агрессивно

Здесь Встряска и Гидрант сияют. Если противники близки к финишу:

- **Встряска** даёт всем по карте, сокращая разрыв
- **Гидрант** превращает их тщательно сохранённые карты
- **Мусорный Дайвинг** целит в ближайшего к победе

Не берегите — если противники победят раньше, карты помех пропадут зря.

## Шаг 3: Рассчитайте заклинание

Заклинание — ваш сильнейший инструмент камбэка:

- **Сингупёсность** создаёт гарантированно играемую карту
- **Освобождённая Воля** позволяет сыграть что угодно
- **Свежесть** даёт полностью новую руку
- **Трансмутация** заполняет руки противников копиями вашей худшей карты

Тайминг критичен. Не тратьте заклинание, когда есть играемые карты. Сохраните для момента
максимального воздействия.

## Шаг 4: Ищите ходы вне очереди

Когда отстаёте, каждая дополнительная карта важна. Следите за столом — если кто-то
сыграл карту, которую вы можете точно совпасть (тот же Элемент И Значение), играйте
немедленно.

Ходы вне очереди — самый быстрый способ уменьшить руку вне обычного хода.

## Шаг 5: Примите риск

Камбэк требует рисков, которые вы обычно не берёте:

- Используйте **Шар Удачи** для полной рандомизации руки
- Используйте **Шар Судьбы** для сброса случайной карты
- Играйте агрессивно, а не оборонительно

На последнем месте осторожная игра гарантирует проигрыш. Рассчитанные риски — ваш
единственный путь.

## Помните: топ-3 тоже считается

В рейтинговых матчах не обязательно быть первым. На последнем месте цель — обойти хотя
бы одного и стать третьим. Это всё ещё приносит рейтинг.

Сместите фокус с «победить» на «не проиграть» — и камбэк станет гораздо реальнее.

## Итоги

1. Перестаньте брать — играйте любые совпадающие карты
2. Используйте помехи (Встряска, Гидрант) для замедления лидеров
3. Сохраните заклинание для максимального эффекта
4. Ищите ходы вне очереди
5. Рискуйте — осторожная игра на последнем месте = гарантированный проигрыш
6. В рейтинге целье в топ-3, не только в 1-е место

Больше стратегий — в [Стратегиях](/ru/game/strategy).
```

**Step 3: Verify build and commit**

```bash
npm run build
git add src/en/news/blog/2026_03_04_* src/ru/news/blog/2026_03_04_*
```

---

## Task 7: "Practice Mode vs Quick Match: Where Should You Train?"

**SEO targets:** "pawsome elements game modes", "practice vs casual card game"

**Files:**
- Create: `src/en/news/blog/2026_03_08_practice_mode_vs_quick_match.md`
- Create: `src/ru/news/blog/2026_03_08_practice_mode_vs_quick_match.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_08_practice_mode_vs_quick_match.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Practice Mode vs Quick Match: Where Should You Train?'
pageTitle: 'Practice Mode vs Quick Match: Where Should You Train?'
date: 2026-03-08
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Before jumping into ranked matches, smart players practice. _Pawsome Elements_ offers two
non-ranked modes for training: **Practice Mode** and **Quick Match**. Each has its strengths,
and knowing when to use each will help you improve faster.

## Practice Mode

Practice Mode is a **solo experience** against AI bots. The bots are set to a lower
difficulty, making this the ideal environment for learning.

### What Practice Mode Is Good For

- **Learning the rules** — Understand card matching, spell timing, and special card effects
  without the pressure of real opponents.
- **Testing new spells** — Equip a spell you have never used and practice its timing and
  interactions.
- **Understanding card flow** — See how Elements cycle, how the deck thins, and how special
  cards affect the game state.

### Limitations

- **Bots are predictable** — They do not play like humans. Strategies that work against bots
  may fail against real players.
- **No multiplayer dynamics** — You cannot practice reading real opponents or adapting to
  human behavior.
- **Lower stakes, lower intensity** — Without real competition, it is easy to play passively
  and develop habits that do not transfer to ranked.

## Quick Match

Quick Match is a **casual multiplayer mode** supporting up to 6 players. Real players are
matched together, and if not enough humans are available, bots fill the remaining spots after
a short wait. The bots in Quick Match are more challenging than in Practice Mode.

### What Quick Match Is Good For

- **Playing against real opponents** — Human players are unpredictable, creative, and
  adaptive. This is the closest experience to ranked without the rating pressure.
- **Practicing in multiplayer** — Learn to read multiple opponents, manage disruption cards
  in crowded matches, and handle chaos.
- **Testing strategies before ranked** — Try new spell choices, card timing approaches, or
  comeback techniques without risking your rating.
- **Larger player counts** — Up to 6 players means more variables, more chaos, and more
  opportunities to learn.

### Limitations

- **No rating impact** — If you want to improve your rank, you need to play ranked.
- **Variable skill levels** — You may face complete beginners or experienced players.
  Inconsistent competition makes it harder to gauge your progress.

## When to Use Each Mode

| Goal | Best Mode |
|------|-----------|
| Learn the basics for the first time | Practice |
| Test a new spell | Practice → Quick Match |
| Practice against real opponents | Quick Match |
| Prepare for ranked | Quick Match |
| Warm up before a ranked session | Quick Match |
| Experiment with unusual strategies | Quick Match |

## The Ideal Training Path

1. **Start in Practice Mode** — Learn card matching, spell mechanics, and special cards.
2. **Move to Quick Match** — Play against real humans to learn reading opponents.
3. **Enter Ranked** — Apply what you have learned in competitive 4-player matches.

Even experienced players benefit from returning to Quick Match to test new ideas before
bringing them to ranked.

For more on game modes, visit the [Gameplay page](/en/game/gameplay).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_08_practice_mode_vs_quick_match.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Тренировка vs Быстрый Матч: Где Лучше Учиться?'
pageTitle: 'Тренировка vs Быстрый Матч: Где Лучше Учиться?'
date: 2026-03-08
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Прежде чем идти в рейтинг, умные игроки тренируются. _Pawsome Elements_ предлагает два
нерейтинговых режима: **Тренировка** и **Быстрый Матч**. У каждого свои преимущества.

## Тренировка

Тренировка — **соло-режим** против ИИ-ботов. Боты играют на пониженной сложности, создавая
идеальную среду для обучения.

### Для чего подходит

- **Изучение правил** — совпадение карт, тайминг заклинаний, эффекты особых карт без
  давления реальных противников.
- **Тест новых заклинаний** — экипируйте незнакомое заклинание и практикуйте его.
- **Понимание потока карт** — как циклируются Элементы, как тоньшает колода, как влияют
  особые карты.

### Ограничения

- **Боты предсказуемы** — стратегии против ботов могут не работать против людей.
- **Нет динамики мультиплеера** — нельзя тренировать чтение реальных противников.
- **Низкие ставки** — без конкуренции легко развить привычки, которые не работают в рейтинге.

## Быстрый Матч

Быстрый Матч — **казуальный мультиплеер** до 6 игроков. Реальные игроки матчатся вместе,
и если людей не хватает, боты заполняют места через короткое время. Боты в Быстром Матче
сложнее, чем в Тренировке.

### Для чего подходит

- **Игра против реальных людей** — непредсказуемые, креативные, адаптивные противники.
- **Мультиплеерная практика** — чтение нескольких противников, управление хаосом.
- **Тест стратегий перед рейтингом** — новые заклинания и тактики без риска для рейтинга.
- **Большее число игроков** — до 6 игроков означает больше хаоса и возможностей учиться.

### Ограничения

- **Не влияет на рейтинг** — для повышения ранга нужен рейтинговый режим.
- **Разный уровень игроков** — можете встретить как новичков, так и опытных игроков.

## Когда использовать

| Цель | Лучший режим |
|------|-------------|
| Первое знакомство с игрой | Тренировка |
| Тест нового заклинания | Тренировка → Быстрый Матч |
| Игра против реальных людей | Быстрый Матч |
| Подготовка к рейтингу | Быстрый Матч |
| Разминка перед рейтинговой сессией | Быстрый Матч |
| Эксперименты с необычными стратегиями | Быстрый Матч |

## Идеальный путь тренировки

1. **Начните с Тренировки** — изучите совпадение карт, заклинания и особые карты.
2. **Перейдите в Быстрый Матч** — играйте против реальных людей.
3. **Войдите в Рейтинг** — применяйте изученное в соревновательных матчах на 4 игроков.

Даже опытные игроки возвращаются в Быстрый Матч для теста новых идей.

Подробнее о режимах — на странице [Геймплей](/ru/game/gameplay).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_03_08_* src/ru/news/blog/2026_03_08_*
```

---

## Task 8: "How to Play with Friends: Room Mode Guide"

**SEO targets:** "play card games with friends online", "pawsome elements room mode"

**Files:**
- Create: `src/en/news/blog/2026_03_11_how_to_play_with_friends_room_mode_guide.md`
- Create: `src/ru/news/blog/2026_03_11_how_to_play_with_friends_room_mode_guide.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_11_how_to_play_with_friends_room_mode_guide.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | How to Play with Friends: Room Mode Guide'
pageTitle: 'How to Play with Friends: Room Mode Guide'
date: 2026-03-11
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Want to play _Pawsome Elements_ with friends? **Room Mode** lets you create custom games,
invite players, add bots, and control who plays. It is the best way to enjoy the game with
people you know.

## What Is Room Mode?

Room Mode is a custom game lobby where you set the rules. As the host, you can:

- Create a **public or private** room
- **Invite friends** to join
- **Add bots** to fill empty slots
- **Kick players** if needed
- Start the game when everyone is ready

There is no rating impact — Room Mode is purely for fun and practice.

## How to Create a Room

1. Select **Room** from the game mode menu
2. Choose whether the room is **public** (anyone can join) or **private** (invite only)
3. Share the room code or invite link with friends
4. Wait for players to join
5. Optionally add bots to fill remaining slots
6. Start the game when ready

## Adding Bots

If you do not have enough friends online, you can add AI bots to fill the room. Bots in Room
Mode provide a challenge and keep the game moving. The host can add bots at any time before
the game starts.

## Public vs Private Rooms

- **Public rooms** are visible to all players. Anyone looking for a game can join your room.
  Great if you want to meet new players.
- **Private rooms** require an invite code. Only people with the code can join. Perfect for
  playing exclusively with friends.

## Room Mode vs Other Modes

| Feature | Room Mode | Quick Match | Ranked |
|---------|-----------|-------------|--------|
| Player control | Full | None | None |
| Add bots | Manual | Automatic | Automatic |
| Rating impact | None | None | Yes |
| Max players | Flexible | Up to 6 | 4 |
| Kick players | Yes | No | No |

## Tips for Room Mode

- **Mix bots and humans** for a good balance of challenge and social play
- **Use Room Mode to teach new players** — the low-pressure environment is perfect for
  explaining mechanics
- **Practice team strategies** — try coordinated plays with friends before taking them
  to Quick Match or Ranked
- **Host regular game nights** — Room Mode is perfect for recurring play sessions with a
  consistent group

## Get Started

Room Mode is available to all players. Create a room, invite your friends, and start playing.
No ranking, no pressure — just fun card battles with people you enjoy playing with.

For more on all game modes, visit the [Gameplay page](/en/game/gameplay).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_11_how_to_play_with_friends_room_mode_guide.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Как Играть с Друзьями: Гайд по Режиму Комнат'
pageTitle: 'Как Играть с Друзьями: Гайд по Режиму Комнат'
date: 2026-03-11
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Хотите сыграть в _Pawsome Elements_ с друзьями? **Режим Комнат** позволяет создавать
свои игры, приглашать людей, добавлять ботов и контролировать, кто играет. Лучший способ
насладиться игрой с теми, кого вы знаете.

## Что такое Режим Комнат?

Режим Комнат — пользовательское лобби, где вы задаёте правила. Как хост, вы можете:

- Создать **публичную или приватную** комнату
- **Пригласить друзей**
- **Добавить ботов** для заполнения мест
- **Кикнуть игроков** при необходимости
- Запустить игру, когда все готовы

Никакого влияния на рейтинг — Режим Комнат чисто для удовольствия и практики.

## Как создать комнату

1. Выберите **Комната** в меню игровых режимов
2. Выберите **публичную** (видна всем) или **приватную** (только по приглашению)
3. Поделитесь кодом комнаты или ссылкой-приглашением
4. Дождитесь игроков
5. При желании добавьте ботов
6. Запустите игру

## Добавление ботов

Если друзей недостаточно, добавьте ИИ-ботов. Боты обеспечивают вызов и поддерживают
темп игры. Хост может добавлять ботов в любое время до начала.

## Публичные vs приватные комнаты

- **Публичные** — видны всем игрокам. Любой может присоединиться. Отлично для знакомства.
- **Приватные** — требуют код. Только люди с кодом могут войти. Идеально для игры
  исключительно с друзьями.

## Сравнение с другими режимами

| Параметр | Комнаты | Быстрый Матч | Рейтинг |
|----------|---------|-------------|---------|
| Контроль | Полный | Нет | Нет |
| Добавить ботов | Вручную | Автоматически | Автоматически |
| Влияние на рейтинг | Нет | Нет | Да |
| Макс. игроков | Гибко | До 6 | 4 |
| Кик игроков | Да | Нет | Нет |

## Советы для Режима Комнат

- **Смешивайте ботов и людей** — баланс вызова и общения
- **Учите новичков** — низкое давление идеально для объяснения механик
- **Тренируйте стратегии** — пробуйте координированные приёмы с друзьями
- **Организуйте регулярные вечера** — идеально для постоянных игровых сессий

## Начинайте играть

Режим Комнат доступен всем. Создайте комнату, пригласите друзей и начните играть.
Никакого рейтинга, никакого давления — только весёлые карточные битвы.

Подробнее о режимах — на странице [Геймплей](/ru/game/gameplay).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_03_11_* src/ru/news/blog/2026_03_11_*
```

---

## Task 9: "5 Mistakes Every New Pawsome Elements Player Makes"

**SEO targets:** "card game beginner mistakes", "pawsome elements tips for beginners"

**Files:**
- Create: `src/en/news/blog/2026_03_15_five_mistakes_every_new_player_makes.md`
- Create: `src/ru/news/blog/2026_03_15_five_mistakes_every_new_player_makes.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_15_five_mistakes_every_new_player_makes.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | 5 Mistakes Every New Player Makes'
pageTitle: '5 Mistakes Every New Player Makes'
date: 2026-03-15
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Starting out in _Pawsome Elements_? You are not alone in making these mistakes. Every player
goes through them — but the sooner you recognize them, the faster you improve.

## Mistake 1: Playing the Multidog Too Early

The Multidog is the most powerful card in the game. It plays on anything and anything plays on
it. New players tend to drop it in the first few turns because they can.

**Why it is wrong:** Early in the match, you usually have plenty of matchable cards. Using
a Multidog now wastes a guaranteed escape card for later when your hand is small and options
are limited.

**The fix:** Hold Multidogs until you genuinely have no other playable cards, or until playing
it will let you win.

## Mistake 2: Ignoring Out-of-Turn Play

Many beginners do not realize they can play a card outside their turn. If you hold a card that
is an **exact match** (same Element AND Value) to the top of the pile, you can play it
immediately — even during someone else's turn.

**Why it matters:** Out-of-turn plays let you play extra cards, skip opponents, and finish
faster. Players who use this mechanic consistently have a significant advantage.

**The fix:** Check your hand every time the pile changes. Not just on your turn — every time
any card is played.

## Mistake 3: Wasting Your Spell

Spells have a cooldown of 3 turns. Using your spell just because you can, without a clear
strategic reason, leaves you without it when you actually need it.

**Why it is wrong:** In the 3 turns after using your spell, you are completely without your
most powerful tool. If a critical moment comes during that window, you have no backup.

**The fix:** Ask yourself before every spell: "Would I rather have this spell available for
the next 3 turns, or use it now?" Only cast when the answer is clearly "now."

## Mistake 4: Not Watching Opponent Card Counts

New players focus entirely on their own hand and ignore what is happening around the table.
But knowing how many cards each opponent holds changes your decisions.

**Why it matters:** A player with 1-2 cards is about to win. That is when you should use
disruption cards (Shaking, Hydrant) to slow them down. A player with many cards is not an
immediate threat.

**The fix:** Glance at opponent card counts regularly. Prioritize disrupting players who are
closest to winning.

## Mistake 5: Ignoring Treat Hiding

Treat Hiding reduces your spell cooldown by 1 turn. Many beginners see it as a boring card
with no immediate impact and prioritize other plays.

**Why it is wrong:** Treat Hiding compounds over time. Playing 2-3 Treat Hidings during a
match can mean an extra spell use — which can be game-deciding.

**The fix:** When you can match a Treat Hiding by Element or Value, play it. The cooldown
reduction adds up, especially with spell-heavy strategies like Pawgularity or Transmutation.

## The Fastest Way to Improve

Eliminating these five mistakes will not make you a master overnight, but it will immediately
improve your win rate. Focus on one mistake at a time, and within a few sessions, these fixes
will become second nature.

For a complete beginner guide, visit the [Beginner's Guide](/en/game/beginners-guide).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_15_five_mistakes_every_new_player_makes.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | 5 Ошибок Каждого Новичка'
pageTitle: '5 Ошибок Каждого Новичка в Pawsome Elements'
date: 2026-03-15
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Только начинаете в _Pawsome Elements_? Вы не одиноки в этих ошибках. Каждый проходит через
них — но чем раньше осознаете, тем быстрее станете лучше.

## Ошибка 1: Слишком ранний розыгрыш Мультипса

Мультипёс — самая мощная карта. Играется на что угодно. Новички часто сбрасывают его в
первые ходы просто потому, что могут.

**Почему неправильно:** В начале матча обычно много играемых карт. Мультипёс сейчас — это
потерянная гарантия выхода из тупика позже.

**Исправление:** Берегите Мультипсов, пока нет других вариантов или пока розыгрыш не
приведёт к победе.

## Ошибка 2: Игнорирование хода вне очереди

Многие новички не знают, что можно сыграть карту не в свой ход. Если у вас **точное
совпадение** (тот же Элемент И Значение) с верхней картой — можно сыграть немедленно.

**Почему важно:** Ходы вне очереди позволяют играть дополнительные карты, пропускать
противников и финишировать быстрее. Значительное преимущество.

**Исправление:** Проверяйте руку каждый раз, когда меняется верхняя карта. Не только в
свой ход — при каждом розыгрыше.

## Ошибка 3: Трата заклинания впустую

У заклинаний перезарядка 3 хода. Использование без чёткой причины оставляет вас без
сильнейшего инструмента, когда он действительно нужен.

**Почему неправильно:** 3 хода без заклинания — это окно уязвимости. Если критический
момент придёт в это время — запасного плана нет.

**Исправление:** Перед каждым заклинанием: «Хочу ли я иметь его доступным следующие 3
хода или использовать сейчас?» Активируйте, только если ответ однозначно «сейчас».

## Ошибка 4: Невнимание к количеству карт противников

Новички фокусируются только на своей руке, игнорируя стол. Но знание, сколько карт у
каждого, меняет решения.

**Почему важно:** Игрок с 1-2 картами вот-вот победит. Время для помех (Встряска,
Гидрант). Игрок с большой рукой — не угроза прямо сейчас.

**Исправление:** Регулярно проверяйте счёт карт противников. Мешайте тем, кто ближе
к победе.

## Ошибка 5: Игнорирование Пряток с Лакомством

Прятки с Лакомством уменьшают перезарядку заклинания на 1 ход. Многие считают эту карту
скучной и откладывают.

**Почему неправильно:** Эффект накапливается. 2-3 Прятки за матч — это дополнительное
использование заклинания. Это может решить исход.

**Исправление:** Когда можете совпасть Прятки по Элементу или Значению — играйте.
Уменьшение перезарядки суммируется.

## Самый быстрый путь к улучшению

Устранение этих пяти ошибок не сделает вас мастером за ночь, но немедленно улучшит
процент побед. Работайте над одной ошибкой за раз, и через несколько сессий исправления
станут второй натурой.

Полное руководство для начинающих — в [Гайде для Новичков](/ru/game/beginners-guide).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_03_15_* src/ru/news/blog/2026_03_15_*
```

---

## Task 10: "The World of Keta: The Lore Behind Pawsome Elements"

**SEO targets:** "pawsome elements lore", "keta world card game story"

**Files:**
- Create: `src/en/news/blog/2026_03_18_the_world_of_keta.md`
- Create: `src/ru/news/blog/2026_03_18_the_world_of_keta.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_18_the_world_of_keta.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | The World of Keta: The Lore Behind the Game'
pageTitle: 'The World of Keta: The Lore Behind Pawsome Elements'
date: 2026-03-18
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Behind every card, spell, and match in _Pawsome Elements_ lies a rich world with its own
history, characters, and mysteries. Welcome to **Keta** — a land shaped by magic, ambition,
and a catastrophe that changed everything.

## The World Before

Over a thousand years ago, dogs were not pets. They were the **dominant civilization** of
Keta — builders, scientists, philosophers, and explorers. They constructed great cities,
developed complex technologies, and lived in balance with the natural world.

Life was good. Stable. Ordered.

That is, until the Root appeared.

## The Enchanter Root

One day, without warning, a glowing tree grew overnight in the quiet city of **Barkswille**.
It pulsed with energy — a strange, raw power that defied every known law of nature. No one
knew where it came from or what it wanted.

The dogs called it the **Enchanter Root**.

At first, authorities tried to contain it. They built barriers, set guards, restricted access.
They debated. They studied. They argued.

But curiosity — and ambition — won out.

## The Shatter

The moment the first dog touched the Enchanter Root, everything changed.

Magic flooded into the world. Uncontrollable, wild, raw magic that shattered the foundations
of dog civilization. Cities crumbled. Alliances broke. Entire regions vanished into mist.

This catastrophe became known as **the Shatter** — and its effects still ripple through
Keta to this day.

The magic released by the Root did not follow rules. It bonded to bloodlines, hid in ruins,
and scattered across the land in unpredictable forms. The ordered world of the dogs was
replaced by chaos, fragmented power, and a new reality where magic was everywhere but
understood by no one.

## The Three Elements

The magic that emerged from the Shatter took three distinct forms — the **Elements** that
define the game:

- **Nature** — organic, earthy energy tied to the living world
- **Filth** — gritty, chaotic energy born from disorder and transformation
- **Arcane** — refined, mystical energy channeled through knowledge and will

These three Elements are the building blocks of every card in _Pawsome Elements_. When you
play a Nature card or cast an Arcane spell, you are wielding the same forces that the Shatter
unleashed.

## The World Today

Keta is a changed land. The great cities are gone. The old order is forgotten. But fragments
of magic remain — passed through bloodlines, hidden in old ruins, taught by sages.

New challengers have risen. Players who gather these fragments, master the Elements, and
compete to prove their skill. That is the world you step into every time you play _Pawsome
Elements_.

## Characters of Keta

Several legendary figures from the time of the Shatter still influence Keta:

- **Ruffini the Great** — believed to be the first dog to touch the Enchanter Root. His
  teachings echo through magical artifacts.
- **Captain Paw** — founder of the Crimson Fur Order, a military organization that tried to
  restore order after the Shatter.
- **Priest Woofried** — the guide who explains Elements and spells to new challengers.
- **Savvini the Elusive** — a mysterious figure whose experiments and messages are scattered
  throughout the Atlas.

Their stories are woven into the game — in the Atlas, in special events, and in the very
magic you wield.

## Why Lore Matters

Understanding the lore does not give you a gameplay advantage. But it adds meaning to every
match, every spell, and every Element you play. The cards are not just numbers and colors —
they are fragments of a world that was broken and rebuilt by magic.

Want to learn more? Follow our community channels for lore reveals, character spotlights, and
story updates as the world of Keta continues to unfold.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_18_the_world_of_keta.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Мир Кеты: Лор Игры'
pageTitle: 'Мир Кеты: Лор Pawsome Elements'
date: 2026-03-18
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

За каждой картой, заклинанием и матчем в _Pawsome Elements_ стоит богатый мир с собственной
историей, персонажами и тайнами. Добро пожаловать в **Кету** — землю, формированную магией,
амбициями и катастрофой, изменившей всё.

## Мир до Разлома

Более тысячи лет назад собаки не были домашними питомцами. Они были **доминирующей
цивилизацией** Кеты — строители, учёные, философы и исследователи. Они возводили великие
города, развивали технологии и жили в гармонии с природой.

Жизнь была хорошей. Стабильной. Упорядоченной.

Пока не появился Корень.

## Корень Волшебника

Однажды, без предупреждения, в тихом городе **Барксвилль** за ночь выросло светящееся
дерево. Оно пульсировало энергией — странной, сырой силой, нарушающей все законы природы.

Собаки назвали его **Корнем Волшебника**.

Сначала власти пытались его сдержать. Строили барьеры, выставляли охрану, ограничивали
доступ. Спорили, изучали, обсуждали.

Но любопытство — и амбиции — победили.

## Разлом

В момент, когда первая собака коснулась Корня Волшебника, всё изменилось.

Магия хлынула в мир. Неконтролируемая, дикая, сырая магия, разрушившая основы цивилизации
собак. Города рухнули. Союзы распались. Целые регионы исчезли в тумане.

Эта катастрофа стала известна как **Разлом** — и его последствия отзываются в Кете
до сих пор.

Магия, освобождённая Корнем, не подчинялась правилам. Она привязалась к родословным,
спряталась в руинах и разлетелась по земле в непредсказуемых формах.

## Три Элемента

Магия, возникшая из Разлома, приняла три формы — **Элементы**, определяющие игру:

- **Природа** — органическая, земная энергия, связанная с живым миром
- **Скверна** — грубая, хаотичная энергия, рождённая из беспорядка и трансформации
- **Аркана** — утончённая, мистическая энергия, направляемая знанием и волей

Когда вы играете карту Природы или применяете заклинание Арканы — вы используете те же
силы, которые высвободил Разлом.

## Мир сегодня

Кета изменилась. Великие города исчезли. Старый порядок забыт. Но фрагменты магии
остались — передаются по крови, скрыты в руинах, преподаются мудрецами.

Появились новые претенденты — игроки, собирающие эти фрагменты, овладевающие Элементами
и соревнующиеся за мастерство.

## Персонажи Кеты

Легендарные фигуры времён Разлома всё ещё влияют на мир:

- **Руффини Великий** — считается первой собакой, коснувшейся Корня. Его учения живут
  в магических артефактах.
- **Капитан Лапа** — основатель Ордена Алого Меха, пытавшегося восстановить порядок.
- **Священник Вуфрид** — наставник, объясняющий Элементы и заклинания новым претендентам.
- **Саввини Неуловимый** — загадочная фигура, чьи эксперименты разбросаны по Атласу.

Их истории вплетены в игру — в Атласе, в событиях и в самой магии, которой вы владеете.

## Почему лор важен

Знание лора не даёт игрового преимущества. Но оно придаёт смысл каждому матчу, каждому
заклинанию и каждому Элементу. Карты — не просто числа и цвета. Это фрагменты мира,
разрушенного и перестроенного магией.

Следите за нашими каналами для раскрытия лора и историй мира Кеты.
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_03_18_* src/ru/news/blog/2026_03_18_*
```

---

## Task 11: "Ruffini the Great: The Legend Who Started It All"

**SEO targets:** "pawsome elements characters", "ruffini the great lore"

**Files:**
- Create: `src/en/news/blog/2026_03_22_ruffini_the_great.md`
- Create: `src/ru/news/blog/2026_03_22_ruffini_the_great.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_22_ruffini_the_great.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Ruffini the Great: The Legend Who Started It All'
pageTitle: 'Ruffini the Great: The Legend Who Started It All'
date: 2026-03-22
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

In the world of Keta, no name carries more weight than **Ruffini the Great** — the first dog
believed to have touched the Enchanter Root and unleashed magic into the world.

## Who Was Ruffini?

Before the Shatter, Ruffini was a scholar and philosopher in the great dog civilization. When
the Enchanter Root appeared overnight in Barkswille, pulsing with unknown energy, Ruffini was
among the first to study it.

While others debated containment and safety, Ruffini was driven by something deeper —
curiosity, ambition, or perhaps something the Root itself called out in him.

He touched the Enchanter Root.

And the world was never the same.

## The First Touch

The moment Ruffini made contact with the Root, magic exploded outward. Not in a controlled
release, but in a wave of raw, untamed energy that tore through Barkswille and spread across
Keta. This event — the **Shatter** — ended the old civilization and birthed the magical world
that exists today.

Whether Ruffini intended to trigger the Shatter or was simply the first to yield to the Root's
pull, no one knows for certain. The histories that survived are fragmented, contradictory,
and often mythologized.

## His Legacy

Ruffini's teachings, symbols, and philosophies survived the Shatter in scattered forms:

- **Magical artifacts** found throughout Keta bear his markings
- **Ancient texts** reference his theories on the nature of magic
- **The three Elements** — Nature, Filth, and Arcane — are said to reflect his understanding
  of the Root's power

Some legends claim Ruffini did not perish in the Shatter. They say he still walks the hidden
corners of Keta — in places most pups dare not go.

## Ruffini in the Game

While Ruffini does not appear directly in standard gameplay, his influence is woven into the
fabric of _Pawsome Elements_:

- The **Atlas** contains echoes of his research
- The **Elements system** reflects his documented understanding of magical forces
- Special events and hidden discoveries may reference his journey

For players who look closely, Ruffini's presence is everywhere — in the cards you play, the
spells you cast, and the very rules that govern the game.

## A Figure of Debate

Was Ruffini a hero who unlocked the potential of magic? Or a reckless scholar who destroyed a
civilization? The world of Keta has never agreed. Some see him as a visionary. Others see him
as a cautionary tale.

What is certain is this: without Ruffini's first touch, there would be no Elements, no spells,
and no _Pawsome Elements_.

Stay tuned for more character spotlights and lore reveals on our community channels.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_22_ruffini_the_great.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Руффини Великий: Легенда, С Которой Всё Началось'
pageTitle: 'Руффини Великий: Легенда, С Которой Всё Началось'
date: 2026-03-22
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

В мире Кеты ни одно имя не несёт такого веса, как **Руффини Великий** — первая собака,
коснувшаяся Корня Волшебника и выпустившая магию в мир.

## Кем был Руффини?

До Разлома Руффини был учёным и философом великой цивилизации собак. Когда Корень
Волшебника появился за ночь в Барксвилле, пульсируя неизвестной энергией, Руффини был
среди первых, кто начал его изучать.

Пока другие спорили о сдерживании и безопасности, Руффини двигало нечто глубокое —
любопытство, амбиции, или, возможно, сам Корень звал его.

Он коснулся Корня Волшебника.

И мир уже никогда не стал прежним.

## Первое касание

В момент контакта Руффини с Корнем магия взорвалась наружу. Не контролируемый выброс, а
волна дикой, необузданной энергии, пронёсшаяся через Барксвилль и по всей Кете. Это
событие — **Разлом** — положило конец старой цивилизации и породило магический мир.

Намеревался ли Руффини вызвать Разлом или просто первым поддался зову Корня — никто
не знает наверняка. Сохранившиеся истории фрагментарны и противоречивы.

## Его наследие

Учения, символы и философия Руффини пережили Разлом в разрозненных формах:

- **Магические артефакты** по всей Кете несут его отметки
- **Древние тексты** ссылаются на его теории о природе магии
- **Три Элемента** — Природа, Скверна и Аркана — считаются отражением его понимания
  силы Корня

Некоторые легенды утверждают, что Руффини не погиб в Разломе. Говорят, он до сих пор
бродит по скрытым уголкам Кеты — в местах, куда большинство щенков не рискуют заходить.

## Руффини в игре

Руффини не появляется напрямую в стандартном геймплее, но его влияние вплетено
в ткань _Pawsome Elements_:

- **Атлас** содержит отголоски его исследований
- **Система Элементов** отражает его понимание магических сил
- Особые события могут содержать ссылки на его путешествие

Для внимательных игроков присутствие Руффини повсюду — в картах, заклинаниях и самих
правилах игры.

## Фигура споров

Был ли Руффини героем, раскрывшим потенциал магии? Или безрассудным учёным, уничтожившим
цивилизацию? Мир Кеты так и не пришёл к согласию.

Одно несомненно: без первого касания Руффини не было бы Элементов, заклинаний и
_Pawsome Elements_.

Следите за нашими каналами для новых историй персонажей и раскрытия лора.
```

**Step 3: Verify build and commit**

```bash
npm run build
git add src/en/news/blog/2026_03_22_* src/ru/news/blog/2026_03_22_*
```

---

## Task 12: "The Crimson Fur Order: Captain Paw's Legacy"

**SEO targets:** "pawsome elements captain paw", "crimson fur order lore"

**Files:**
- Create: `src/en/news/blog/2026_03_25_the_crimson_fur_order.md`
- Create: `src/ru/news/blog/2026_03_25_the_crimson_fur_order.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_25_the_crimson_fur_order.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | The Crimson Fur Order: Captain Paw''s Legacy'
pageTitle: 'The Crimson Fur Order: Captain Paw''s Legacy'
date: 2026-03-25
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

When the Shatter tore through Keta and the old civilization crumbled, chaos reigned. But in
the aftermath, one dog rose to impose order on the madness. His name was **Captain Paw**, and
the organization he founded — the **Crimson Fur Order** — became a beacon of structure in a
broken world.

## The Founding

In the years following the Shatter, Keta was fragmented. Magic ran wild, communities were
isolated, and the knowledge of the old world was rapidly fading. Captain Paw, a military
strategist from the pre-Shatter era, gathered loyal followers and established the Crimson Fur
Order with a clear mission: **restore order and protect what remained**.

The Order was not about controlling magic — it was about surviving it.

## What the Crimson Fur Order Stood For

Captain Paw's Order operated on three principles:

- **Discipline** — In a world of chaos, structure was survival
- **Protection** — Shielding communities from the unpredictable effects of wild magic
- **Preservation** — Saving the knowledge and artifacts of the old civilization

While other groups hoarded magic or fought over fragments of power, the Crimson Fur Order
focused on stability and the common good.

## Captain Paw's Approach

Unlike Ruffini, who sought to understand magic through study, Captain Paw was pragmatic.
He did not care about the nature of the Elements or the philosophy of the Root. He cared
about results: safe communities, functional supply chains, and trained defenders who could
handle magical threats.

This practical approach made the Order effective — but it also put them at odds with
scholars and mystics who believed magic should be explored, not contained.

## The Order's Influence Today

The Crimson Fur Order eventually faded as Keta evolved, but its legacy is everywhere:

- **Ranked Mode** echoes the Order's competitive discipline — structured, fair, merit-based
- **The rating system** rewards consistency over raw power, reflecting Captain Paw's belief
  in steady competence
- If you dig deep into Ranked Mode or explore certain events, you might feel his watchful
  eye — or receive a challenge in his name

## Captain Paw vs. Ruffini

The contrast between these two figures defines much of Keta's history:

| | Ruffini the Great | Captain Paw |
|---|---|---|
| Approach | Curiosity and exploration | Discipline and order |
| Goal | Understand magic | Survive magic |
| Legacy | Unleashed the Elements | Built structure in chaos |
| Philosophy | Knowledge first | Safety first |

Both shaped the world of _Pawsome Elements_ — one through discovery, the other through
leadership.

## Discover More

Captain Paw's story intersects with other legendary figures — General Rags, Major Tumbox,
and others whose records survive in fragments. Their stories continue to unfold as the world
of Keta grows.

Follow our community channels for more character spotlights and lore deep dives.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_25_the_crimson_fur_order.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Орден Алого Меха: Наследие Капитана Лапы'
pageTitle: 'Орден Алого Меха: Наследие Капитана Лапы'
date: 2026-03-25
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Когда Разлом пронёсся по Кете и старая цивилизация рухнула, воцарился хаос. Но в
его последствиях одна собака поднялась, чтобы навести порядок. Его звали **Капитан Лапа**,
а организация, которую он основал — **Орден Алого Меха** — стала маяком порядка в
разрушенном мире.

## Основание

В годы после Разлома Кета была раздроблена. Магия бушевала, общины были изолированы,
знания старого мира стремительно исчезали. Капитан Лапа, военный стратег дошатровой эпохи,
собрал верных последователей и учредил Орден с чёткой миссией: **восстановить порядок и
защитить уцелевшее**.

Орден не стремился контролировать магию — он стремился пережить её.

## Принципы Ордена Алого Меха

Орден Капитана Лапы основывался на трёх принципах:

- **Дисциплина** — в мире хаоса структура означала выживание
- **Защита** — ограждение общин от непредсказуемых эффектов дикой магии
- **Сохранение** — спасение знаний и артефактов старой цивилизации

Пока другие группы копили магию или дрались за фрагменты силы, Орден сосредоточился на
стабильности и общем благе.

## Подход Капитана Лапы

В отличие от Руффини, стремившегося понять магию через изучение, Капитан Лапа был
прагматиком. Его не интересовала природа Элементов или философия Корня. Его интересовали
результаты: безопасные общины, рабочие пути снабжения и обученные защитники.

Этот практичный подход сделал Орден эффективным — но поставил его в противоречие
с учёными, верившими, что магию нужно исследовать, а не сдерживать.

## Влияние Ордена сегодня

Орден Алого Меха со временем растворился, но его наследие повсюду:

- **Рейтинговый режим** отражает конкурентную дисциплину Ордена — структурированную,
  честную, основанную на заслугах
- **Система рейтинга** награждает стабильность, а не сырую силу, отражая веру Капитана
  Лапы в последовательное мастерство
- В глубинах Рейтингового режима или особых событиях можно почувствовать его
  бдительный взгляд

## Капитан Лапа vs Руффини

Контраст между ними определяет историю Кеты:

| | Руффини Великий | Капитан Лапа |
|---|---|---|
| Подход | Любопытство и исследование | Дисциплина и порядок |
| Цель | Понять магию | Пережить магию |
| Наследие | Высвободил Элементы | Построил структуру в хаосе |
| Философия | Знание прежде всего | Безопасность прежде всего |

Оба сформировали мир _Pawsome Elements_ — один через открытие, другой через лидерство.

## Узнайте больше

История Капитана Лапы пересекается с другими легендарными фигурами — Генералом Рагсом,
Майором Тамбоксом и другими. Их истории продолжают раскрываться.

Следите за нашими каналами для новых историй и раскрытий лора.
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_03_25_* src/ru/news/blog/2026_03_25_*
```

---

## Task 13: "Priest Woofried: Your Guide to the Elements"

**SEO targets:** "pawsome elements priest woofried", "game character guide"

**Files:**
- Create: `src/en/news/blog/2026_03_29_priest_woofried_and_the_elements.md`
- Create: `src/ru/news/blog/2026_03_29_priest_woofried_and_the_elements.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_03_29_priest_woofried_and_the_elements.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Priest Woofried: Your Guide to the Elements'
pageTitle: 'Priest Woofried: Your Guide to the Elements'
date: 2026-03-29
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

When you first enter the world of _Pawsome Elements_, one figure greets you before all
others: **Priest Woofried**. He is the keeper of ancient knowledge, the teacher of the
Elements, and your first guide into the mysteries of Keta.

## Who Is Woofried?

Woofried is a priest and scholar who has dedicated his life to understanding the magic that
emerged from the Shatter. While others feared the Elements or sought to exploit them,
Woofried chose a different path: **teaching**.

He believes that magic is neither good nor evil. It is a force that must be understood,
respected, and mastered through practice and discipline.

## Woofried's Role in the Game

Woofried appears early in your journey in _Pawsome Elements_. He is the one who explains:

- **How the Elements work** — Nature, Filth, and Arcane, and how they interact
- **How spells function** — The mechanics of equipping, casting, and cooldown management
- **The history of Keta** — The Enchanter Root, the Shatter, and why magic exists in its
  current form

Think of Woofried as the bridge between the lore of Keta and the mechanics of the game. He
connects the story to the gameplay, helping players understand not just _how_ to play, but
_why_ things work the way they do.

## Woofried's Philosophy

Woofried's approach to magic is methodical and patient. He teaches that:

- **Understanding comes before power** — Know the Elements before trying to master them
- **Balance is key** — No single Element is superior; strength comes from versatility
- **Practice reveals truth** — Theory alone is insufficient; you must play to learn

These principles mirror good gameplay advice: learn the mechanics, stay flexible, and
practice consistently.

## More Than a Tutorial Character

While Woofried introduces basic mechanics, there are hints that he knows far more than he
initially shares. Players who progress deeper into the Atlas and unlock advanced content
may discover additional teachings from Woofried — insights about spell interactions, Element
synergies, and the deeper nature of the magic that drives the game.

He may have more to share — if you prove you are ready.

## Woofried and the Other Legends

Woofried exists in the same world as Ruffini the Great, Captain Paw, and Savvini the Elusive.
While he is less dramatic than these legendary figures, his role may be equally important. He
is the one who ensures that knowledge survives — that new challengers enter the arena prepared
rather than lost.

In a world broken by the Shatter, preserving and passing on understanding is perhaps the most
valuable act of all.

Watch for more character spotlights on our community channels.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_03_29_priest_woofried_and_the_elements.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Священник Вуфрид: Ваш Проводник в Мир Элементов'
pageTitle: 'Священник Вуфрид: Ваш Проводник в Мир Элементов'
date: 2026-03-29
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Когда вы впервые входите в мир _Pawsome Elements_, одна фигура встречает вас раньше всех:
**Священник Вуфрид**. Хранитель древних знаний, учитель Элементов и ваш первый
проводник в тайны Кеты.

## Кто такой Вуфрид?

Вуфрид — священник и учёный, посвятивший жизнь пониманию магии, возникшей после Разлома.
Пока другие боялись Элементов или стремились их эксплуатировать, Вуфрид выбрал другой
путь: **обучение**.

Он верит, что магия ни добра, ни зла. Это сила, которую нужно понять, уважать и освоить
через практику и дисциплину.

## Роль Вуфрида в игре

Вуфрид появляется в начале вашего пути. Он объясняет:

- **Как работают Элементы** — Природа, Скверна и Аркана, и их взаимодействие
- **Как работают заклинания** — экипировка, активация и управление перезарядкой
- **Историю Кеты** — Корень Волшебника, Разлом и происхождение магии

Вуфрид — мост между лором Кеты и механиками игры. Он связывает историю с геймплеем,
помогая понять не только _как_ играть, но и _почему_ всё устроено именно так.

## Философия Вуфрида

Подход Вуфрида к магии методичен и терпелив:

- **Понимание прежде силы** — изучи Элементы, прежде чем пытаться ими овладеть
- **Баланс — ключ** — ни один Элемент не превосходит другие; сила в универсальности
- **Практика раскрывает истину** — одной теории недостаточно; нужно играть, чтобы учиться

Эти принципы отражают хорошие игровые советы: изучайте механики, оставайтесь гибкими,
тренируйтесь последовательно.

## Больше, чем обучающий персонаж

Хотя Вуфрид знакомит с базовыми механиками, есть намёки, что он знает гораздо больше.
Игроки, продвинувшиеся глубже в Атлас, могут обнаружить дополнительные учения —
об взаимодействиях заклинаний, синергиях Элементов и глубинной природе магии.

Возможно, у него есть ещё что рассказать — если вы докажете свою готовность.

## Вуфрид и другие легенды

Вуфрид существует в одном мире с Руффини, Капитаном Лапой и Саввини Неуловимым. Он менее
драматичен, но его роль может быть не менее важной. Он тот, кто хранит знания — чтобы
новые претенденты выходили на арену подготовленными.

В мире, разрушенном Разломом, сохранение и передача знаний — возможно, самый ценный
поступок.

Следите за нашими каналами для новых историй персонажей.
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_03_29_* src/ru/news/blog/2026_03_29_*
```

---

## Task 14: "Essence Guide: How to Earn More and Progress Faster"

**SEO targets:** "pawsome elements essence guide", "how to earn currency card game"

**Files:**
- Create: `src/en/news/blog/2026_04_01_essence_guide.md`
- Create: `src/ru/news/blog/2026_04_01_essence_guide.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_04_01_essence_guide.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Essence Guide: How to Earn More and Progress Faster'
pageTitle: 'Essence Guide: How to Earn More and Progress Faster'
date: 2026-04-01
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

**Essence** is the core progression currency in _Pawsome Elements_. It fuels everything from
unlocking spells to claiming cosmetic rewards. Understanding how Essence works — and how to
earn more of it — is key to getting the most out of the game.

## What Is Essence?

Essence is an in-game currency earned by playing matches. It is tied to **performance** rather
than just winning:

- Better performance earns more Essence
- Strategic spell use can boost your Essence reward
- Placing higher in ranked games increases your total
- Even losses earn Essence — you are never left empty-handed

## How Essence Is Calculated

Your Essence reward after each match is based on a formula that considers:

1. **Base reward** — A starting amount for completing a match
2. **Position multiplier** — How you finished (1st through 4th in ranked)
3. **Passive skill multiplier** — Multiplier from your unlocked passive skills

The formula rewards consistent, strong play across many matches rather than occasional
lucky wins.

## Passive Skills: The Multiplier System

As you progress, you can unlock **passive skills** — permanent Essence multipliers that
increase your earnings. There are **9 tiers** of passive skills, and each one you own adds
to your multiplier.

This means experienced players earn more Essence per match than new players for the same
performance. The multiplier system rewards long-term commitment and encourages continued play.

## Doubling Your Reward

After each match, you have the option to **double your Essence reward** by watching a short
ad. This is entirely optional — but it is the fastest way to accelerate your progression
without any additional gameplay.

## What Can You Spend Essence On?

Essence is spent in the **Atlas** — the central progression hub:

### Spells Tab

Use Essence to **unlock new spells**. Each spell you unlock adds more tools to your strategic
toolkit. Since spells are key to competitive play, unlocking them early gives you more options.

### Journey Tab

The Journey tab lets you exchange Essence for **cosmetic rewards**:

- **Card Skins** — Change the visual design of your cards
- **Arena Skins** — Customize the look and feel of your play space

These rewards do not affect gameplay — they are purely about personal expression and style.

## Tips for Earning More Essence

1. **Play consistently** — Regular play with passive multipliers compounds over time
2. **Aim for top finishes** — Higher placement means higher Essence rewards
3. **Unlock passive skills early** — The multiplier makes every future match more rewarding
4. **Use the double reward** — When available, doubling your Essence is the easiest boost
5. **Try ranked** — Ranked matches generally offer better Essence rewards

## The Long-Term View

Essence is designed to reward sustained engagement. New players earn enough to unlock their
first spells quickly, while experienced players accumulate Essence at increasing rates through
passive multipliers.

The progression is fair, consistent, and never locked behind paywalls. Every match earns
Essence, and every Essence brings you closer to your next unlock.

For more on progression, visit the [Essence page](/en/game/essence).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_04_01_essence_guide.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Гайд по Эссенции: Как Зарабатывать Больше'
pageTitle: 'Гайд по Эссенции: Как Зарабатывать Больше и Прогрессировать Быстрее'
date: 2026-04-01
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

**Эссенция** — основная валюта прогресса в _Pawsome Elements_. Она питает всё: от
открытия заклинаний до получения косметических наград. Понимание, как работает Эссенция
и как её зарабатывать больше — ключ к максимуму от игры.

## Что такое Эссенция?

Эссенция — внутриигровая валюта, получаемая за матчи. Она привязана к **результативности**:

- Лучшая игра приносит больше Эссенции
- Стратегическое использование заклинаний увеличивает награду
- Высокие места в рейтинговых матчах повышают итог
- Даже проигрыши приносят Эссенцию — вы никогда не остаётесь с пустыми руками

## Как рассчитывается Эссенция

Награда после матча основана на формуле:

1. **Базовая награда** — стартовая сумма за завершение матча
2. **Множитель позиции** — как вы финишировали (1-е по 4-е место)
3. **Множитель пассивных навыков** — от разблокированных пассивных навыков

Формула награждает стабильную, сильную игру на дистанции.

## Пассивные навыки: система множителей

По мере прогресса вы разблокируете **пассивные навыки** — постоянные множители Эссенции.
Есть **9 уровней**, и каждый увеличивает ваш множитель.

Опытные игроки зарабатывают больше Эссенции за матч при том же результате. Система
множителей поощряет долгосрочную преданность игре.

## Удвоение награды

После каждого матча есть возможность **удвоить награду** Эссенции, посмотрев короткую
рекламу. Это полностью опционально — но самый быстрый способ ускорить прогресс.

## На что тратить Эссенцию?

Эссенция тратится в **Атласе** — центральном хабе прогресса:

### Вкладка Заклинания

Используйте Эссенцию для **открытия новых заклинаний**. Каждое открытое заклинание
расширяет ваш стратегический арсенал.

### Вкладка Путешествие

Обменивайте Эссенцию на **косметические награды**:

- **Скины карт** — измените визуал ваших карт
- **Скины арены** — настройте внешний вид игрового пространства

Эти награды не влияют на геймплей — только стиль и самовыражение.

## Советы по заработку Эссенции

1. **Играйте регулярно** — стабильная игра с множителями накапливается
2. **Стремитесь к высоким местам** — выше позиция = больше Эссенции
3. **Открывайте пассивные навыки рано** — множитель окупается с каждого будущего матча
4. **Используйте удвоение** — самый лёгкий буст
5. **Пробуйте рейтинг** — обычно награды лучше

## Долгосрочная перспектива

Система Эссенции спроектирована для устойчивого участия. Новички быстро зарабатывают на
первые заклинания, а опытные игроки накапливают Эссенцию с нарастающей скоростью.

Прогресс честный, последовательный и не заблокирован за платными стенами. Каждый матч
приносит Эссенцию, и каждая Эссенция приближает к следующей разблокировке.

Подробнее — на странице [Эссенция](/ru/game/essence).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_04_01_* src/ru/news/blog/2026_04_01_*
```

---

## Task 15: "The Atlas Explained: Spells, Skins, and Your Journey"

**SEO targets:** "pawsome elements atlas progression", "card game progression system"

**Files:**
- Create: `src/en/news/blog/2026_04_04_the_atlas_explained.md`
- Create: `src/ru/news/blog/2026_04_04_the_atlas_explained.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_04_04_the_atlas_explained.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | The Atlas Explained: Spells, Skins, and Your Journey'
pageTitle: 'The Atlas Explained: Spells, Skins, and Your Journey'
date: 2026-04-04
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

The **Atlas** is the central progression hub in _Pawsome Elements_. It is where you unlock
spells, claim cosmetic rewards, and track your journey as a player. Think of it as your
personal map of growth in the world of Keta.

## What Is the Atlas?

The Atlas is divided into two main sections:

### Spells Tab

The Spells tab is where you unlock and equip your spells. Using Essence earned from matches,
you can unlock new spells to expand your strategic options.

Available spells include:

- **Pawgularity** — Transform any card into a Multidog
- **Hesitant Paw** — Start with 2 fewer cards
- **Unleashed Will** — Play any card without restrictions
- **Tailspin** — Shuffle 1 random card back to the deck
- **Fresh Scent** — Swap your entire hand for new cards
- **Transmutation** — Transform a random card from each opponent

Once unlocked, you can **equip one spell** before each match. Experimenting with different
spells is key to finding your playstyle.

### Journey Tab

The Journey tab is the cosmetic progression path. Here you exchange Essence for visual
rewards:

- **Card Skins** — New visual designs for your cards. They do not affect gameplay but let you
  personalize your deck.
- **Arena Skins** — Change the look of your play environment. Different arenas give your
  matches a fresh visual feel.

Journey rewards are purely cosmetic. They are about expressing your style and showing off
your dedication to the game.

## How the Atlas Connects to Gameplay

The Atlas is not just a reward screen — it shapes how you play:

1. **Unlocking spells changes your strategy** — Each new spell opens different tactical
   approaches. A player with only Pawgularity plays very differently from one with all six
   spells available.
2. **Passive skill multipliers live here** — As you unlock Essence multipliers, every future
   match becomes more rewarding.
3. **Cosmetics show commitment** — Arena and card skins signal experience. They do not
   provide advantages, but they show other players you have been on the Journey.

## Progression Tips

- **Prioritize spell unlocks** — Spells directly affect your competitiveness. Unlock them
  before spending on cosmetics.
- **Check the Atlas regularly** — New content and rewards may be added as the game grows.
- **Earn Essence efficiently** — Play ranked for better rewards, use passive multipliers, and
  take advantage of the double reward option.

## The Atlas and Lore

In the world of Keta, the Atlas is more than a game menu. It is tied to the ancient knowledge
scattered after the Shatter. The encrypted research of the Princess, the teachings of
Priest Woofried, and the experiments of Savvini the Elusive are all connected to what you
discover here.

Your journey through the Atlas is your journey through the fragments of a lost world.

For more on earning Essence, read the [Essence Guide](/en/game/essence).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_04_04_the_atlas_explained.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Атлас: Заклинания, Скины и Ваше Путешествие'
pageTitle: 'Атлас: Заклинания, Скины и Ваше Путешествие'
date: 2026-04-04
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

**Атлас** — центральный хаб прогресса в _Pawsome Elements_. Здесь вы разблокируете
заклинания, получаете косметические награды и отслеживаете свой путь. Это ваша
персональная карта роста в мире Кеты.

## Что такое Атлас?

Атлас разделён на две вкладки:

### Вкладка Заклинания

Здесь вы разблокируете и экипируете заклинания. За Эссенцию, заработанную в матчах,
открываете новые заклинания:

- **Сингупёсность** — превращает карту в Мультипса
- **Лапа Отказа** — начинаете с 2 картами меньше
- **Освобождённая Воля** — играете любую карту без ограничений
- **Хвостовой Вихрь** — замешивает 1 случайную карту обратно
- **Свежесть** — меняет всю руку на новые карты
- **Трансмутация** — превращает случайную карту у каждого противника

После разблокировки можно **экипировать одно заклинание** перед матчем.

### Вкладка Путешествие

Путешествие — путь косметического прогресса:

- **Скины карт** — новый визуал для карт. Не влияют на геймплей.
- **Скины арены** — меняют внешний вид игрового пространства.

Награды чисто косметические — для самовыражения и демонстрации преданности игре.

## Как Атлас связан с геймплеем

1. **Открытие заклинаний меняет стратегию** — каждое новое заклинание открывает другие
   тактические подходы.
2. **Множители пассивных навыков** — увеличивают награды за каждый матч.
3. **Косметика показывает опыт** — скины сигнализируют, что вы прошли долгий путь.

## Советы по прогрессу

- **Приоритет — заклинания** — они напрямую влияют на конкурентоспособность.
- **Проверяйте Атлас регулярно** — новый контент может добавляться.
- **Зарабатывайте Эссенцию эффективно** — рейтинг, множители, удвоение награды.

## Атлас и лор

В мире Кеты Атлас — больше, чем игровое меню. Он связан с древними знаниями, рассеянными
после Разлома. Зашифрованные исследования Принцессы, учения Священника Вуфрида и
эксперименты Саввини Неуловимого — всё соединено с тем, что вы открываете здесь.

Ваше путешествие через Атлас — это путешествие через фрагменты утраченного мира.

Подробнее о заработке Эссенции — в [Гайде по Эссенции](/ru/game/essence).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_04_04_* src/ru/news/blog/2026_04_04_*
```

---

## Task 16: "Why Card Games Are Making a Comeback in 2026"

**SEO targets:** "card games comeback 2026", "popular card games online trend"

**Files:**
- Create: `src/en/news/blog/2026_04_08_why_card_games_are_making_a_comeback.md`
- Create: `src/ru/news/blog/2026_04_08_why_card_games_are_making_a_comeback.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_04_08_why_card_games_are_making_a_comeback.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Why Card Games Are Making a Comeback in 2026'
pageTitle: 'Why Card Games Are Making a Comeback in 2026'
date: 2026-04-08
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Card games have been around for centuries, but something interesting is happening in 2026:
they are having a **major resurgence** in the digital space. From browser-based multiplayer
games to competitive online arenas, more players than ever are picking up virtual cards.

Here is why card games are thriving right now — and why this matters for everyone who
plays them.

## 1. Short Sessions Fit Modern Lifestyles

In a world where attention spans compete with endless entertainment options, card games offer
something most genres cannot: a **complete experience in just a few minutes**.

Unlike RPGs that require hours or shooters that demand sustained focus, a card game can be
picked up, played, and finished in under 5 minutes. That accessibility is driving new players
to the genre.

## 2. Browser-Based Play Removes Barriers

You do not need a gaming PC, a console, or even a large download. Modern card games run
directly in your browser on any device. This zero-friction access means anyone with a phone,
tablet, or computer can play instantly.

Games like _Pawsome Elements_ work on any modern browser — no download, no install, no
waiting.

## 3. Social and Multiplayer Focus

Card games are inherently social. They work best when played with others — friends, strangers,
or competitive opponents. In an era where online social interaction is valued more than ever,
card games provide a natural platform for connection.

Multiplayer card games create shared experiences: the excitement of a close match, the
frustration of a well-timed disruption card, the satisfaction of a perfect spell.

## 4. Strategic Depth Without Complexity

The best card games balance **simplicity and depth**. The rules can be learned in minutes, but
mastering the game takes weeks or months. This "easy to learn, hard to master" formula keeps
players engaged long-term.

Card games prove that you do not need a hundred buttons or complex controls to have a
strategically rich experience.

## 5. Fair Free-to-Play Models

Modern card games are increasingly moving away from pay-to-win mechanics. Players demand
fairness, and the games that deliver it are the ones that grow. Shared decks, cosmetic-only
rewards, and skill-based ranking systems are becoming the standard.

## 6. Competitive Ecosystems

Ranked ladders, leaderboards, and seasonal competitions give card game players a reason to
keep improving. The competitive layer adds long-term motivation that casual play alone cannot
provide.

## What This Means for Players

If you have ever enjoyed a card game — even just UNO at a family gathering — the current
moment is the best time to explore what modern digital card games offer. The genre has evolved
dramatically, combining classic card game fun with modern technology, multiplayer connectivity,
and competitive depth.

Whether you play casually with friends or compete on ranked ladders, there has never been a
better time to be a card game player.

Curious? [Try Pawsome Elements](https://app.pawsome-elements.com) — it is free, browser-based,
and built for both casual and competitive players.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_04_08_why_card_games_are_making_a_comeback.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Почему Карточные Игры Возвращаются в 2026'
pageTitle: 'Почему Карточные Игры Возвращаются в 2026 Году'
date: 2026-04-08
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Карточные игры существуют веками, но в 2026 году происходит нечто интересное: они переживают
**серьёзное возрождение** в цифровом пространстве. Почему — и что это значит для игроков.

## 1. Короткие сессии вписываются в современную жизнь

Карточные игры предлагают то, что большинство жанров не может: **полноценный опыт за
несколько минут**. В отличие от RPG, требующих часов, партия в карточную игру занимает
менее 5 минут. Эта доступность привлекает новых игроков.

## 2. Браузерная игра убирает барьеры

Не нужен игровой ПК, консоль или большая загрузка. Современные карточные игры работают
прямо в браузере на любом устройстве. Ноль препятствий — любой с телефоном или компьютером
может играть мгновенно.

_Pawsome Elements_ работает в любом современном браузере — без загрузки и установки.

## 3. Социальный и мультиплеерный фокус

Карточные игры по природе социальны. Они работают лучше с другими людьми — друзьями,
незнакомцами или конкурентами. В эпоху, когда онлайн-общение ценится как никогда,
карточные игры — естественная платформа для связи.

## 4. Глубина без сложности

Лучшие карточные игры балансируют **простоту и глубину**. Правила за минуты, мастерство
за недели. Формула «легко освоить, сложно овладеть» удерживает игроков надолго.

## 5. Честные модели free-to-play

Современные карточные игры всё чаще уходят от pay-to-win. Общие колоды, косметические
награды и рейтинговые системы на основе мастерства становятся стандартом.

## 6. Соревновательные экосистемы

Рейтинговые лестницы, таблицы лидеров и сезонные соревнования дают игрокам причину
продолжать улучшаться.

## Что это значит для игроков

Если вам когда-либо нравились карточные игры — даже UNO на семейном вечере — сейчас
лучшее время для изучения цифровых карточных игр. Жанр эволюционировал, сочетая
классическое веселье с технологиями, мультиплеером и соревновательной глубиной.

Играете ли вы казуально с друзьями или конкурируете в рейтинге — лучшего времени быть
карточным игроком ещё не было.

Попробуйте [Pawsome Elements](https://app.pawsome-elements.com) — бесплатно, в браузере,
для всех.
```

**Step 3: Verify build and commit**

```bash
npm run build
git add src/en/news/blog/2026_04_08_* src/ru/news/blog/2026_04_08_*
```

---

## Task 17: "Online Card Games vs Physical Card Games"

**SEO targets:** "online card games vs physical", "digital card games advantages"

**Files:**
- Create: `src/en/news/blog/2026_04_11_online_card_games_vs_physical_card_games.md`
- Create: `src/ru/news/blog/2026_04_11_online_card_games_vs_physical_card_games.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_04_11_online_card_games_vs_physical_card_games.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Online Card Games vs Physical Card Games'
pageTitle: 'Online Card Games vs Physical Card Games: What''s the Difference?'
date: 2026-04-11
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Card games have existed on tables for centuries. Now they exist on screens too. But **online
card games** and **physical card games** offer fundamentally different experiences. Here is
what separates them — and why both have their place.

## What Physical Card Games Do Best

### The Social Experience

Nothing replaces sitting around a table with friends, holding cards in your hands, and reading
facial expressions. Physical card games create a shared physical space that digital games
cannot fully replicate.

### Tactile Satisfaction

Shuffling a deck, fanning out your hand, slapping a card on the table — physical cards offer
a sensory experience that screens cannot match.

### No Technology Required

A deck of cards works everywhere: camping trips, power outages, planes, waiting rooms. No
batteries, no internet, no loading screens.

## What Online Card Games Do Best

### Play Anytime, Anywhere

Online card games do not require gathering friends in the same location. You can play against
opponents worldwide, anytime, from any device with internet access.

### Automated Rules

No more arguing about house rules or forgetting a rule mid-game. Online card games enforce
rules automatically, ensuring fair and consistent play.

### Impossible Mechanics

Digital card games can include mechanics that physical cards cannot: real-time effects,
automatic card transformations, cooldown-based spells, and global ranking systems.

In _Pawsome Elements_, cards like Hydrant automatically transform random cards in opponents'
hands — an effect that would be impractical with physical cards. Spells activate with perfect
timing, and the ranking system tracks every match globally.

### Progression Systems

Online card games can track your history, reward your progress, and unlock new content over
time. Physical card games are the same experience every time you play.

### Matchmaking

Finding equally skilled opponents is trivial online. In physical card games, you are limited
to whoever is in the room.

## The Best of Both Worlds

The most interesting modern card games take the soul of physical card games — simple rules,
social interaction, strategic depth — and enhance them with digital capabilities:

- **Shared decks** (like physical card games) instead of pay-to-win deckbuilding
- **Interactive effects** that go beyond what physical cards can do
- **Global competition** while preserving the social, multiplayer feel

## Which Should You Play?

Both. Physical card games are irreplaceable for in-person social gatherings. Online card games
are unmatched for competitive play, convenience, and advanced mechanics.

The real question is not which is better — it is which fits the moment.

Want to experience what modern online card games can do? [Try Pawsome Elements](https://app.pawsome-elements.com) — free, fast, and built for fun.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_04_11_online_card_games_vs_physical_card_games.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Онлайн vs Физические Карточные Игры'
pageTitle: 'Онлайн vs Физические Карточные Игры: В Чём Разница?'
date: 2026-04-11
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Карточные игры веками существовали на столах. Теперь они есть и на экранах. Но **онлайн-** и
**физические карточные игры** предлагают принципиально разный опыт. Вот что их разделяет.

## Преимущества физических игр

### Социальный опыт
Ничто не заменит сидение за столом с друзьями, карты в руках и чтение выражений лиц.

### Тактильное удовольствие
Перетасовка колоды, раскладывание руки, хлопок картой по столу — сенсорный опыт, который
экраны не могут воспроизвести.

### Никаких технологий
Колода карт работает везде: в походе, при отключении света, в самолёте.

## Преимущества онлайн-игр

### Играйте когда угодно
Не нужно собирать друзей в одном месте. Противники по всему миру, в любое время.

### Автоматические правила
Никаких споров о правилах. Онлайн-игры соблюдают правила автоматически.

### Невозможные механики
Цифровые игры включают механики, невозможные с физическими картами: эффекты в реальном
времени, автоматические превращения, заклинания с перезарядкой, глобальный рейтинг.

В _Pawsome Elements_ Гидрант автоматически превращает карты в руках противников — эффект,
непрактичный с физическими картами. Заклинания активируются с точным таймингом, а система
рейтинга отслеживает каждый матч глобально.

### Системы прогресса
Онлайн-игры отслеживают историю, награждают прогресс и открывают новый контент.

### Подбор соперников
Найти равных по уровню противников онлайн — тривиально.

## Лучшее из двух миров

Современные карточные игры берут душу физических — простые правила, социальное
взаимодействие, глубина стратегии — и усиливают цифровыми возможностями:

- **Общие колоды** вместо pay-to-win
- **Интерактивные эффекты** за пределами возможностей физических карт
- **Глобальная конкуренция** с сохранением мультиплеерной атмосферы

## Что играть?

Оба формата. Физические — незаменимы для живых встреч. Онлайн — непревзойдённы для
конкуренции, удобства и продвинутых механик.

Вопрос не в том, что лучше — а что подходит моменту.

Попробуйте [Pawsome Elements](https://app.pawsome-elements.com) — бесплатно, быстро и
весело.
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_04_11_* src/ru/news/blog/2026_04_11_*
```

---

## Task 18: "The Psychology of Card Games: Reading Your Opponents"

**SEO targets:** "card game psychology", "reading opponents card game strategy"

**Files:**
- Create: `src/en/news/blog/2026_04_15_the_psychology_of_card_games.md`
- Create: `src/ru/news/blog/2026_04_15_the_psychology_of_card_games.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_04_15_the_psychology_of_card_games.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | The Psychology of Card Games: Reading Your Opponents'
pageTitle: 'The Psychology of Card Games: Reading Your Opponents'
date: 2026-04-15
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Every card game is also a mind game. The cards in your hand are only half the story — the
other half is understanding what your opponents are thinking, planning, and holding. Here is
how psychology shapes card game strategy, and how you can use it in _Pawsome Elements_.

## Why Psychology Matters in Card Games

In most card games, you cannot see your opponents' hands. This hidden information creates
uncertainty — and uncertainty creates opportunities for those who can read the situation.

Even in _Pawsome Elements_, where there is no bluffing in the poker sense, psychological
awareness gives you an edge:

- **Predicting what opponents will play** based on their behavior
- **Timing your disruption cards** for maximum psychological impact
- **Managing your own decision-making** under pressure

## Reading Opponent Behavior

### Card Count Signals

Watch how many cards each opponent holds. A player with 1-2 cards is likely holding strong,
matchable cards and planning to finish. A player with many cards is probably struggling with
mismatches.

### Play Speed Patterns

Players who act quickly are usually confident in their hand. Players who hesitate may be
deciding between multiple options — or hoping for an out-of-turn opportunity.

### Spell Usage Timing

When an opponent uses their spell tells you a lot:

- **Early spell use** suggests they are trying to gain an advantage quickly
- **Late spell use** suggests they were saving it for a critical moment
- **No spell use at all** might mean they are running Hesitant Paw (which activates at start)

### Special Card Patterns

If an opponent has not played any special cards despite many turns, they may be holding one
for a strategic moment. Be prepared for a Hydrant or Shaking when it matters most.

## The Psychology of Disruption

Disruption cards like Hydrant and Shaking have a psychological effect beyond their game
mechanic:

- **Hydrant creates anxiety** — opponents never know which card will be transformed. This
  can cause them to play conservatively, using strong cards early rather than risking losing
  them.
- **Shaking creates frustration** — drawing an extra card when you are close to winning is
  discouraging. Multiple Shakings can tilt opponents into making emotional decisions.

Knowing this, you can time disruption cards not just for their game effect, but for their
psychological impact. A Shaking played when an opponent is at 2 cards hits harder
psychologically than the same card played at 6 cards.

## Managing Your Own Psychology

### Avoiding Tilt

Tilt — making emotional, suboptimal decisions after a setback — is the biggest psychological
trap in competitive card games. Common triggers:

- Losing a key card to Hydrant
- Drawing multiple cards from Shaking at a critical moment
- Missing an out-of-turn opportunity

The fix: recognize when you are tilting and slow down. A calm decision is almost always better
than a fast, emotional one.

### Staying Focused

In a 4-player match, it is easy to focus only on your own hand. But the best players maintain
awareness of all three opponents simultaneously — tracking card counts, Element patterns, and
spell cooldowns.

## Quick Psychological Tips

1. **Watch card counts** — they reveal who is threatening and who is struggling
2. **Time disruption for maximum frustration** — not just maximum game effect
3. **Control your reactions** — do not let setbacks change your strategy
4. **Stay aware of all opponents** — not just the one in first place

The psychological layer of card games is invisible but powerful. Master it, and you will find
yourself winning matches that pure mechanics alone could not.

For more strategy, visit the [Strategy Guide](/en/game/strategy).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_04_15_the_psychology_of_card_games.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Психология Карточных Игр: Читайте Противников'
pageTitle: 'Психология Карточных Игр: Как Читать Противников'
date: 2026-04-15
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Каждая карточная игра — это ещё и игра разумов. Карты на руке — только половина истории.
Другая половина — понимание, что думают, планируют и держат противники.

## Почему психология важна

В карточных играх вы не видите руки противников. Скрытая информация создаёт
неопределённость — и возможности для тех, кто умеет читать ситуацию.

В _Pawsome Elements_ психологическая осведомлённость даёт преимущество:

- **Предсказание ходов** на основе поведения
- **Тайминг карт помех** для максимального психологического эффекта
- **Управление собственными решениями** под давлением

## Чтение поведения противников

### Сигналы количества карт

Игрок с 1-2 картами скорее всего держит сильные, совпадающие карты. Игрок с большой
рукой, вероятно, борется с несовпадениями.

### Паттерны скорости

Быстро играющие уверены в руке. Медлительные выбирают из вариантов — или ждут хода
вне очереди.

### Тайминг заклинаний

- **Раннее использование** — попытка быстро получить преимущество
- **Позднее** — сохраняли для критического момента
- **Не использовали вообще** — возможно, Лапа Отказа (активируется на старте)

### Паттерны особых карт

Если противник не играл особых карт при многих ходах — возможно, держит для
стратегического момента. Будьте готовы к Гидранту или Встряске.

## Психология помех

Карты помех имеют эффект за пределами механики:

- **Гидрант создаёт тревогу** — противники не знают, какая карта превратится. Это
  заставляет играть осторожнее, сбрасывая сильные карты рано.
- **Встряска создаёт фрустрацию** — лишняя карта, когда ты почти выиграл, деморализует.

Зная это, рассчитывайте помехи не только по игровому, но и по психологическому эффекту.
Встряска при 2 картах у противника бьёт сильнее, чем при 6.

## Управление собственной психологией

### Избегайте тильта

Тильт — эмоциональные, неоптимальные решения после неудачи. Частые триггеры:

- Потеря ключевой карты от Гидранта
- Взятие карт от Встряски в критический момент
- Упущенный ход вне очереди

Решение: осознайте тильт и замедлитесь. Спокойное решение почти всегда лучше быстрого
и эмоционального.

### Сохраняйте фокус

В матче на 4 игроков легко фокусироваться только на своей руке. Но лучшие игроки
отслеживают всех трёх противников: карточные счета, паттерны Элементов, перезарядки.

## Психологические советы

1. **Следите за количеством карт** — они раскрывают угрозы
2. **Рассчитывайте помехи на максимальный эффект** — не только механический
3. **Контролируйте реакции** — не давайте неудачам менять стратегию
4. **Наблюдайте за всеми** — не только за лидером

Психологический слой карточных игр невидим, но могущественен. Овладейте им — и будете
выигрывать матчи, которые одними механиками не взять.

Больше стратегий — в [Стратегиях](/ru/game/strategy).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_04_15_* src/ru/news/blog/2026_04_15_*
```

---

## Task 19: "What Makes a Fair Free-to-Play Card Game?"

**SEO targets:** "fair free to play card game", "no pay to win card game"

**Files:**
- Create: `src/en/news/blog/2026_04_18_what_makes_a_fair_free_to_play_card_game.md`
- Create: `src/ru/news/blog/2026_04_18_what_makes_a_fair_free_to_play_card_game.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_04_18_what_makes_a_fair_free_to_play_card_game.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | What Makes a Fair Free-to-Play Card Game?'
pageTitle: 'What Makes a Fair Free-to-Play Card Game?'
date: 2026-04-18
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

The words "free-to-play" carry a lot of baggage. Too many games use the label to lure players
in, then lock real content or competitive advantages behind paywalls. So what does it actually
mean for a card game to be **truly fair** and free-to-play?

## The Problem with Most F2P Card Games

Many free-to-play card games follow a pattern:

- **Start free** — but quickly hit walls
- **Deckbuilding requires rare cards** — which require either grinding or paying
- **Paying players have better cards** — creating an uneven playing field
- **Competitive play is gated** — you need specific cards to compete at higher levels

This model works financially but creates frustration for players who want to compete on skill
alone.

## What Fair Free-to-Play Looks Like

A truly fair F2P card game should satisfy these principles:

### 1. Everyone Plays from the Same Deck

The most important principle. If all players draw from the same shared deck, no one has a
card advantage. Your success depends entirely on **how you play**, not **what you own**.

In _Pawsome Elements_, every match uses a shared deck. No deckbuilding, no rare cards, no
collection grinding. Every player starts on equal footing.

### 2. Cosmetics Only, No Competitive Advantage

Monetization should come from optional cosmetic items — skins, visual effects, arena themes —
not from gameplay-affecting content. Paying players should look different, not play better.

### 3. Progression Through Play, Not Pay

Players should unlock content by playing the game, not by opening their wallet. Progression
currencies like Essence should be earned through matches, and spending should be meaningful
but never mandatory.

### 4. Transparent Systems

Fair games are open about how their systems work. Ranking, matchmaking, and reward formulas
should be understandable and consistent. No hidden mechanics that favor paying users.

### 5. Skill-Based Competition

Ranked modes should match players by skill, not by collection size or spending history. The
leaderboard should reflect who plays best, not who pays most.

## How Pawsome Elements Approaches Fairness

- **Shared deck** — No deckbuilding, no card collecting. Everyone draws from the same pool.
- **Cosmetic rewards only** — Card skins and arena skins do not affect gameplay.
- **Essence earned by playing** — Progression currency from every match, with no purchase
  shortcuts for competitive advantages.
- **Skill-based ranking** — The hard point system rewards consistent performance, and
  matchmaking pairs similar-ranked players.

## Why Fairness Matters for Longevity

Games that respect their players build lasting communities. When players trust that the system
is fair, they invest more time, invite more friends, and stay longer. Unfair systems drive
players away — often permanently.

The most successful games of the next decade will be the ones that prove free-to-play and
fair-to-play can coexist.

Want to see what a fair card game feels like? [Play Pawsome Elements](https://app.pawsome-elements.com) — it is free, fair, and built for everyone.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_04_18_what_makes_a_fair_free_to_play_card_game.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Что Делает F2P Карточную Игру Честной?'
pageTitle: 'Что Делает Free-to-Play Карточную Игру Честной?'
date: 2026-04-18
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Слова «free-to-play» несут много багажа. Слишком многие игры используют ярлык, чтобы
завлечь, а потом заблокировать контент за платными стенами. Так что на самом деле значит
**честная** бесплатная карточная игра?

## Проблема большинства F2P карточных игр

Типичная схема:

- **Начинаете бесплатно** — но быстро упираетесь в стену
- **Для колоды нужны редкие карты** — гринд или оплата
- **Платящие имеют лучшие карты** — неравное поле
- **Конкурентная игра закрыта** — нужны конкретные карты для высоких уровней

## Как выглядит честный F2P

### 1. Все играют из одной колоды

Главный принцип. Если все тянут из общей колоды — ни у кого нет преимущества по картам.
Успех зависит от **как играешь**, а не **что имеешь**.

В _Pawsome Elements_ каждый матч использует общую колоду. Никакого сбора карт. Все
на равных.

### 2. Только косметика, никаких преимуществ

Монетизация через опциональные скины — карт, арен — а не через контент, влияющий на
геймплей. Платящие выглядят иначе, но не играют лучше.

### 3. Прогресс через игру, не через оплату

Контент разблокируется игрой, а не кошельком. Валюта прогресса зарабатывается матчами.

### 4. Прозрачные системы

Рейтинг, подбор соперников и награды должны быть понятными и последовательными.

### 5. Конкуренция на мастерстве

Рейтинг должен отражать, кто играет лучше, а не кто платит больше.

## Подход Pawsome Elements

- **Общая колода** — никакого сбора карт. Все тянут из одного пула.
- **Только косметические награды** — скины не влияют на геймплей.
- **Эссенция за игру** — прогресс от каждого матча.
- **Рейтинг на мастерстве** — система вознаграждает стабильную игру.

## Почему честность важна для долголетия

Игры, уважающие игроков, строят стойкие сообщества. Когда люди доверяют системе — они
вкладывают больше времени, приглашают друзей и остаются дольше. Нечестные системы
отталкивают — часто навсегда.

Хотите почувствовать, как выглядит честная карточная игра? [Играйте в Pawsome Elements](https://app.pawsome-elements.com) — бесплатно, честно и для всех.
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_04_18_* src/ru/news/blog/2026_04_18_*
```

---

## Task 20: "Card Game Terminology Every Player Should Know"

**SEO targets:** "card game terms glossary", "card game vocabulary explained"

**Files:**
- Create: `src/en/news/blog/2026_04_22_card_game_terminology_every_player_should_know.md`
- Create: `src/ru/news/blog/2026_04_22_card_game_terminology_every_player_should_know.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_04_22_card_game_terminology_every_player_should_know.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Card Game Terminology Every Player Should Know'
pageTitle: 'Card Game Terminology Every Player Should Know'
date: 2026-04-22
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Whether you are new to card games or a veteran, knowing the terminology makes strategy
discussions, guides, and community conversations much easier. Here is a glossary of terms
used in _Pawsome Elements_ and card games in general.

## General Card Game Terms

**Hand** — The cards you are currently holding. Only you can see your hand.

**Deck / Pile** — The shared pool of cards that players draw from during the game.

**Discard Pile** — Cards that have been played or discarded. In _Pawsome Elements_, Trash
Can Diving draws from the discard pile.

**Draw** — Taking a card from the deck into your hand. You draw when you cannot play a card
on your turn.

**Match** — Playing a card that satisfies the game's rules. In _Pawsome Elements_, you match
by Element or Value on your turn.

**Wildcard** — A card that can be played regardless of matching rules. In _Pawsome Elements_,
the Multidog and Ball of Fortune are wildcards.

**Turn** — Your opportunity to play a card, use a spell, or draw. Each turn has a time limit
in _Pawsome Elements_.

## Pawsome Elements-Specific Terms

**Element** — One of the three magical types that define cards: Nature, Filth, or Arcane.
Plus the special Multimatter type for wildcards.

**Value / Power** — The number on a basic card (1-9). Used for matching alongside Element.

**Spell** — A special ability equipped before a match and activated during play instead of
playing a card. Has a 3-turn cooldown after use.

**Cooldown** — The number of turns you must wait before using your spell again. Default is 3
turns. Treat Hiding reduces it by 1.

**Out-of-Turn Play** — Playing a card during another player's turn. Requires an exact match
(same Element AND Value) with the top card on the pile.

**Exact Match** — A card that shares both the Element and Value of the current top card.
Required for out-of-turn play.

**Special Card** — A card with a unique effect when played: Hydrant, Shaking, Trash Can
Diving, Treat Hiding, Ball of Fortune.

**Multidog** — The ultimate wildcard. Belongs to the Multimatter Element. Plays on anything,
and anything plays on it.

**Ball of Fortune** — A wildcard that offers a choice between 2 of 5 random effects when
played.

**Essence** — The in-game progression currency earned from matches.

**Atlas** — The progression hub where you unlock spells and cosmetic rewards.

**Ranked / Rating** — The competitive mode with skill-based matchmaking and a global
leaderboard. Uses the hard point system.

**Hard Point System** — The ranking system where 1st-3rd place earn points and 4th loses
points. Rewards consistency.

## Strategy Terms

**Hand Management** — Choosing which cards to play and which to hold for later. Holding the
right card for the right moment is key.

**Disruption** — Playing cards that negatively affect opponents. Hydrant, Shaking, and Trash
Can Diving are disruption cards.

**Tempo** — Controlling the flow and pace of the match. A player with tempo is dictating what
others must react to.

**Tilt** — Making emotional, suboptimal decisions after a frustrating event. Staying calm
under pressure is essential.

**Meta** — The dominant strategies and patterns used by the player community at any given
time. Adapting to the meta improves your ranking.

**Card Economy** — Tracking how many cards remain in the deck and in opponents' hands to
make better decisions.

## Using These Terms

Understanding these terms helps you:

- **Read strategy guides** more effectively
- **Communicate in the community** with precision
- **Analyze your own play** by naming what you are doing and why
- **Learn faster** by connecting concepts to vocabulary

Bookmark this page and return whenever you encounter an unfamiliar term. As _Pawsome Elements_
grows, this glossary will expand to cover new mechanics and strategies.

For gameplay explanations, visit the [Gameplay page](/en/game/gameplay). For strategy, check
the [Strategy Guide](/en/game/strategy).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_04_22_card_game_terminology_every_player_should_know.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Терминология Карточных Игр: Словарь Игрока'
pageTitle: 'Терминология Карточных Игр: Словарь, Который Должен Знать Каждый'
date: 2026-04-22
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Независимо от опыта, знание терминологии упрощает чтение гайдов, обсуждение стратегий и
общение в сообществе. Вот словарь терминов _Pawsome Elements_ и карточных игр в целом.

## Общие термины карточных игр

**Рука** — Карты, которые вы держите. Видите только вы.

**Колода** — Общий пул карт, из которого игроки тянут.

**Стопка сброса** — Сыгранные или сброшенные карты. Мусорный Дайвинг берёт отсюда.

**Взятие** — Получение карты из колоды. Берёте, когда не можете сыграть.

**Совпадение** — Розыгрыш карты по правилам. Совпадение по Элементу или Значению.

**Вайлдкард** — Карта без ограничений. Мультипёс и Шар Фортуны.

**Ход** — Возможность сыграть карту, заклинание или взять карту. С ограничением по времени.

## Термины Pawsome Elements

**Элемент** — Один из трёх типов: Природа, Скверна, Аркана. Плюс Мультиматерия.

**Значение / Сила** — Число на карте (1-9). Используется для совпадения вместе с Элементом.

**Заклинание** — Особая способность, экипированная до матча. Активируется вместо
розыгрыша карты. Перезарядка 3 хода.

**Перезарядка** — Ходы ожидания до повторного заклинания. По умолчанию 3. Прятки с
Лакомством уменьшают на 1.

**Ход вне очереди** — Розыгрыш карты в чужой ход. Требует точного совпадения (Элемент
И Значение).

**Точное совпадение** — Карта с тем же Элементом и Значением, что верхняя. Требуется
для хода вне очереди.

**Особая карта** — Карта с уникальным эффектом: Гидрант, Встряска, Мусорный Дайвинг,
Прятки с Лакомством, Шар Фортуны.

**Мультипёс** — Универсальная карта. Элемент Мультиматерия. Играется на что угодно.

**Шар Фортуны** — Вайлдкард с выбором из 2 случайных эффектов при розыгрыше.

**Эссенция** — Валюта прогресса, получаемая за матчи.

**Атлас** — Хаб прогресса: заклинания и косметика.

**Рейтинг** — Соревновательный режим с подбором по мастерству и глобальной таблицей.

**Система жёстких очков** — 1-3 места получают очки, 4-е теряет. Награждает стабильность.

## Стратегические термины

**Управление рукой** — Выбор, какие карты играть сейчас, какие беречь.

**Помехи** — Карты, негативно влияющие на противников. Гидрант, Встряска, Мусорный
Дайвинг.

**Темп** — Контроль потока матча. Игрок с темпом диктует, на что реагируют остальные.

**Тильт** — Эмоциональные неоптимальные решения после фрустрации. Спокойствие под
давлением — необходимость.

**Мета** — Доминирующие стратегии сообщества в данный момент. Адаптация к мете улучшает
рейтинг.

**Карточная экономика** — Отслеживание оставшихся карт в колоде и у противников.

## Зачем знать термины

- **Читать гайды** эффективнее
- **Общаться в сообществе** точнее
- **Анализировать свою игру** — называя действия и причины
- **Учиться быстрее** — связывая концепции с словарём

Сохраните эту страницу. По мере роста _Pawsome Elements_ словарь будет расширяться.

Объяснение геймплея — на странице [Геймплей](/ru/game/gameplay). Стратегии — в
[Стратегиях](/ru/game/strategy).
```

**Step 3: Verify build and commit**

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
git add src/en/news/blog/2026_04_22_* src/ru/news/blog/2026_04_22_*
```

---

## Final Step: Full Build Verification

After all 20 tasks are complete:

```bash
cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build
```

Verify that all 40 new files are created (20 EN + 20 RU) and the build produces no errors.

```bash
git add -A
```
