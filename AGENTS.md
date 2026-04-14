# AGENTS.md — Kwokka Platform Monorepo Context

## 🎯 Purpose

This document provides essential context for AI agents working within the Kwokka Platform Monorepo.

---

## 📐 Architecture Overview

**Monorepo Tool**: npm workspaces (native, zero-config)
**Node.js Target**: v24+ (LTS)
**Versioning**: Service-Specific Git Tags (no `package.json` versions)

### Directory Structure

| Directory | Purpose | Contents |
|-----------|---------|----------|
| `applications/` | Platform services | `owl/`, `capybara/`, `zebra/`, `kwokka-frontend/` |
| `packages/` | Shared libraries | `entities/`, `sdk-node/`, `sdk-js/`, `utils/`, etc. |
| `games/` | Fullstack game projects | `pawsome-elements/` (with frontend/backend/landing) |
| `infrastructure/` | Deployment configs | `prod/`, `local/`, `docs/` |
| `scripts/` | Global automation | `dev-platform.js`, `dev-game.js`, `release.js` |

---

## 🚧 Dependency Boundaries (Critical)

**Rule**: Apps/Games depend on Packages. Never the reverse.

```
                packages/
                   ↑
         ┌─────────┴─────────┐
         │                   │
   applications/         games/
```

| Source | Can Depend On | Cannot Depend On |
|--------|---------------|------------------|
| `applications/*` | `packages/*` | Other `applications/*`, `games/*` |
| `games/*` | `packages/*` | `applications/*`, other `games/*` |
| `packages/*` | Other `packages/*` | `applications/*`, `games/*` |

**Violation of these boundaries breaks the monorepo architecture.**

---

## 🏷️ Versioning Strategy

### Service-Specific Tagging

- **No version in `package.json`**: Leave the version field empty or use a placeholder.
- **Tags are the source of truth**: `owl-1.2.0`, `capybara-2.1.5`, `frontend-3.0.1`
- **Decoupled life cycles**: Each service can be released independently.

### Creating a Release

```bash
# Tag format: <service-name>-<semver>
git tag owl-1.2.0
git push origin owl-1.2.0
```

---

## 📦 Package Management

### Adding a Package

```bash
mkdir packages/new-package
cd packages/new-package
# Create package.json (name: @kwokka/new-package, NO version)
cd ../..
npm install  # Links via workspaces
```

### Consuming a Package

In application's `package.json`:

```json
{
  "dependencies": {
    "@kwokka/entities": "*",
    "@kwokka/sdk-node": "*"
  }
}
```

Run `npm install` at root to link.

---

## 🛠️ Developer Commands

| Command | Purpose |
|---------|---------|
| `npm run dev:platform` | Start all platform services |
| `npm run dev:game` | Interactive game selector |
| `npm run test` | Run tests across all workspaces |
| `npm run build` | Build all workspaces |

---

## 🔄 CI/CD Pipeline (Phase 5)

- **Full Validation**: Runs on every `master` commit
- **Selective Release**: Triggered by service-specific tags
- **Deployment Isolation**: Failure in one service doesn't block others

---

## 🚨 Critical Reminders

1. **Never add version to `package.json`**: Use Git tags for releases.
2. **Respect dependency boundaries**: Apps/Games → Packages only.
3. **Run `npm install` from root**: Required after adding workspace deps.
4. **Use full package names**: `@kwokka/entities`, not `entities`.
5. **Service-specific tags only**: `owl-1.2.0`, not `v1.2.0`.
