# Kwokka Platform Monorepo

A unified monorepo for the Kwokka platform, consolidating all services, packages, and games using **npm workspaces**.

---

## 🏗️ Structure

```
kwokka-platform/
├── applications/     # Platform services (owl, capybara, zebra, kwokka-frontend)
├── packages/         # Shared libraries (entities, sdk-node, sdk-js, utils, etc.)
├── games/            # Fullstack game projects
│   └── pawsome-elements/
│       ├── frontend/
│       ├── backend/
│       └── landing/
├── infrastructure/   # Deployment configs
└── scripts/          # Global automation scripts
```

---

## 📦 Working with the Monorepo

### Creating a New Package

```bash
mkdir packages/my-package
cd packages/my-package
# Create package.json (no version field):
# {
#   "name": "@kwokka/my-package",
#   "main": "index.js"
# }
cd ../..
npm install
```

### Creating an Application or Game

Same process as packages, but place in `applications/` or `games/` respectively.

### Adding a Package to an App

In the app's `package.json`:

```json
{
  "dependencies": {
    "@kwokka/entities": "*"
  }
}
```

Then run `npm install` at the root.

### Releasing a Service

Use **Service-Specific Tagging**:

```bash
git tag owl-1.2.0
git push origin owl-1.2.0
```

Tags follow the pattern: `<service-name>-<semver>` (e.g., `capybara-2.1.5`, `frontend-3.0.1`)

---

## 🚀 Developer Workflow

### Start the Platform

```bash
npm run dev:platform
```

### Start a Game (Interactive Selection)

```bash
npm run dev:game
```

---

## 🔧 Tech Stack

- **Node.js**: v24+ (LTS)
- **Package Management**: npm workspaces (native)
- **Versioning**: Git tags (service-specific)

---

## 📋 For AI Agents

See `AGENTS.md` for detailed context on monorepo rules, boundaries, and conventions.
