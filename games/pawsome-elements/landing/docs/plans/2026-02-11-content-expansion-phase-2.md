# Content Expansion Phase 2 – Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix factual inaccuracies in existing blog posts, add Contact and expanded About pages, and create 6 new SEO-friendly blog posts in EN+RU.

**Architecture:** Static 11ty site with Nunjucks templates, bilingual EN/RU. Blog posts use `layouts/blogpost.njk` with date/categories/tags frontmatter. Game/about pages use `layouts/post.njk`. Navigation via `header-nav.njk`, links in `_data/links.js`, translations in `_data/i18n/en.js` and `ru.js`. Footer in `_includes/blocks/footer.njk`.

**Tech Stack:** 11ty (Eleventy), Nunjucks, Markdown, Sass

---

## Context: Verified Game Facts (Source of Truth)

These facts were verified against the backend code in `pawsome-elements-backend/src/entity/`:

- **Elements**: Nature, Filth, Arcane (+ Multimatter for wildcards)
- **Values**: 1-9 per element (27 basic cards)
- **Special cards**: Hydrant (transforms 1 random card from each opponent), Shaking (all others draw 1), Trash Can Diving (next player draws 2 from discard), Treat Hiding (reduces spell cooldown by 1)
- **Soundboard**: DISABLED (commented out in code) — never reference
- **Ball of Fortune**: Pick 2 from 5 sub-balls (Curse, Fate, Luck, Wisdom, Wish) — all effects happen automatically
- **Multidog**: Wildcard, plays on anything
- **Card effects are automatic** — NO minigames, NO bubble popping, NO number tapping, NO device shaking
- **Spells** (6 publicly named): Pawgularity, Hesitant Paw, Unleashed Will, Tailspin, Fresh Scent, Transmutation
- **Modes**: Practice, Quick Match (2-6 players), Ranked Match (4 players)
- **9 starting cards** per player
- **Essence**: performance-based currency, multiplier tiers, can double via ad
- **Atlas**: progression hub (Spells tab + Journey tab for cosmetics)

---

## Task 1: Fix factual issues in existing English blog posts

**Why:** 4 of 5 blog posts reference "minigames" (popping bubbles, tapping numbers, shaking devices) and/or "Soundboard" — features that do not exist. These need to be softened to accurate "interactive card effects" language.

**Files:**
- Modify: `src/en/news/blog/2025_06_12_how_pawsome_elements_is_different_from_hearthstone_and_why_thats_a_good_thing.md:60-67`
- Modify: `src/en/news/blog/2025_07_01_how_uno_works_and_how_pawsome_elements_flips_the_deck.md:59-70`
- Modify: `src/en/news/blog/2025_06_25_common_card_game_strategies_and_what_might_work_in_pawsome_elements.md` (lines 28, 52, 64, 75, 77, 85)
- Modify: `src/en/news/blog/2025_06_30_how_card_games_work_core_mechanics_and_what_makes_them_fun.md:93`

**Step 1: Fix Hearthstone comparison post (EN)**

In `src/en/news/blog/2025_06_12_how_pawsome_elements_is_different_from_hearthstone_and_why_thats_a_good_thing.md`:

Replace lines 60-67 (the entire section 5):
```
## 5. Interactive Minigames Mid-Match

There's no equivalent in Hearthstone to _Pawsome Elements'_ real-time mechanics. Cards like
Hydrant, Soundboard, or Shaking trigger minigames where everyone has to act fast — pop
bubbles, tap numbers, or react before others.

It adds a physical, reactive layer of gameplay that's completely missing in traditional
card battlers.
```

With:
```
## 5. Interactive Special Cards

There's no equivalent in Hearthstone to _Pawsome Elements'_ interactive card effects. Cards
like Hydrant, Shaking, and Trash Can Diving trigger unique effects that impact all players at
the table — transforming cards in opponents' hands, forcing draws, or disrupting the pile.

These interactive moments add a layer of unpredictability that's completely missing in
traditional card battlers.
```

**Step 2: Fix UNO comparison post (EN)**

In `src/en/news/blog/2025_07_01_how_uno_works_and_how_pawsome_elements_flips_the_deck.md`:

Replace lines 59-70 (section "2. Real-Time Minigames"):
```
### 2. Real-Time Minigames

Some cards trigger **mini-challenges** where every player has to react. Pop bubbles. Tap
numbers in order. Shake your device. Last to finish? Draw a card. It's not just about
card order anymore — it's about reflexes and timing too.
```

With:
```
### 2. Interactive Special Cards

Some cards trigger **effects that impact every player at the table**. A Hydrant transforms
random cards in opponents' hands. Shaking forces everyone else to draw. These interactive
moments add a layer of surprise and strategy that goes beyond simple card order.
```

**Step 3: Fix Strategies post (EN)**

In `src/en/news/blog/2025_06_25_common_card_game_strategies_and_what_might_work_in_pawsome_elements.md`, make these replacements:

Line 28: Replace `But spells and mini-games can change things instantly` with `But spells and special card effects can change things instantly`

Line 52: Replace `Using a spell before a mini-game can disrupt their flow` with `Using a spell before a critical card effect can disrupt their flow`

Line 64: Replace `Playing fast or slow in mini-games can` with `Timing your special cards wisely can`

Line 65: Replace `also throw others off.` with `also throw others off.`

Lines 75-77: Replace:
```
This is key. With random draws, real-time mini-games, and unpredictable spells, the game rewards
quick thinking and adaptability. If your cards aren't working, try your spell. If your spell's on
cooldown, win a mini-game to buy time. There's always another angle.
```
With:
```
This is key. With random draws, interactive card effects, and unpredictable spells, the game
rewards quick thinking and adaptability. If your cards aren't working, try your spell. If your
spell's on cooldown, a well-timed special card can shift momentum. There's always another angle.
```

Line 85: Replace `mini-games and spells keep things dynamic` with `special card effects and spells keep things dynamic`

**Step 4: Fix Card Game Mechanics post (EN)**

In `src/en/news/blog/2025_06_30_how_card_games_work_core_mechanics_and_what_makes_them_fun.md`:

Line 93: Replace `**real-time mini-games**` with `**interactive special card effects**`

**Step 5: Verify build**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`
Expected: Build succeeds with no errors.

**Step 6: Stage files**

```bash
git add src/en/news/blog/
```

---

## Task 2: Fix factual issues in existing Russian blog posts

**Files:**
- Modify: `src/ru/news/blog/2025_06_12_how_pawsome_elements_is_different_from_hearthstone_and_why_thats_a_good_thing.md:51-56`
- Modify: `src/ru/news/blog/2025_07_01_how_uno_works_and_how_pawsome_elements_flips_the_deck.md:60-68,97`
- Modify: `src/ru/news/blog/2025_06_25_common_card_game_strategies_and_what_might_work_in_pawsome_elements.md` (lines 25, 43, 54, 62-63, 71)
- Modify: `src/ru/news/blog/2025_06_30_how_card_games_work_core_mechanics_and_what_makes_them_fun.md:94`

**Step 1: Fix Hearthstone comparison post (RU)**

In `src/ru/news/blog/2025_06_12_how_pawsome_elements_is_different_from_hearthstone_and_why_thats_a_good_thing.md`:

Replace lines 51-56:
```
## 5. Мини-игры прямо во время матча

В _Hearthstone_ нет аналогов механикам _Pawsome Elements_. Карты вроде Гидранта запускают
мини-игры, где все должны быстро реагировать — лопать пузыри, нажимать кнопки и т.д.

Это добавляет физический элемент, которого нет в обычных карточных играх.
```

With:
```
## 5. Интерактивные особые карты

В _Hearthstone_ нет аналогов эффектам особых карт в _Pawsome Elements_. Карты вроде Гидранта,
Встряски и Мусорного Дайвинга мгновенно влияют на всех игроков за столом — превращают карты
в руках противников, заставляют брать карты или нарушают ритм игры.

Эти интерактивные моменты добавляют непредсказуемости, которой нет в обычных карточных играх.
```

**Step 2: Fix UNO comparison post (RU)**

In `src/ru/news/blog/2025_07_01_how_uno_works_and_how_pawsome_elements_flips_the_deck.md`:

Replace lines 60-68:
```
### 2. Мини-игры в реальном времени

Некоторые карты запускают **мини-игры** для всех игроков:

- **Лопайте пузыри**
- **Нажимайте цифры по порядку**
- **Трясите устройство**

Последний? Берёт карту. Теперь важны не только карты, но и реакция.
```

With:
```
### 2. Интерактивные особые карты

