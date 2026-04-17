# @kwokka/pawsome-elements-landing

Static marketing website for the Pawsome Elements card game, built with [Eleventy (11ty)](https://www.11ty.dev/) v2, Nunjucks templates, SCSS, and Alpine.js. Deployed to Netlify.

**Live site**: https://pawsome-elements.com

## Project Structure

```
pawsome-elements-landing/
├── .github/workflows/ci.yml      # GitHub Actions CI/CD → Netlify
├── public/                        # Static assets (passthrough copy)
│   ├── blocks/                    # Block-specific images (hero, faq, footer, etc.)
│   ├── fonts/                     # Piazzolla font files
│   ├── icons/                     # Favicons
│   ├── pages/                     # Page-specific images (about, community, game, news)
│   ├── script/                    # Alpine.js CDN, cookie-consent scripts
│   └── ui/                        # 9-box sliced UI component images
├── src/
│   ├── _data/                     # 11ty global data
│   │   ├── i18n/                  # Translation files (en.js, ru.js, index.js)
│   │   ├── links.js               # Site links/URLs
│   │   ├── locales.js             # Locale config [{code:'en'}, {code:'ru'}]
│   │   └── site.js                # Site metadata (copyright, url)
│   ├── _includes/
│   │   ├── blocks/                # Reusable Nunjucks block components (20 files)
│   │   ├── layouts/               # Layout templates (7 files)
│   │   └── pages/
│   │       └── index.njk          # Homepage template
│   ├── en/                        # English content (pages, blog, releases)
│   ├── ru/                        # Russian content (mirrors en/)
│   ├── style/                     # SCSS source
│   │   ├── blocks/                # Block-specific styles
│   │   ├── elements/              # Reusable element styles
│   │   ├── framework/             # Utilities, mixins, functions
│   │   ├── global/                # Colors, fonts, reset
│   │   ├── layouts/               # Layout styles
│   │   ├── pages/                 # Page-specific styles
│   │   └── index.scss             # Main SCSS entry point
│   ├── sitemap.njk                # XML sitemap generator
│   ├── robots.txt
│   └── ads.txt
├── .eleventy.js                   # Eleventy configuration
├── netlify.toml                   # Netlify redirects and 404
├── package.json
└── .prettierrc.json               # Prettier config
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Static site generator | Eleventy (11ty) | 2.0.1 |
| Templating | Nunjucks | (bundled with 11ty) |
| Styling | SCSS via eleventy-sass | 2.2.6 |
| Interactivity | Alpine.js (CDN) | 3.14.8 |
| i18n | eleventy-plugin-i18n | 0.1.3 |
| Date formatting | date-fns | 4.1.0 |
| JS minification | Terser | 5.39.0 |
| Cookie consent | @kwokka/cookie-consent | 1.0.2 |
| Formatting | Prettier | 3.5.3 |
| Hosting | Netlify | - |
| Node.js | | 22 |

## Common Commands

```bash
# Start dev server on port 8082
npm run start

# Production build to dist/
npm run build

# Format source files
npm run format
```

## Architecture

### Layout Hierarchy

```
base.njk                          # HTML skeleton, meta tags, Alpine.js, consent
├── first-level.njk               # Header + content + footer (homepage)
│   └── pages/index.njk           # Homepage blocks
└── second-level.njk              # Header + back button + content + footer
    ├── contentful.njk            # Simple content pages (about, legal, pp)
    └── post.njk                  # Posts with optional date + play-now CTA
        ├── blogpost.njk          # Blog articles (showDate: true)
        └── release.njk           # Release notes (showDate: true)
```

### i18n System

Content is organized by locale directory (`src/en/`, `src/ru/`). Each directory has a JSON data file (e.g., `en/en.json`) that sets `locale` and `dir` for all pages within.

**Translations**: `src/_data/i18n/en.js` and `ru.js` export translation objects. `index.js` merges them via `deepmerge` into the structure expected by `eleventy-plugin-i18n`.

**Usage in templates**: `{{ 'hero.heading' | i18n }}`

**Fallback**: Missing translations fall back to English.

**Netlify redirects** (`netlify.toml`): Root requests redirect to `/ru/` for Russian-language browsers, `/en/` for all others.

### Data Cascade

11ty's data cascade provides global data from `src/_data/`:
- **`site`** — `{ copyright, url }`
- **`links`** — All internal/external URLs (app link, social links, page paths)
- **`locales`** — `[{ code: 'en', label: 'English' }, { code: 'ru', label: 'Русский' }]`
- **`i18n`** — Merged translation strings

### Component System

Reusable blocks live in `src/_includes/blocks/` and are included via `{% include 'blocks/name.njk' %}`. Data is passed through Nunjucks variables set before the include.

**Alpine.js** handles interactive UI: sidenav toggle, navigation dropdowns (`x-data`, `x-show`, `@click.outside`), and language select (`x-model`).

### Custom Filters

| Filter | Type | Purpose |
|--------|------|---------|
| `date` | Sync | Format dates via date-fns: `{{ date \| date("MMMM d, yyyy") }}` |
| `jsmin` | Async | Minify inline JS via Terser |

### Collections

Collections are auto-generated from frontmatter `tags`:
- `blog_en`, `blog_ru` — Blog posts per locale
- `release_en`, `release_ru` — Release notes per locale
- `post` — All posts

Blog and release listing pages use 11ty pagination (5 items per page).

## Content Structure

### Page Types

| Type | Layout | Frontmatter |
|------|--------|-------------|
| Homepage | `first-level.njk` | `title` |
| Game pages | `post.njk` | `title`, `pageTitle` |
| Community pages | `post.njk` | `title`, `pageTitle` |
| About / Legal | `contentful.njk` or `post.njk` | `title`, `pageTitle` |
| Blog posts | `blogpost.njk` | `title`, `pageTitle`, `date`, `categories`, `tags` |
| Release notes | `release.njk` | `title`, `pageTitle`, `date`, `categories`, `tags` |
| Blog/Release index | `second-level.njk` | `title`, `pagination` |

### Frontmatter Schema

**Blog post** (`src/en/news/blog/*.md`):
```yaml
---
layout: layouts/blogpost.njk
title: 'Pawsome Elements | Post Title'
pageTitle: 'Post Title'
date: 2025-07-01
categories: ['en']
tags: ['post', 'blog', 'blog_en']
---
```

**Release note** (`src/en/news/releases/*.md`):
```yaml
---
layout: layouts/release.njk
title: 'Pawsome Elements | Release v0.24.2: Title'
pageTitle: 'Release v0.24.2: Title'
date: 2025-06-29
categories: ['en']
tags: ['post', 'release', 'release_en']
---
```

### Adding Content

To add a new blog post:
1. Create `src/en/news/blog/post-slug.md` with blogpost frontmatter
2. Create matching `src/ru/news/blog/post-slug.md` for Russian
3. Use tags `['post', 'blog', 'blog_en']` (or `blog_ru` for Russian)

Release notes follow the same pattern under `news/releases/`.

## Styling Architecture

### SCSS Layers

The main entry point `src/style/index.scss` imports layers in order:

1. **framework/** — Utilities, mixins, and functions (spacing, media queries, typography, 9-box)
2. **elements/** — Reusable UI elements (buttons, cards, panels, dividers)
3. **global/** — Colors, fonts (Piazzolla), CSS reset
4. **layouts/** — Layout-specific styles (first-level, second-level, post)
5. **pages/** — Page-specific overrides
6. **blocks/** — Block component styles (one file per block)

### Color System

58 colors defined in `src/style/global/_colors.scss` as a Sass map, output as CSS custom properties with individual RGB channels:

```scss
// Definition
$colors: (shade-100: #fff, shade-200: #ede4d8, ..., accent-100: #ffcd39, ...);

// Generated CSS
:root { --pwsm-shade-100: 255, 255, 255; ... }

// Usage via function
UiColor(shade-900)       // → rgba(var(--pwsm-shade-900), 1)
UiColor(shade-900, 0.5)  // → rgba(var(--pwsm-shade-900), 0.5)
```

### Spacing System

4px base unit via `UiPadding()` and `UiMargin()` mixins:
```scss
@include UiPadding(4);          // padding: 16px (4 × 4px)
@include UiPadding(8, left);    // padding-left: 32px
```

### Responsive Breakpoints

```scss
$sm: 600px;
$md: 992px;
$lg: 1200px;

@include UiMediaMaxWidth(md) { ... }  // max-width: 991px
@include UiMediaMinWidth(md) { ... }  // min-width: 992px
```

### 9-Box System

Scalable UI frames using CSS `border-image` with 9-slice images. Components: `action_panel`, `button`, `card_1`, `option_panel`, `scroll`. Images stored in `public/ui/`.

### Font

Piazzolla (weights 700, 900) with Cyrillic + Latin support. Loaded from `public/fonts/`.

### Button Variants

3 types (`primary`, `secondary`, `blue`) × 3 sizes (`xs`, `sm`, `md`).

## Deployment

### Netlify via GitHub Actions

**Trigger**: Push to `master` or manual dispatch.

**Pipeline** (`.github/workflows/ci.yml`):
1. Discord notification (start)
2. Checkout repo
3. Setup Node.js 22 with GitHub npm registry
4. `npm ci` (uses `GH_NPM_REGISTRY_TOKEN` for `@kwokka` packages)
5. `npm run build`
6. Deploy `./dist` to Netlify via `nwtgck/actions-netlify@v3.0`
7. Discord notification (success/failure)

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `GH_NPM_REGISTRY_TOKEN` | GitHub npm registry for @kwokka packages |
| `NETLIFY_AUTH_TOKEN` | Netlify deploy authentication |
| `DISCORD_WEBHOOK_URL` | CI notifications |

### Required Variables

| Variable | Purpose |
|----------|---------|
| `NETLIFY_SITE_ID` | Netlify site identifier |

### Netlify Redirects

Configured in `netlify.toml`:
- Russian-language browsers → `/ru/*`
- All others → `/en/*`
- 404 → `/en/index.html`

## Conventions

### File Naming

- Content pages: `kebab-case.md`
- Block components: `kebab-case.njk`
- SCSS partials: `_kebab-case.scss`
- Translation files: `{locale}.js`
- Locale data: `{locale}.json`

### Template Patterns

- Blocks included via `{% include 'blocks/name.njk' %}`
- Data passed to blocks via Nunjucks `{% set %}` before include
- Alpine.js for all client-side interactivity
- `x-cloak` on hidden-by-default elements to prevent FOUC
- `{{ links.section.page }}` for internal URLs (not hardcoded paths)
- `{{ 'key.path' | i18n }}` for all user-facing strings

### Content Mirroring

Every page in `src/en/` must have a corresponding page in `src/ru/` with matching structure. Tags must use the correct locale suffix (`blog_en` vs `blog_ru`).

### Cookie Consent

Integrated via `@kwokka/cookie-consent` package. CSS and JS are copied to output via 11ty passthrough. Google Analytics (G-SVKCBLB63S) uses consent mode.

### Prettier Config

```json
{
  "semi": true,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 120,
  "trailingComma": "all"
}
```

### npm Registry

Private `@kwokka` packages are resolved from GitHub npm registry (configured in `.npmrc`).