Некоторые карты запускают **эффекты, затрагивающие всех игроков за столом**. Гидрант превращает
случайные карты в руках противников. Встряска заставляет всех остальных брать карты. Эти
интерактивные моменты добавляют элемент неожиданности и стратегии, выходящий за рамки простого
розыгрыша карт.
```

Also on line 97, replace `- Динамичные мини-игры` with `- Интерактивные особые карты`.

**Step 3: Fix Strategies post (RU)**

In `src/ru/news/blog/2025_06_25_common_card_game_strategies_and_what_might_work_in_pawsome_elements.md`:

Line 25: Replace `Но заклинания и мини-игры могут всё изменить` with `Но заклинания и эффекты особых карт могут всё изменить`

Line 43: Replace `Заклинания перед мини-игрой могут дать преимущество.` with `Заклинание, использованное перед ключевым моментом, может дать преимущество.`

Line 54: Replace `- Менять скорость в мини-играх` with `- Выбирать момент для розыгрыша особых карт`

Lines 62-63: Replace:
```
Ключевой навык. Случайные карты и мини-игры требуют быстрой адаптации.
Нет подходящих карт? Используйте заклинание. Оно перезаряжается? Выиграйте мини-игру.
```
With:
```
Ключевой навык. Случайные карты и эффекты особых карт требуют быстрой адаптации.
Нет подходящих карт? Используйте заклинание. Оно перезаряжается? Используйте особую карту.
```

Line 71: Replace `— мини-игры добавляют хаоса` with `— эффекты особых карт добавляют хаоса`

**Step 4: Fix Card Game Mechanics post (RU)**

In `src/ru/news/blog/2025_06_30_how_card_games_work_core_mechanics_and_what_makes_them_fun.md`:

Line 94: Replace `Мини-игры в реальном времени` with `Интерактивные эффекты особых карт`

**Step 5: Verify build**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

**Step 6: Stage files**

```bash
git add src/ru/news/blog/
```

---

## Task 3: Fix "minigame" language in game pages

**Files:**
- Modify: `src/en/game/gameplay.md:81`
- Modify: `src/en/game/beginners-guide.md:15`
- Modify: `src/ru/game/gameplay.md` (equivalent line)
- Modify: `src/ru/game/beginners-guide.md:15`

**Step 1: Fix EN gameplay.md**

In `src/en/game/gameplay.md` line 81:
Replace `- Includes real-time interactions and minigames for everyone`
With `- Includes interactive special cards that affect all players at the table`

**Step 2: Fix EN beginners-guide.md**

In `src/en/game/beginners-guide.md` line 15:
Replace `unique twists — spells, interactive minigames, and a ranked competitive system`
With `unique twists — spells, interactive special cards, and a ranked competitive system`

**Step 3: Fix RU gameplay.md**

Read `src/ru/game/gameplay.md` and find the equivalent line about minigames/interactions. Replace with Russian equivalent: `- Интерактивные особые карты, затрагивающие всех игроков за столом`

**Step 4: Fix RU beginners-guide.md**

In `src/ru/game/beginners-guide.md` line 15:
Replace `интерактивными мини-играми` with `интерактивными особыми картами`

**Step 5: Verify build**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

**Step 6: Stage files**

```bash
git add src/en/game/gameplay.md src/en/game/beginners-guide.md src/ru/game/gameplay.md src/ru/game/beginners-guide.md
```

---

## Task 4: Create Contact page and update config

**Files:**
- Create: `src/en/contact.md`
- Create: `src/ru/contact.md`
- Modify: `src/_data/links.js`
- Modify: `src/_data/i18n/en.js`
- Modify: `src/_data/i18n/ru.js`
- Modify: `src/_includes/blocks/header-nav.njk`
- Modify: `src/_includes/blocks/footer.njk`

**Step 1: Add contact route to links.js**

In `src/_data/links.js`, add after the `about: 'about',` line:

```javascript
contact: 'contact',
```

**Step 2: Add nav translation keys**

In `src/_data/i18n/en.js`, add in the nav section (after the `about` key):
```javascript
contact: 'Contact',
```

In `src/_data/i18n/ru.js`, add in the nav section (after the `about` key):
```javascript
contact: 'Контакты',
```

**Step 3: Add Contact to header-nav.njk**

In `src/_includes/blocks/header-nav.njk`, in the About section's items array, add a new item after the privacy policy entry:

```nunjucks
{ label: "nav.contact" | i18n, url: "/" + locale + "/" + links.contact }
```

So the About section becomes:
```nunjucks
{# About #}
{% set navItem = {
  buttonLabel: "nav.about" | i18n,
  buttonId: "nav-about-button",
  items: [
        { label: "nav.about" | i18n, url: "/" + locale + "/" + links.about },
        { label: "nav.contact" | i18n, url: "/" + locale + "/" + links.contact },
        { label: "nav.legalNotice" | i18n, url: "/" + locale + "/" + links.legalNotice },
        { label: "nav.privacyPolicy" | i18n, url: "/" + locale + "/" + links.privacyPolicy }
      ]
} %}
```

**Step 4: Add Contact link to footer.njk**

In `src/_includes/blocks/footer.njk`, add a new list item in the footer links, before legal notice:

```nunjucks
<li><a href="/{{ locale }}/{{ links.contact }}">{{ 'nav.contact' | i18n }}</a></li>
```

**Step 5: Create EN contact page**

Create `src/en/contact.md`:

```markdown
---
layout: layouts/post.njk
title: Pawsome Elements | Contact Us
pageTitle: Contact Us
---

**We'd Love to Hear from You**

Have a question, found a bug, or just want to share feedback? Reach out to us and we will get
back to you as soon as possible.

## Get in Touch

The best way to reach us is by email:

**contact@kwokka.co**

Whether it's feedback, a bug report, a business inquiry, or just a kind word — we read every
message.

## Join the Community

For faster responses and real-time chat, join our community channels:

- [Discord]({{links.socials.discord}}) — Talk strategy, report bugs, suggest features, or hang
  out with the pack.
- [Reddit]({{links.socials.reddit}}) — Share your experience and follow development updates.

## Reporting a Bug?

If you're reporting a bug, please include the following to help us fix it faster:

- **Your device and browser** (e.g., iPhone 15 / Safari, Windows PC / Chrome)
- **What you were doing** when the issue occurred
- **Screenshots or screen recordings**, if possible
- **Steps to reproduce** the problem

## Business Inquiries

For partnerships, press, or business-related questions, contact us at **contact@kwokka.co**
with the subject line "Business Inquiry".

## Follow Us

Stay updated on new features, events, and community highlights:

- [Instagram]({{links.socials.instagram}})
- [TikTok]({{links.socials.tiktok}})
- [YouTube]({{links.socials.youtube}})
```

**Step 6: Create RU contact page**

Create `src/ru/contact.md`:

```markdown
---
layout: layouts/post.njk
title: Pawsome Elements | Контакты
pageTitle: Контакты
---

**Будем рады вашему обращению**

Есть вопрос, нашли баг или просто хотите поделиться отзывом? Напишите нам, и мы ответим
как можно скорее.

## Связаться с нами

Лучший способ связи — электронная почта:

**contact@kwokka.co**

Обратная связь, баг-репорт, деловое предложение или просто доброе слово — мы читаем
каждое сообщение.

## Присоединяйтесь к сообществу

Для быстрых ответов и общения в реальном времени:

- [Discord]({{links.socials.discord}}) — обсуждайте стратегии, сообщайте о багах,
  предлагайте идеи или просто общайтесь.
- [Reddit]({{links.socials.reddit}}) — делитесь опытом и следите за обновлениями.

## Нашли баг?

Если вы сообщаете об ошибке, пожалуйста, укажите следующее для быстрого исправления:

- **Устройство и браузер** (например, iPhone 15 / Safari, ПК / Chrome)
- **Что вы делали**, когда произошла ошибка
- **Скриншоты или запись экрана**, если возможно
- **Шаги для воспроизведения** проблемы

## Деловые предложения

По вопросам партнёрства, прессы или бизнеса пишите на **contact@kwokka.co** с темой
"Деловое предложение".

## Следите за нами

Будьте в курсе новых функций, событий и новостей:

- [Instagram]({{links.socials.instagram}})
- [TikTok]({{links.socials.tiktok}})
- [YouTube]({{links.socials.youtube}})
```

**Step 7: Verify build**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

**Step 8: Stage files**

```bash
git add src/en/contact.md src/ru/contact.md src/_data/links.js src/_data/i18n/en.js src/_data/i18n/ru.js src/_includes/blocks/header-nav.njk src/_includes/blocks/footer.njk
```

---

## Task 5: Expand About Us page

**Why:** Current About page is only 6 lines. Expanding it adds more content, improves SEO, and gives visitors a better sense of the team and product.

**Files:**
- Modify: `src/en/about.md`
- Modify: `src/ru/about.md`

**Step 1: Expand EN about page**

Replace the entire content of `src/en/about.md` (after frontmatter) with:

```markdown
---
layout: layouts/post.njk
title: Pawsome Elements | About Us
pageTitle: About Us
---

**Just Two Dudes Who Love Games**

Hey! We're Georgii and Philip — two friends who grew up obsessed with games. Not just playing
them, but arguing over them, breaking them, and trying to outplay each other at every turn.

## How It All Started

It started as a small idea:

> "What if UNO had spells... and dogs?"

We wanted something simple, fast, and fun — but with enough room for mind games, wild comebacks,
and competitive chaos. Something you could pick up in seconds but keep coming back to for months.

And then we couldn't stop building.

## What We Built

_Pawsome Elements_ is our love letter to games that make you laugh, swear, and immediately hit
"rematch." It blends the instant fun of classic card games with deeper strategy through
[spells](/{{locale}}/{{links.game.spells}}), [special cards](/{{locale}}/{{links.game.cards}}),
and a [competitive ranked system](/{{locale}}/{{links.game.ranked}}).

Every match uses a shared deck — no pay-to-win, no grinding for better cards. Just skill,
timing, and a bit of luck.

## What Drives Us

We believe games should be:

- **Fair** — Everyone plays from the same deck. Skill decides the winner.
- **Fast** — Matches take minutes, not hours.
- **Fun for everyone** — Whether you play casually with friends or compete in ranked matches.
- **Respectful of your time** — No mandatory ads, no paywalls blocking content.

## The Road Ahead

We're constantly improving _Pawsome Elements_ based on player feedback. New spells, new
cosmetics, balance updates, and quality-of-life improvements are always in the works.

Want to help shape the game? Join our [Discord]({{links.socials.discord}}) community,
follow us on [Instagram]({{links.socials.instagram}}) or [TikTok]({{links.socials.tiktok}}),
or [contact us](/{{locale}}/{{links.contact}}) directly.

Thanks for playing — and see you in the arena.

– Georgii & Philip
```

**Step 2: Expand RU about page**

Replace the entire content of `src/ru/about.md` with:

```markdown
---
layout: layouts/post.njk
title: Pawsome Elements | О нас
pageTitle: О нас
---

**Просто два чувака, которые обожают игры**

Привет! Мы — Георгий и Филипп. Два друга, которые с детства помешаны на играх. Не просто играли
в них, а спорили о них, ломали их и постоянно пытались переиграть друг друга.

## Как всё началось

Всё началось с простой идеи:

> "А что, если бы в UNO были заклинания... и собаки?"

Мы хотели сделать что-то простое, быстрое и весёлое — но с возможностью для психологических игр,
невероятных камбэков и соревновательного хаоса. Чтобы правила были понятны за минуту, а возвращаться
хотелось месяцами.

И понеслось. Мы просто не могли остановиться!

## Что мы создали

_Pawsome Elements_ — это наша дань любви играм, которые заставляют вас смеяться, ругаться
и сразу же жать на кнопку "ещё одну партию". Мы соединили мгновенное веселье классических
карточных игр с глубокой стратегией через
[заклинания](/{{locale}}/{{links.game.spells}}),
[особые карты](/{{locale}}/{{links.game.cards}}) и
[рейтинговую систему](/{{locale}}/{{links.game.ranked}}).

Каждый матч играется из общей колоды — никакого pay-to-win, никакого гринда. Только мастерство,
тайминг и немного удачи.

## Наши принципы

Мы верим, что игры должны быть:

- **Честными** — все играют из одной колоды. Победу определяет мастерство.
- **Быстрыми** — матчи длятся минуты, а не часы.
- **Весёлыми для всех** — и для компании друзей, и для соревновательных игроков.
- **Уважительными к вашему времени** — никакой обязательной рекламы и платных стен.

## Что дальше

Мы постоянно улучшаем _Pawsome Elements_ на основе отзывов игроков. Новые заклинания, новая
косметика, обновления баланса и улучшения качества жизни — всё это в работе.

Хотите помочь в развитии игры? Присоединяйтесь к нашему [Discord]({{links.socials.discord}}),
подписывайтесь на [Instagram]({{links.socials.instagram}}) или [TikTok]({{links.socials.tiktok}}),
или [напишите нам](/{{locale}}/{{links.contact}}) напрямую.

Спасибо, что играете — увидимся на арене.

– Георгий и Филипп
```

**Step 3: Verify build**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

**Step 4: Stage files**

```bash
git add src/en/about.md src/ru/about.md
```

---

## Task 6: New blog post — "Understanding the Three Elements"

**Why:** SEO-rich educational content targeting "pawsome elements nature filth arcane", "card game elements system". Deep dive into the element matching system with strategy implications.

**Files:**
- Create: `src/en/news/blog/2026_01_15_understanding_the_three_elements_nature_filth_and_arcane.md`
- Create: `src/ru/news/blog/2026_01_15_understanding_the_three_elements_nature_filth_and_arcane.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_01_15_understanding_the_three_elements_nature_filth_and_arcane.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Understanding the Three Elements: Nature, Filth, and Arcane'
pageTitle: 'Understanding the Three Elements: Nature, Filth, and Arcane'
date: 2026-01-15
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

At the heart of every match in _Pawsome Elements_ lies a simple but powerful system: **three
Elements** that define how cards connect, how strategies form, and how games unfold.

Whether you are a new player trying to understand the basics or an experienced competitor
looking for a deeper edge, understanding Elements is fundamental to playing well.

## The Three Elements

Every basic card in _Pawsome Elements_ belongs to one of three Elements:

- **Nature** — Represented by organic, earthy energy.
- **Filth** — Represented by gritty, chaotic energy.
- **Arcane** — Represented by mystical, refined energy.

Each Element has **9 basic cards**, numbered 1 through 9. That gives you **27 basic cards**
across the three Elements in the shared deck.

Beyond basic cards, each Element also includes its own set of **special cards** — Hydrant,
Shaking, Trash Can Diving, and Treat Hiding — each with a unique effect when played.

## How Element Matching Works

On your turn, you play a card that matches the top card on the pile by either:

- **Element** — Play any card of the same Element, regardless of Value.
- **Value** — Play any card with the same number, regardless of Element.

This dual-matching system is what creates strategic depth. You are constantly choosing between
playing by Element (keeping your options in that Element open) or by Value (switching Elements
to potentially catch opponents off guard).

## Element Awareness: The Hidden Skill

One of the most underrated skills in _Pawsome Elements_ is **tracking which Elements are in
play**. Here is why it matters:

### Reading the Table

If you notice that a lot of Nature cards have been played recently, there are fewer Nature
cards remaining in the deck and in other players' hands. This means:

- Players holding Nature cards have **fewer matching options** coming their way.
- Switching to a different Element may leave opponents unable to respond.

### Controlling the Element

If you hold multiple cards of one Element, you can **dominate the pile** by playing them
in sequence. This forces opponents to either match your Element or play by Value — limiting
their choices.

### Forcing a Draw

If you know an opponent is low on a certain Element, switching to that Element can force them
to draw. This is especially powerful in the late game when card counts are low.

## Special Cards and Elements

Each special card belongs to a specific Element and follows normal Element-matching rules.
But their effects make them valuable beyond just matching:

- **Hydrant** — Transforms a random card in each opponent's hand. Can disrupt players who
  have been building up a strong Element hand.
- **Shaking** — Forces all other players to draw 1 card. Increases opponents' hand sizes
  while you stay lean.
- **Trash Can Diving** — The next player draws 2 from the discard pile. Can be timed to
  feed an opponent cards they cannot use.
- **Treat Hiding** — Reduces your spell cooldown by 1 turn. Accelerates your spell strategy.

Playing a special card also sets the pile to that card's Element — which can be a strategic
move in itself.

## The Wildcards: Multidog and Ball of Fortune

Two cards break the Element system entirely:

- **Multidog** belongs to the special **Multimatter** Element and can be played on anything.
  Any card can also be played on top of it.
- **Ball of Fortune** also plays on anything and offers a choice between two random effects.

These wildcards are rare and powerful. They let you break out of Element deadlocks or shift
the game's direction entirely.

## Practical Tips

1. **Count by Element** — Keep a rough mental note of how many cards of each Element have
   been played. This helps predict what opponents hold.
2. **Match by Element when you can** — Playing by Element keeps more options open for future
   turns than playing by Value alone.
3. **Switch Elements to disrupt** — If opponents seem comfortable, changing the pile's
   Element can force them to draw.
4. **Save Multidogs for Element deadlocks** — Do not waste your wildcard early when Element
   matching still has options.
5. **Use special cards to set the Element** — Playing a Hydrant also changes the pile's
   Element, which can be as valuable as its effect.

## Mastering Elements Takes Time

Understanding Elements is not just about knowing what they are — it is about developing an
instinct for how they flow during a match. The more you play, the better you will get at
reading the table, anticipating opponents, and controlling the game through smart Element play.

Want to go deeper? Read the [Cards guide](/en/game/cards) for a complete breakdown of every
card, or check out the [Strategy Guide](/en/game/strategy) for advanced tactics.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_01_15_understanding_the_three_elements_nature_filth_and_arcane.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Три Элемента: Природа, Скверна и Аркана'
pageTitle: 'Три Элемента: Природа, Скверна и Аркана'
date: 2026-01-15
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

В основе каждого матча _Pawsome Elements_ лежит простая, но мощная система: **три Элемента**,
которые определяют связи между картами, формируют стратегии и влияют на ход игры.

Независимо от того, изучаете ли вы основы или ищете конкурентное преимущество — понимание
Элементов критически важно для хорошей игры.

## Три Элемента

Каждая обычная карта в _Pawsome Elements_ принадлежит одному из трёх Элементов:

- **Природа** — органическая, земная энергия.
- **Скверна** — грубая, хаотичная энергия.
- **Аркана** — мистическая, утончённая энергия.

У каждого Элемента **9 обычных карт** со значениями от 1 до 9. Итого **27 обычных карт**
трёх Элементов в общей колоде.

Помимо обычных карт, каждый Элемент включает набор **особых карт** — Гидрант, Встряска,
Мусорный Дайвинг и Прятки с Лакомством — каждая с уникальным эффектом при розыгрыше.

## Как работает совпадение по Элементу

В свой ход вы играете карту, совпадающую с верхней картой на столе по:

- **Элементу** — любая карта того же Элемента, независимо от Значения.
- **Значению** — любая карта с тем же числом, независимо от Элемента.

Эта система двойного совпадения создаёт стратегическую глубину. Вы постоянно выбираете
между игрой по Элементу (сохраняя варианты в этом Элементе) или по Значению (переключая
Элемент, чтобы застать противников врасплох).

## Отслеживание Элементов: скрытый навык

Один из самых недооценённых навыков в _Pawsome Elements_ — **отслеживание Элементов в игре**.

### Чтение стола

Если вы замечаете, что недавно было сыграно много карт Природы, значит, карт Природы
осталось меньше в колоде и у других игроков. Это означает:

- У игроков с картами Природы **меньше вариантов для совпадения**.
- Переключение на другой Элемент может лишить противников возможности ходить.

### Контроль Элемента

Если у вас несколько карт одного Элемента, вы можете **доминировать на столе**, играя
их подряд. Это вынуждает противников совпадать по Элементу или по Значению — ограничивая
их выбор.

### Вынуждение к взятию

Если вы знаете, что у противника мало карт определённого Элемента, переключение на этот
Элемент заставит его брать из колоды. Особенно эффективно в конце игры.

## Особые карты и Элементы

Каждая особая карта принадлежит конкретному Элементу и подчиняется обычным правилам
совпадения. Но их эффекты делают их ценными не только для совпадения:

- **Гидрант** — превращает случайную карту у каждого противника. Может разрушить сильную
  руку по определённому Элементу.
- **Встряска** — все остальные берут по 1 карте. Увеличивает руки противников, пока
  вы остаётесь в форме.
- **Мусорный Дайвинг** — следующий берёт 2 карты из сброса. Можно рассчитать момент,
  чтобы дать противнику бесполезные карты.
- **Прятки с Лакомством** — уменьшает перезарядку заклинания на 1 ход. Ускоряет
  стратегию заклинаний.

Розыгрыш особой карты также задаёт Элемент стола — что само по себе может быть
стратегическим ходом.

## Универсальные карты: Мультипёс и Шар Фортуны

Две карты полностью игнорируют систему Элементов:

- **Мультипёс** принадлежит особому элементу **Мультиматерия** и играется на что угодно.
  Любая карта также может быть сыграна поверх Мультипса.
- **Шар Фортуны** тоже играется на что угодно и предлагает выбор из двух случайных эффектов.

Эти карты редки и ценны. Они позволяют вырваться из тупика по Элементу или кардинально
изменить направление игры.

## Практические советы

1. **Считайте по Элементам** — держите в памяти примерное количество сыгранных карт
   каждого Элемента. Это помогает предугадать руки противников.
2. **Совпадайте по Элементу, если можете** — это сохраняет больше вариантов для будущих
   ходов, чем совпадение только по Значению.
3. **Переключайте Элемент для помех** — если противники чувствуют себя комфортно, смена
   Элемента стола может заставить их брать из колоды.
4. **Берегите Мультипсов для тупиков** — не тратьте универсальную карту рано, когда
   совпадение по Элементу ещё возможно.
5. **Используйте особые карты для смены Элемента** — розыгрыш Гидранта также меняет
   Элемент стола, что может быть не менее ценно, чем сам эффект.

## Мастерство Элементов приходит с опытом

Понимание Элементов — это не просто знание, что они есть. Это развитие интуиции — как
они перетекают во время матча. Чем больше вы играете, тем лучше будете читать стол,
предвидеть действия противников и контролировать игру через грамотную работу с Элементами.

Хотите узнать больше? Читайте [гайд по картам](/ru/game/cards) для полного описания каждой
карты или [стратегии](/ru/game/strategy) для продвинутых тактик.
```

**Step 3: Verify build**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

**Step 4: Stage files**

```bash
git add src/en/news/blog/2026_01_15_* src/ru/news/blog/2026_01_15_*
```

---

## Task 7: New blog post — "Which Spell Should You Choose?"

**Why:** SEO-rich comparison content targeting "best spell pawsome elements", "spell guide card game". Compares all 6 publicly named spells with use cases and playstyle recommendations.

**Files:**
- Create: `src/en/news/blog/2026_01_22_which_spell_should_you_choose_a_complete_spell_comparison.md`
- Create: `src/ru/news/blog/2026_01_22_which_spell_should_you_choose_a_complete_spell_comparison.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_01_22_which_spell_should_you_choose_a_complete_spell_comparison.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Which Spell Should You Choose? A Complete Spell Comparison'
pageTitle: 'Which Spell Should You Choose? A Complete Spell Comparison'
date: 2026-01-22
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Before every match in _Pawsome Elements_, you make one critical decision: **which spell
to equip**. Your spell choice shapes your entire strategy — it defines your backup plan,
your strongest move, and how you handle pressure.

But with multiple spells to choose from, how do you know which one fits your playstyle?
Here is a breakdown of every publicly available spell and when to use each one.

## How Spells Work

Quick refresher: you equip **one spell** before each match. During the game, instead of
playing a card on your turn, you can activate your spell. After use, it goes on **cooldown**
for several turns. Cards like Treat Hiding can reduce this cooldown.

The key decision is always: **play a card, or cast your spell?**

## The Spells

### Pawgularity

**Effect:** Transform any card in your hand into a **Multidog**.

**Best for:** Players who want a guaranteed escape from tough situations.

Pawgularity is the most straightforward spell. Stuck with unplayable cards? Turn one into
the ultimate wildcard. It is especially powerful in the late game when your hand is small
and every card matters.

**Tip:** Do not use Pawgularity early just because you can. Save it for when you truly
have no plays, or when converting a card will let you win on your next turn.

### Hesitant Paw

**Effect:** Start the match with **2 fewer cards** than everyone else.

**Best for:** Aggressive players who want a head start.

While every other player starts with 9 cards, you start with 7. That is a significant
advantage in a game where the goal is to empty your hand first. The trade-off? You have
fewer options early on, which can leave you vulnerable if your starting hand is weak.

**Tip:** Hesitant Paw works best with confident, experienced players who can make the most
of a smaller hand. Beginners may find themselves stuck early with fewer cards to choose from.

### Unleashed Will

**Effect:** Select any card in your hand and play it **without restrictions** — it does not
need to match the Element or Value.

**Best for:** Players who want flexibility and the ability to break out of deadlocks.

Unleashed Will is incredibly versatile. It lets you play literally anything from your hand,
bypassing all matching rules. Use it when you are stuck, when you want to change the Element
on the pile, or when you have a specific special card you want to trigger.

**Tip:** This spell is strongest when you hold a special card (like Hydrant or Ball of
Fortune) that you want to play but cannot match normally.

### Tailspin

**Effect:** Shuffle one random card from your hand back into the deck.

**Best for:** Players who want to clean up their hand and optimize their options.

Tailspin removes a random card from your hand — reducing your card count by one. The downside
is that you cannot choose which card goes away. But statistically, removing any card when you
are stuck is better than drawing more.

**Tip:** Use Tailspin when your hand is full of unmatchable cards. Even losing a random card
can improve your odds.

### Fresh Scent

**Effect:** Shuffle your entire hand into the deck and draw the same number of fresh cards.

**Best for:** Players who want a complete reset when things go badly.

Fresh Scent is high-risk, high-reward. Your entire hand changes. It can save you from an
unplayable hand — or give you an equally bad one. But in desperate situations, a fresh
start is often better than grinding through bad cards.

**Tip:** Use Fresh Scent when most of your hand is dead weight. If you have some good
cards, consider whether losing them is worth the gamble.

### Transmutation

**Effect:** Select one of your cards, then transform one random card from every opponent's
hand into a copy of that card.

**Best for:** Disruptive players who want to mess with opponents' strategies.

Transmutation is the most aggressive spell. You choose one of your cards, and every opponent
gets one of their cards replaced with a copy of it. This can fill opponents' hands with
low-value or unmatchable cards while reducing the variety of their options.

**Tip:** Choose a card that is hard for opponents to play given the current pile. For
maximum disruption, pick a card of an Element that has been rarely played.

## Choosing by Playstyle

| Playstyle | Recommended Spell |
|-----------|-------------------|
| Safe and reliable | Pawgularity |
| Aggressive and fast | Hesitant Paw |
| Flexible and adaptive | Unleashed Will |
| Optimization-focused | Tailspin |
| Risk-taking and desperate | Fresh Scent |
| Disruptive and chaotic | Transmutation |

## Spell Timing Matters More Than Spell Choice

The best spell in the world is useless if you use it at the wrong time. No matter which
spell you equip, remember:

- **Do not cast early** unless you have a clear reason.
- **Watch your cooldown** — once used, you are without a spell for several turns.
- **Cards like Treat Hiding reduce cooldown** — factor this into your timing.
- **Ball of Wisdom (from Ball of Fortune) resets cooldown entirely** — keep this in mind
  if you play Ball of Fortune.

## Experiment and Find Your Style

There is no single "best" spell — each one fits different situations and playstyles. The best
approach is to try them all in [Quick Matches](/en/game/gameplay) and see which one feels
natural.

For more on spell mechanics, visit the [Spells page](/en/game/spells). For advanced spell
timing tactics, check the [Strategy Guide](/en/game/strategy).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_01_22_which_spell_should_you_choose_a_complete_spell_comparison.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Какое Заклинание Выбрать? Полное Сравнение'
pageTitle: 'Какое Заклинание Выбрать? Полное Сравнение'
date: 2026-01-22
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Перед каждым матчем в _Pawsome Elements_ вы принимаете одно ключевое решение: **какое
заклинание экипировать**. Этот выбор определяет вашу стратегию — запасной план, сильнейший
ход и способ справляться с давлением.

Но с несколькими заклинаниями на выбор — как понять, какое подходит именно вам? Вот
разбор каждого доступного заклинания с рекомендациями.

## Как работают заклинания

Напомним: вы выбираете **одно заклинание** перед каждым матчем. Во время игры вместо
розыгрыша карты можно активировать заклинание. После использования оно уходит на
**перезарядку** на несколько ходов. Карты Прятки с Лакомством уменьшают перезарядку.

Ключевой вопрос всегда: **сыграть карту или использовать заклинание?**

## Заклинания

### Сингупёсность

**Эффект:** Превращает любую карту в руке в **Мультипса**.

**Подходит для:** Игроков, которые хотят гарантированный выход из сложных ситуаций.

Сингупёсность — самое простое заклинание. Застряли с неиграемыми картами? Превратите одну
в универсальный вайлдкард. Особенно сильно в поздней игре, когда каждая карта на счету.

**Совет:** Не используйте рано просто потому, что можете. Сохраните для ситуации, когда
нет ходов или конвертация карты позволит победить на следующем ходу.

### Лапа Отказа

**Эффект:** Начинаете матч с **2 картами меньше**, чем все остальные.

**Подходит для:** Агрессивных игроков, желающих получить фору.

Все начинают с 9 картами, а вы — с 7. Значительное преимущество в игре, где цель —
первым опустошить руку. Компромисс? Меньше вариантов в начале, что может быть опасно
при слабой стартовой руке.

**Совет:** Лучше работает у опытных игроков. Новички могут застрять в начале с меньшим
количеством карт для выбора.

### Освобождённая Воля

**Эффект:** Выберите любую карту и сыграйте её **без ограничений** — не нужно совпадение
по Элементу или Значению.

**Подходит для:** Игроков, ценящих гибкость и возможность выйти из тупика.

Невероятно универсальное заклинание. Позволяет сыграть буквально любую карту из руки,
игнорируя все правила совпадения. Используйте, когда застряли, хотите сменить Элемент
стола или хотите активировать конкретную особую карту.

**Совет:** Сильнее всего, когда вы держите особую карту (Гидрант или Шар Фортуны),
которую хотите сыграть, но не можете по правилам совпадения.

### Хвостовой Вихрь

**Эффект:** Одна случайная карта из руки замешивается обратно в колоду.

**Подходит для:** Игроков, которые хотят оптимизировать руку.

Убирает случайную карту из руки — уменьшая количество карт на одну. Минус — вы не
выбираете, какая карта уйдёт. Но статистически удаление любой карты при застое лучше,
чем взятие новых.

**Совет:** Используйте, когда рука полна несовпадающих карт. Даже потеря случайной
карты улучшает шансы.

### Свежесть

**Эффект:** Замешивает всю руку в колоду и берёт столько же новых карт.

**Подходит для:** Игроков, готовых на полную перезагрузку в критической ситуации.

Высокий риск, высокая награда. Вся рука меняется. Может спасти от неиграемой руки —
или дать столь же плохую. Но в отчаянной ситуации новый старт часто лучше, чем мучения
с плохими картами.

**Совет:** Используйте, когда большинство карт бесполезны. Если есть хорошие карты,
подумайте, стоит ли рисковать ими.

### Трансмутация

**Эффект:** Выберите свою карту, затем у каждого противника одна случайная карта
превращается в копию выбранной.

**Подходит для:** Агрессивных игроков, которые хотят мешать стратегиям противников.

Самое агрессивное заклинание. Вы выбираете карту, и у каждого противника случайная карта
заменяется её копией. Это может заполнить руки противников неиграемыми картами.

**Совет:** Выбирайте карту, которую сложно сыграть при текущем состоянии стола. Для
максимальной помехи выберите карту редко играемого Элемента.

## Выбор по стилю игры

| Стиль игры | Рекомендуемое заклинание |
|------------|-------------------------|
| Надёжный и безопасный | Сингупёсность |
| Агрессивный и быстрый | Лапа Отказа |
| Гибкий и адаптивный | Освобождённая Воля |
| Оптимизация | Хвостовой Вихрь |
| Рискованный и отчаянный | Свежесть |
| Разрушительный и хаотичный | Трансмутация |

## Тайминг важнее выбора заклинания

Лучшее заклинание бесполезно, если использовать его не вовремя. Какое бы ни было:

- **Не активируйте рано** без чёткой причины.
- **Следите за перезарядкой** — после использования вы несколько ходов без заклинания.
- **Прятки с Лакомством уменьшают перезарядку** — учитывайте это.
- **Шар Мудрости (из Шара Фортуны) сбрасывает перезарядку полностью** — помните об этом.

## Экспериментируйте

Нет единственного "лучшего" заклинания — каждое подходит для разных ситуаций и стилей.
Попробуйте все в [быстрых матчах](/ru/game/gameplay) и найдите своё.

Подробнее о механиках заклинаний — на странице [Заклинания](/ru/game/spells). Продвинутые
тактики тайминга — в [Стратегиях](/ru/game/strategy).
```

**Step 3: Verify build and stage files**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

```bash
git add src/en/news/blog/2026_01_22_* src/ru/news/blog/2026_01_22_*
```

---

## Task 8: New blog post — "Mastering Out-of-Turn Play"

**Why:** Targets "card game advanced tactics", "out of turn play strategy". Covers the most unique mechanic in PE. High-value SEO content since no competitors have this mechanic.

**Files:**
- Create: `src/en/news/blog/2026_01_29_mastering_out_of_turn_play_in_pawsome_elements.md`
- Create: `src/ru/news/blog/2026_01_29_mastering_out_of_turn_play_in_pawsome_elements.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_01_29_mastering_out_of_turn_play_in_pawsome_elements.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Mastering Out-of-Turn Play: The Most Underrated Tactic'
pageTitle: 'Mastering Out-of-Turn Play: The Most Underrated Tactic'
date: 2026-01-29
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Most card games follow a strict turn order. You wait, you play, you wait again. But in
_Pawsome Elements_, there is a mechanic that breaks this convention entirely: **out-of-turn
play**.

It is one of the most powerful tactics in the game — and most players underuse it.

## What Is Out-of-Turn Play?

If you hold a card that is an **exact match** to the top card on the pile — meaning it shares
**both the same Element and the same Value** — you can play it immediately, even when it is
not your turn.

When you do this:

- Your card becomes the new top of the pile.
- The turn order **shifts to you** — the next player in order after you takes their turn.
- Everyone who was supposed to play before you **loses their turn**.

This single mechanic changes the entire dynamic of the game.

## Why Out-of-Turn Play Is So Powerful

### 1. It Skips Opponents

Playing out of turn can skip one or more players, denying them the chance to play cards.
In a 4-player ranked match, skipping even one player can change the game's outcome.

### 2. It Disrupts Strategy

Opponents plan their moves based on when they expect to play. When you interrupt the order,
their timing-dependent strategies fall apart. A player saving a Hydrant for the right moment
may never get the chance to use it.

### 3. It Reduces Your Hand Faster

Every out-of-turn play is an extra card played without waiting. If you can play two or three
cards between normal turns, you are racing ahead while opponents are stuck waiting.

### 4. It Can Chain

If your out-of-turn play creates a new top card that another player can exactly match, they
can play out of turn too. This creates chain reactions that dramatically shift momentum.

## When to Use Out-of-Turn Play

### Always Check Your Hand

Every time a card is played — by anyone — glance at your hand. Do you have the exact same
card (same Element and same Value)? If yes, you have an opportunity.

### Late Game Is Critical

In the final rounds, when you have 2-3 cards left, out-of-turn plays can win you the game.
Playing your second-to-last card out of turn and then finishing on your actual turn is a
classic winning move.

### After Special Cards

Special cards like Hydrant can transform cards in your hand. If a Hydrant gives you a card
that matches the current pile exactly, play it immediately.

### When Opponents Are Close to Winning

If another player is down to 1-2 cards, every skipped turn matters. Playing out of turn
before them can buy time or let you finish first.

## Common Mistakes

### Forgetting to Check

The biggest mistake is simply not watching for opportunities. Make it a habit to scan your
hand every time the pile changes.

### Playing Out of Turn Too Eagerly

Sometimes holding an exact match is more valuable than playing it immediately. If you are
in a comfortable position and another player is about to play a card you want on the pile,
waiting may be better.

### Not Considering What You Leave Behind

When you play out of turn, you set the pile to that card's Element and Value. Think about
whether the resulting pile helps or hurts you on your next actual turn.

## Practice Tips

1. **Play Practice Mode and focus on out-of-turn plays** — try to play at least one
   out-of-turn card per game.
2. **Watch the pile constantly** — not just on your turn, but every single play.
3. **Keep exact-match cards in mind** — when you draw a card, note if it matches anything
   currently common on the pile.
4. **Time it right** — especially in ranked, wait for the moment when skipping opponents
   matters most.

## The Competitive Edge

In ranked matches, players who consistently use out-of-turn plays have a measurable
advantage. It is one of the clearest skill differentiators between casual and competitive
players.

The best part? You do not need to unlock anything or grind for it. Out-of-turn play is
available from your very first match — you just need to learn to see it.

For more tactics, read the [Strategy Guide](/en/game/strategy). To learn about all card
types and their effects, visit the [Cards page](/en/game/cards).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_01_29_mastering_out_of_turn_play_in_pawsome_elements.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Ход Вне Очереди: Самая Недооценённая Тактика'
pageTitle: 'Ход Вне Очереди: Самая Недооценённая Тактика'
date: 2026-01-29
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

В большинстве карточных игр порядок ходов строгий. Ждёте, ходите, снова ждёте. Но в
_Pawsome Elements_ есть механика, которая ломает этот порядок: **ход вне очереди**.

Это одна из самых мощных тактик в игре — и большинство игроков ею пренебрегают.

## Что такое ход вне очереди?

Если у вас на руке карта — **точное совпадение** с верхней картой стола (одинаковый
**Элемент и Значение**) — вы можете сыграть её немедленно, даже если сейчас не ваш ход.

Что происходит:

- Ваша карта становится новой верхней картой.
- Порядок ходов **сдвигается к вам** — следующим ходит игрок после вас.
- Все, кто должен был ходить до вас, **пропускают ход**.

Одна эта механика меняет всю динамику игры.

## Почему ход вне очереди так силён

### 1. Пропуск противников

Ход вне очереди пропускает одного или нескольких игроков. В рейтинговом матче на 4 игроков
пропуск даже одного может решить исход партии.

### 2. Нарушение стратегии

Противники планируют ходы, исходя из ожидаемого порядка. Когда вы вмешиваетесь, их
стратегии рушатся. Игрок, копивший Гидрант для нужного момента, может не успеть его
сыграть.

### 3. Быстрое уменьшение руки

Каждый ход вне очереди — это дополнительная карта, сыгранная без ожидания. Если вы
играете 2-3 карты между обычными ходами, вы мчитесь к победе.

### 4. Цепные реакции

Если ваш ход вне очереди создаёт новую верхнюю карту, которую кто-то тоже может точно
совпасть — они тоже могут сыграть вне очереди. Это создаёт цепные реакции.

## Когда использовать ход вне очереди

### Всегда проверяйте руку

Каждый раз, когда кто-то играет карту — проверяйте руку. Есть точное совпадение?
Значит, есть возможность.

### Конец игры критичен

В последних раундах, когда у вас 2-3 карты, ходы вне очереди могут принести победу.
Сыграть предпоследнюю карту вне очереди, а последнюю — в свой ход. Классический
финишный приём.

### После особых карт

Гидрант может превратить карты в вашей руке. Если после Гидранта у вас появилось
точное совпадение со столом — играйте немедленно.

### Когда противники близки к победе

Если у другого игрока 1-2 карты, каждый пропущенный ход важен. Ход вне очереди перед
ним может дать вам время или позволить финишировать первым.

## Частые ошибки

### Забываете проверять

Самая большая ошибка — просто не следить за возможностями. Выработайте привычку
проверять руку при каждой смене верхней карты.

### Слишком торопитесь

Иногда сохранить точное совпадение ценнее, чем сыграть сразу. Если вы в комфортной
позиции — ожидание может быть выгоднее.

### Не думаете о последствиях

Играя вне очереди, вы задаёте Элемент и Значение стола. Подумайте, поможет ли вам
это на следующем ходу.

## Советы для практики

1. **Играйте в Тренировке с фокусом на ходах вне очереди** — старайтесь делать
   минимум один такой ход за игру.
2. **Следите за столом постоянно** — не только в свой ход, а при каждом розыгрыше.
3. **Запоминайте карты-совпадения** — при взятии новой карты отмечайте, совпадает ли
   она с чем-то частым на столе.
4. **Выбирайте момент** — особенно в рейтинговых матчах, ждите, когда пропуск
   противников будет максимально важен.

## Конкурентное преимущество

В рейтинговых матчах игроки, регулярно использующие ходы вне очереди, имеют ощутимое
преимущество. Это один из самых ярких маркеров навыка.

И главное — не нужно ничего разблокировать. Ход вне очереди доступен с первого матча —
нужно лишь научиться его видеть.

Больше тактик — в [Стратегиях](/ru/game/strategy). О всех типах карт — на странице
[Карты](/ru/game/cards).
```

**Step 3: Verify build and stage files**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

```bash
git add src/en/news/blog/2026_01_29_* src/ru/news/blog/2026_01_29_*
```

---

## Task 9: New blog post — "Ball of Fortune Guide"

**Why:** Targets "ball of fortune pawsome elements", "card game special effects guide". Covers the most complex card in the game with detailed strategy for each sub-ball.

**Files:**
- Create: `src/en/news/blog/2026_02_05_ball_of_fortune_guide_every_effect_explained.md`
- Create: `src/ru/news/blog/2026_02_05_ball_of_fortune_guide_every_effect_explained.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_02_05_ball_of_fortune_guide_every_effect_explained.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Ball of Fortune Guide: Every Effect Explained'
pageTitle: 'Ball of Fortune Guide: Every Effect Explained'
date: 2026-02-05
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

The **Ball of Fortune** is one of the most exciting and unpredictable cards in _Pawsome
Elements_. When you play it, you choose between **two randomly selected effects** from a pool
of five possible outcomes. It is a wildcard that can be played on any card — but the real
power lies in knowing what each effect does and when to pick it.

## How Ball of Fortune Works

Ball of Fortune does not belong to any specific Element. Like the Multidog, it can be played
on anything, and anything can be played on top of it.

When played, you are presented with **2 of the 5 possible effects**. You must choose one.
If time runs out, one is chosen randomly.

This means every Ball of Fortune play is unique — you never know which two options you will get.

## The Five Effects

### Ball of Curse

**Effect:** All opponents draw **1 card** each.

This is the simplest and most consistently useful effect. Everyone else gets bigger hands,
making it harder for them to finish. It is similar to playing a Shaking card, but as a bonus
effect from your Ball of Fortune.

**When to choose it:**
- When opponents are close to winning (low card counts)
- When you want a safe, reliable effect
- In multiplayer games where slowing everyone down benefits you

### Ball of Fate

**Effect:** **1 random card** from your hand is shuffled back into the deck.

A double-edged sword. You lose a card (good — smaller hand), but you do not control which
one (risky — you might lose something you needed).

**When to choose it:**
- When your hand is full of cards you cannot play
- When reducing your card count by one matters more than keeping specific cards
- Late game, when any card reduction helps

**When to avoid it:**
- When you are holding a Multidog or key special card you want to keep

### Ball of Luck

**Effect:** **All cards** in your hand are transformed into random cards from the deck.

The most dramatic effect. Your entire hand changes. This is a complete reset — it can save
a terrible hand or destroy a good one.

**When to choose it:**
- When your entire hand is unplayable and you have no other options
- When you are desperate and nothing else is working

**When to avoid it:**
- When you have good cards in hand (Multidogs, matchable cards, special cards)
- Early game, when your hand is still viable

### Ball of Wisdom

**Effect:** Your spell cooldown is **instantly reset to 0**.

Extremely powerful for spell-focused strategies. If your spell is on cooldown, this lets
you use it again immediately on your next turn.

**When to choose it:**
- When your spell is on cooldown and you need it urgently
- When your spell is key to your strategy (e.g., Pawgularity before a winning turn)
- In late game when one more spell activation could decide the match

**When to avoid it:**
- When your spell is already ready (cooldown already at 0)
- When you do not rely heavily on spells

### Ball of Wish

**Effect:** **1 random card** in your hand is transformed into a **Multidog**.

A reliable way to gain access to the game's most versatile card. One of your existing cards
becomes a Multidog, which can be played on anything.

**When to choose it:**
- Almost always a good pick — Multidogs are incredibly valuable
- When you need a guaranteed playable card for your next turn
- When your hand lacks matching options

## Making the Right Choice

Since you always see two of the five effects, your decision depends on your current situation:

1. **Check your hand first** — Is it mostly bad? Consider Ball of Luck. Is it decent?
   Protect it.
2. **Check your spell cooldown** — Is your spell ready? Ball of Wisdom has less value.
   Is it cooling down? Wisdom becomes very tempting.
3. **Check opponent card counts** — Are they close to winning? Ball of Curse slows them
   down.
4. **Default to Ball of Wish** — When in doubt, getting a Multidog is rarely a bad choice.

## Ball of Fortune in Ranked Play

In competitive matches, Ball of Fortune becomes even more interesting because the stakes
are higher. Top players:

- Save Ball of Fortune for moments when the choice matters most
- Memorize which effects they want in each game state
- Factor Ball of Fortune into their overall spell and card strategy

It is not just a random card — it is a **strategic tool** that rewards preparation and
quick decision-making.

For more on card strategy, read the [Strategy Guide](/en/game/strategy). For a complete
list of all cards and effects, visit the [Cards page](/en/game/cards).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_02_05_ball_of_fortune_guide_every_effect_explained.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Гайд по Шару Фортуны: Все Эффекты'
pageTitle: 'Гайд по Шару Фортуны: Все Эффекты'
date: 2026-02-05
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

**Шар Фортуны** — одна из самых увлекательных и непредсказуемых карт в _Pawsome Elements_.
При розыгрыше вы выбираете между **двумя случайно выбранными эффектами** из пяти возможных.
Это универсальная карта, играемая на что угодно — но настоящая сила в знании каждого
эффекта и правильном выборе.

## Как работает Шар Фортуны

Шар Фортуны не принадлежит конкретному Элементу. Как Мультипёс, играется на что угодно,
и любая карта может быть сыграна поверх него.

При розыгрыше вам показываются **2 из 5 возможных эффектов**. Нужно выбрать один. Если
время истечёт — эффект выбирается случайно.

Каждый розыгрыш Шара Фортуны уникален — вы никогда не знаете, какие два варианта получите.

## Пять эффектов

### Шар Проклятия

**Эффект:** Все противники берут по **1 карте**.

Простейший и наиболее стабильно полезный эффект. У всех остальных руки увеличиваются,
что затрудняет их финиш. Похоже на Встряску, но как бонус от Шара Фортуны.

**Когда выбирать:**
- Когда противники близки к победе (мало карт на руках)
- Когда нужен надёжный, безопасный эффект
- В матчах на несколько игроков, где замедление всех выгодно

### Шар Судьбы

**Эффект:** **1 случайная карта** из руки замешивается обратно в колоду.

Палка о двух концах. Вы теряете карту (хорошо — меньше рука), но не контролируете
какую (рискованно — можете потерять нужную).

**Когда выбирать:**
- Когда рука полна неиграемых карт
- Когда уменьшение руки на одну карту важнее конкретных карт
- В поздней игре, когда любое уменьшение помогает

**Когда избегать:**
- Когда вы держите Мультипса или ключевую особую карту

### Шар Удачи

**Эффект:** **Все карты** в руке превращаются в случайные карты из колоды.

Самый драматичный эффект. Вся рука меняется. Полная перезагрузка — может спасти
ужасную руку или разрушить хорошую.

**Когда выбирать:**
- Когда вся рука неиграема и других вариантов нет
- Когда вы в отчаянии и ничего не работает

**Когда избегать:**
- Когда на руке хорошие карты (Мультипсы, совпадающие карты, особые карты)
- В начале игры, когда рука ещё жизнеспособна

### Шар Мудрости

**Эффект:** Перезарядка заклинания **мгновенно сбрасывается до 0**.

Крайне мощно для стратегий, завязанных на заклинания. Если заклинание на перезарядке —
вы сможете использовать его снова на следующем ходу.

**Когда выбирать:**
- Когда заклинание на перезарядке и срочно нужно
- Когда заклинание — ключ к стратегии (например, Сингупёсность перед победным ходом)
- В поздней игре, когда ещё одна активация может решить матч

**Когда избегать:**
- Когда заклинание уже готово (перезарядка уже на 0)
- Когда вы не полагаетесь на заклинания

### Шар Желания

**Эффект:** **1 случайная карта** в руке превращается в **Мультипса**.

Надёжный способ получить самую универсальную карту игры. Одна из ваших карт становится
Мультипсом, который играется на что угодно.

**Когда выбирать:**
- Почти всегда хороший выбор — Мультипсы невероятно ценны
- Когда нужна гарантированная играемая карта на следующий ход
- Когда на руке мало совпадающих вариантов

## Как сделать правильный выбор

Вы всегда видите два из пяти эффектов. Решение зависит от текущей ситуации:

1. **Проверьте руку** — преимущественно плохая? Рассмотрите Шар Удачи. Нормальная?
   Защитите её.
2. **Проверьте перезарядку заклинания** — готово? Шар Мудрости менее ценен. На
   перезарядке? Мудрость очень привлекательна.
3. **Проверьте карты противников** — близки к победе? Шар Проклятия замедлит их.
4. **По умолчанию — Шар Желания** — если сомневаетесь, получить Мультипса редко
   бывает плохим выбором.

## Шар Фортуны в рейтинговых матчах

В соревновательных играх Шар Фортуны становится ещё интереснее из-за высоких ставок.
Лучшие игроки:

- Сохраняют Шар Фортуны для решающих моментов
- Запоминают, какие эффекты хотят в каждом состоянии игры
- Учитывают Шар Фортуны в общей стратегии с заклинаниями и картами

Это не просто случайная карта — это **стратегический инструмент**, вознаграждающий
подготовку и быстрое принятие решений.

Больше о стратегиях — в [Стратегиях](/ru/game/strategy). Полный список всех карт —
на странице [Карты](/ru/game/cards).
```

**Step 3: Verify build and stage files**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

```bash
git add src/en/news/blog/2026_02_05_* src/ru/news/blog/2026_02_05_*
```

---

## Task 10: New blog post — "Tips for Climbing Ranked"

**Why:** Targets "ranked tips card game", "how to climb ranked leaderboard". Practical advice for competitive players, linking to multiple game pages.

**Files:**
- Create: `src/en/news/blog/2026_02_08_tips_for_climbing_the_ranked_ladder_in_pawsome_elements.md`
- Create: `src/ru/news/blog/2026_02_08_tips_for_climbing_the_ranked_ladder_in_pawsome_elements.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_02_08_tips_for_climbing_the_ranked_ladder_in_pawsome_elements.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Tips for Climbing the Ranked Ladder'
pageTitle: 'Tips for Climbing the Ranked Ladder'
date: 2026-02-08
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Ranked Mode in _Pawsome Elements_ is where the real competition lives. Every match pits you
against three other players in a battle of strategy, timing, and adaptability. Climbing the
ladder requires more than luck — it takes consistent, smart play.

Here are practical tips to help you improve your rank and stay competitive.

## Understand the Rating System

Before diving into tactics, understand how the rating system rewards you:

- **1st place** earns the most rating.
- **2nd and 3rd place** still gain rating.
- **4th place** loses rating (scaled fairly).

This means you do not need to win every match — **consistent top-3 finishes are enough to
climb**. Playing smart and avoiding last place is just as important as going for the win.

## Tip 1: Prioritize Consistency Over Aggression

Many players try to win every match by playing aggressively. But in a 4-player game, risky
plays often leave you in 4th place.

Instead, focus on **not losing**. Play conservatively when ahead, and take risks only when
you are behind and need to catch up.

## Tip 2: Master Out-of-Turn Play

[Out-of-turn play](/en/game/beginners-guide) is the single most impactful skill in ranked
matches. Players who consistently find and use exact matches have a significant advantage.

Make it a habit to check your hand every time the pile changes — not just on your turn.

## Tip 3: Choose Your Spell for Ranked

Not all spells work equally well in competitive play. Consider these factors:

- **Pawgularity** is the safest choice — it guarantees a playable card when you need it most.
- **Hesitant Paw** gives an early advantage but is high-risk if your starting hand is bad.
- **Unleashed Will** offers maximum flexibility and works well in any situation.
- **Transmutation** is powerful but depends on the game state.

Pick a spell that matches your playstyle, and practice with it before entering ranked.

## Tip 4: Watch Opponent Card Counts

In ranked, information is power. Pay attention to how many cards each opponent holds:

- A player with **1-2 cards** is about to win. Target them with disruption (Hydrant,
  Shaking) if possible.
- A player with **many cards** is less of a threat. Focus on other opponents.
- If you are in **3rd or 4th place** on card count, play more aggressively to catch up.

## Tip 5: Time Your Special Cards

Special cards are most powerful when used at the right moment:

- **Hydrant** is devastating when opponents have small, carefully curated hands.
- **Shaking** is best when opponents are close to finishing.
- **Ball of Fortune** gives you the most flexibility when you have time to choose wisely.
- **Treat Hiding** is underrated — reducing spell cooldown by 1 turn compounds over
  multiple plays.

Do not play special cards just because you can match them. Wait for the moment when their
effect matters most.

## Tip 6: Manage Your Hand Size

A smaller hand is easier to play from, but having too few cards limits your options. The
sweet spot in ranked is usually:

- **4-6 cards** — enough options to respond to any situation.
- **Below 3** — you are in a strong position but vulnerable to Shaking or Hydrant.
- **Above 7** — you may be falling behind and need to play more aggressively.

## Tip 7: Adapt to the Table

Every ranked match is different. Pay attention to:

- **Which Elements are dominating** — if Nature is everywhere, holding Filth or Arcane
  cards may leave you stuck.
- **How aggressively opponents are playing** — if they are all rushing, a defensive
  approach may let you coast to 2nd or 3rd place.
- **Who has special cards** — if you see many special cards being played, others may be
  running out.

## Tip 8: Do Not Tilt

Losing rating feels bad. But tilting — making emotional, aggressive plays after a loss —
leads to more losses. If you lose 2-3 matches in a row:

- Take a short break.
- Review what went wrong.
- Come back with a clear head.

Climbing ranked is a marathon, not a sprint. Patience and consistency always win over
time.

## Tip 9: Practice in Quick Matches First

Before entering ranked with a new spell or strategy, test it in Quick Matches. The
low-stakes environment lets you experiment without risking your rating.

## The Long Game

Ranked climbing is not about a single match — it is about hundreds of matches. The rating
system rewards players who:

- Finish in the top 3 consistently
- Adapt their strategy to different opponents
- Manage risk instead of chasing wins
- Use every tool available — spells, special cards, out-of-turn plays

The players at the top of the leaderboard are not just lucky — they are consistent.

Learn more about the rating system on the [Ranked Mode page](/en/game/ranked).
For advanced tactics, read the [Strategy Guide](/en/game/strategy).
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_02_08_tips_for_climbing_the_ranked_ladder_in_pawsome_elements.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Как Подняться в Рейтинге: Советы для Ранкеда'
pageTitle: 'Как Подняться в Рейтинге: Советы для Ранкеда'
date: 2026-02-08
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Рейтинговый режим в _Pawsome Elements_ — это настоящая конкуренция. Каждый матч сводит вас
с тремя другими игроками в битве стратегии, тайминга и адаптации. Для подъёма в рейтинге
нужна не удача — а стабильная, умная игра.

Вот практические советы для улучшения рейтинга.

## Как работает рейтинг

Прежде чем переходить к тактике, поймите, как система вознаграждает:

- **1-е место** — максимум рейтинга.
- **2-е и 3-е места** — тоже получают рейтинг.
- **4-е место** — теряет рейтинг (масштабированно).

Не нужно побеждать в каждом матче — **стабильный топ-3 достаточен для подъёма**. Умная
игра и избегание последнего места так же важны, как победа.

## Совет 1: Стабильность важнее агрессии

Многие пытаются выиграть каждый матч агрессивной игрой. Но в игре на 4 человек рискованные
ходы часто заканчиваются 4-м местом.

Вместо этого фокусируйтесь на **непроигрыше**. Играйте осторожно, когда впереди,
рискуйте только когда отстаёте.

## Совет 2: Овладейте ходом вне очереди

[Ход вне очереди](/ru/game/beginners-guide) — самый влиятельный навык в рейтинговых
матчах. Игроки, регулярно находящие точные совпадения, имеют значительное преимущество.

Проверяйте руку каждый раз, когда меняется верхняя карта — не только в свой ход.

## Совет 3: Выбирайте заклинание для ранкеда

Не все заклинания одинаково хороши для рейтинга:

- **Сингупёсность** — самый безопасный выбор. Гарантирует играемую карту.
- **Лапа Отказа** — ранняя фора, но рискованно при слабой стартовой руке.
- **Освобождённая Воля** — максимальная гибкость для любой ситуации.
- **Трансмутация** — мощна, но зависит от состояния игры.

Выберите заклинание под свой стиль и потренируйтесь перед входом в ранкед.

## Совет 4: Следите за количеством карт противников

В рейтинге информация — сила:

- Игрок с **1-2 картами** вот-вот победит. Мешайте ему (Гидрант, Встряска).
- Игрок с **многими картами** — меньшая угроза.
- Если вы на **3-4 месте** по количеству карт — играйте агрессивнее.

## Совет 5: Рассчитывайте время особых карт

Особые карты сильнее всего в нужный момент:

- **Гидрант** — разрушителен, когда у противников мало тщательно отобранных карт.
- **Встряска** — лучше всего, когда противники близки к финишу.
- **Шар Фортуны** — максимальная гибкость, когда есть время на выбор.
- **Прятки с Лакомством** — недооценена. Уменьшение перезарядки на 1 ход
  накапливается.

Не играйте особые карты только потому, что можете. Ждите момента, когда эффект
максимально важен.

## Совет 6: Управляйте размером руки

Оптимально для рейтинга:

- **4-6 карт** — достаточно вариантов для любой ситуации.
- **Меньше 3** — сильная позиция, но уязвимость к Встряске или Гидранту.
- **Больше 7** — возможно, отстаёте и нужна более агрессивная игра.

## Совет 7: Адаптируйтесь к столу

Каждый матч уникален. Обращайте внимание:

- **Какие Элементы доминируют** — если Природа везде, держать Скверну может быть
  проблемой.
- **Насколько агрессивно играют** — если все спешат, оборонительный подход может
  дать стабильное 2-3 место.
- **У кого есть особые карты** — если сыграно много особых карт, они заканчиваются.

## Совет 8: Не тильтуйте

Потеря рейтинга неприятна. Но тильт — эмоциональные агрессивные ходы после поражения —
ведёт к новым потерям. Если проиграли 2-3 матча подряд:

- Сделайте перерыв.
- Проанализируйте ошибки.
- Вернитесь с ясной головой.

Подъём в рейтинге — марафон, а не спринт.

## Совет 9: Тренируйтесь в быстрых матчах

Перед входом в ранкед с новым заклинанием или стратегией — протестируйте в быстрых
матчах. Низкие ставки позволяют экспериментировать без риска.

## Игра вдолгую

Подъём в рейтинге — не один матч, а сотни. Система вознаграждает игроков, которые:

- Стабильно финишируют в топ-3
- Адаптируют стратегию к разным оппонентам
- Управляют рисками вместо погони за победами
- Используют все инструменты — заклинания, особые карты, ходы вне очереди

Топ игроки — не просто везунчики. Они стабильны.

Подробнее о рейтинговой системе — на странице [Рейтинговый режим](/ru/game/ranked).
Продвинутые тактики — в [Стратегиях](/ru/game/strategy).
```

**Step 3: Verify build and stage files**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

```bash
git add src/en/news/blog/2026_02_08_* src/ru/news/blog/2026_02_08_*
```

---

## Task 11: New blog post — "Best Free Card Games Online"

**Why:** High-volume SEO play targeting "best free card games online 2026", "free to play card games browser". Positions PE among competitors while providing genuine value to readers searching for free card games.

**Files:**
- Create: `src/en/news/blog/2026_02_11_best_free_card_games_to_play_online.md`
- Create: `src/ru/news/blog/2026_02_11_best_free_card_games_to_play_online.md`

**Step 1: Create EN blog post**

Create `src/en/news/blog/2026_02_11_best_free_card_games_to_play_online.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Best Free Card Games to Play Online in 2026'
pageTitle: 'Best Free Card Games to Play Online in 2026'
date: 2026-02-11
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---

Looking for a great **free card game to play online**? Whether you enjoy quick casual rounds,
deep strategy, or competitive ranked play, there are excellent options available right in
your browser — no download required.

Here is a look at some of the best free-to-play card games you can jump into today, along
with what makes each one unique.

## What Makes a Great Free Card Game?

Before diving into the list, here is what we look for in a free card game worth playing:

- **Truly free** — No paywalls blocking content or competitive advantages.
- **Easy to start** — Low barrier to entry. You can play within minutes.
- **Strategic depth** — Simple to learn, hard to master.
- **Active community** — Other players to compete against.
- **Regular updates** — The game keeps evolving.

## Card Games Worth Playing

### Pawsome Elements

_Pawsome Elements_ is a fast-paced online card game inspired by classics like UNO but with
a competitive twist. Players share a deck, match cards by Element or Value, and race to empty
their hand first.

What sets it apart:
- **Spells** — Equip a spell before each match and use it strategically during play.
- **Special cards** — Cards like Hydrant, Shaking, and Ball of Fortune trigger unique effects
  that impact all players.
- **Ranked Mode** — Competitive 4-player matches with a global rating system that rewards
  consistency, not just wins.
- **No pay-to-win** — Everyone draws from the same shared deck. Cosmetics are optional.
- **Browser-based** — Works on any device with a modern browser.

Best for: Players who want the fun of UNO with deeper strategy and competitive play.

### UNO Online

The classic card game adapted for online play. Match colors and numbers, use action cards
to disrupt opponents, and be the first to empty your hand. Various unofficial and official
versions exist online.

Best for: Casual players who want a familiar experience.

### Hearthstone

Blizzard's flagship digital card game. Build decks from a vast collection of cards, manage
mana resources, and battle opponents in 1v1 matches. Deep strategy and a massive community.

Best for: Players who enjoy deckbuilding, long matches, and deep meta strategy.

### Legends of Runeterra

Riot Games' card game set in the League of Legends universe. Combines deckbuilding with
strategic back-and-forth turns. Generous free-to-play model compared to many competitors.

Best for: Players who want deckbuilding with a more accessible free-to-play model.

### Solitaire and Classic Card Games

Sometimes you just want the basics. Browser-based solitaire, poker, and other classic card
games remain some of the most played games online. Simple, relaxing, and always available.

Best for: Solo players looking for a quick, low-commitment game.

## How to Choose

The right card game depends on what you are looking for:

| If you want... | Try... |
|----------------|--------|
| Fast, fun games with friends | Pawsome Elements, UNO Online |
| Deep deckbuilding strategy | Hearthstone, Legends of Runeterra |
| Competitive ranked play | Pawsome Elements, Hearthstone |
| No download, play instantly | Pawsome Elements, Solitaire |
| Fair free-to-play | Pawsome Elements, Legends of Runeterra |

## Why We Built Pawsome Elements

We created _Pawsome Elements_ because we wanted a card game that combined the best of both
worlds: the **instant fun** of party card games and the **strategic depth** of competitive
ones.

No deckbuilding, no paywalls, no 20-minute matches. Just pick up your cards, equip a spell,
and play.

Curious? [Start playing now](https://app.pawsome-elements.com?utm_source=website) — it is
free and works right in your browser.
```

**Step 2: Create RU blog post**

Create `src/ru/news/blog/2026_02_11_best_free_card_games_to_play_online.md`:

```markdown
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Лучшие Бесплатные Карточные Игры Онлайн в 2026'
pageTitle: 'Лучшие Бесплатные Карточные Игры Онлайн в 2026'
date: 2026-02-11
categories: ['ru']
tags: ['post', 'blog', 'blog_ru']
---

Ищете хорошую **бесплатную карточную игру онлайн**? Неважно, нравятся ли вам быстрые
партии, глубокая стратегия или соревновательный рейтинг — отличные варианты доступны прямо
в браузере, без скачивания.

Вот обзор лучших бесплатных карточных игр, в которые можно начать играть прямо сейчас.

## Что делает карточную игру хорошей?

Вот критерии хорошей бесплатной карточной игры:

- **Действительно бесплатная** — без платных стен и конкурентных преимуществ за деньги.
- **Быстрый старт** — минимальный порог входа.
- **Стратегическая глубина** — легко изучить, сложно освоить.
- **Активное сообщество** — другие игроки для состязаний.
- **Регулярные обновления** — игра продолжает развиваться.

## Карточные игры, достойные внимания

### Pawsome Elements

_Pawsome Elements_ — быстрая онлайн-карточная игра, вдохновлённая классиками вроде UNO,
но с соревновательным уклоном. Все берут из одной колоды, совпадают по Элементу или
Значению и стремятся первыми избавиться от карт.

Особенности:
- **Заклинания** — экипируйте перед матчем и используйте стратегически.
- **Особые карты** — Гидрант, Встряска и Шар Фортуны запускают уникальные эффекты для
  всех игроков.
- **Рейтинговый режим** — соревновательные матчи на 4 игроков с глобальной системой
  рейтинга, вознаграждающей стабильность.
- **Без pay-to-win** — все берут из одной колоды. Косметика опциональна.
- **В браузере** — работает на любом устройстве.

Подходит для: Игроков, которые хотят веселье UNO с глубокой стратегией и конкуренцией.

### UNO Онлайн

Классика, адаптированная для онлайн-игры. Совпадайте по цвету и числу, используйте
особые карты и первым избавьтесь от руки. Существуют разные версии.

Подходит для: Казуальных игроков, предпочитающих знакомый опыт.

### Hearthstone

Флагманская карточная игра Blizzard. Собирайте колоды, управляйте маной и сражайтесь
в дуэлях 1 на 1. Глубокая стратегия и огромное сообщество.

Подходит для: Любителей коллекционирования, долгих матчей и мета-стратегий.

### Legends of Runeterra

Карточная игра Riot Games во вселенной League of Legends. Комбинирует создание колод
со стратегическими ходами. Щедрая модель free-to-play.

Подходит для: Любителей deckbuilding с доступной бесплатной моделью.

### Пасьянс и классические карточные игры

Иногда хочется просто классику. Пасьянс, покер и другие классические карточные игры
в браузере. Просто, расслабляюще и всегда доступно.

Подходит для: Одиночных игроков для быстрой партии без обязательств.

## Как выбрать

| Если вы хотите... | Попробуйте... |
|-------------------|---------------|
| Быстрые весёлые игры с друзьями | Pawsome Elements, UNO |
| Глубокую стратегию deckbuilding | Hearthstone, Legends of Runeterra |
| Соревновательный рейтинг | Pawsome Elements, Hearthstone |
| Без скачивания, играть сразу | Pawsome Elements, Пасьянс |
| Честный free-to-play | Pawsome Elements, Legends of Runeterra |

## Почему мы создали Pawsome Elements

Мы создали _Pawsome Elements_, потому что хотели карточную игру, объединяющую лучшее
из двух миров: **мгновенное веселье** карточных игр для компании и **стратегическую
глубину** соревновательных.

Никакого deckbuilding, никаких платных стен, никаких 20-минутных матчей. Просто берите
карты, выбирайте заклинание и играйте.

Интересно? [Начните играть](https://app.pawsome-elements.com?utm_source=website) — это
бесплатно и работает прямо в браузере.
```

**Step 3: Verify build and stage files**

Run: `cd /Users/sharadbrat/Desktop/projects/kwokka/pawsome-elements-landing && npm run build`

```bash
git add src/en/news/blog/2026_02_11_* src/ru/news/blog/2026_02_11_*
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Fix EN blog posts (Soundboard, minigames) | 4 files modified |
| 2 | Fix RU blog posts (same issues) | 4 files modified |
| 3 | Fix game pages (minigame language) | 4 files modified |
| 4 | Contact page + config (EN+RU) | 2 created, 5 modified |
| 5 | Expand About Us (EN+RU) | 2 files modified |
| 6 | Blog: Three Elements (EN+RU) | 2 files created |
| 7 | Blog: Spell Comparison (EN+RU) | 2 files created |
| 8 | Blog: Out-of-Turn Play (EN+RU) | 2 files created |
| 9 | Blog: Ball of Fortune (EN+RU) | 2 files created |
| 10 | Blog: Ranked Climbing Tips (EN+RU) | 2 files created |
| 11 | Blog: Best Free Card Games (EN+RU) | 2 files created |

**Totals:** 12 new files, 19 modified files (stage only, no commits)
