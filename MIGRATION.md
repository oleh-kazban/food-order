# Universal Migration Guide: Upgrading React Starters to Enterprise Developer Experience

> **Target Audience:** Autonomous AI Agents & Engineering Leads  
> **Input:** Any React application or starter repository (e.g., Vite + JavaScript, incomplete TypeScript, legacy ESLint, or missing developer guardrails).  
> **Output:** A standardized, production-ready enterprise repository equipped with strict TypeScript, modern ESLint Flat Config, Prettier, circular dependency detection (Madge), automated Git hooks (Husky), and an optional Nx task orchestration layer.

---

## 1. Architectural Baseline & Target State

This guide defines the target enterprise blueprint. When applied to any starter project, the executing agent must transform the codebase according to the following architecture:

| Architectural Pillar       | Starter / Baseline State                                       | Target Enterprise Standard                                                                                                                 | Rationale                                                                                |
| :------------------------- | :------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| **Package Management**     | Unpinned `npm` / `yarn`, ambiguous lockfiles                   | Pinned `pnpm` (via `packageManager` field) + build authorization (`pnpm-workspace.yaml`)                                                   | Fast hardlinked installs, deterministic lockfiles, strict build script isolation.        |
| **Type Safety & Compiler** | Plain JS / JSX, or loose TS without project-wide type checking | Strict TypeScript (`.ts` / `.tsx`, `"strict": true`), ambient declarations (`vite-env.d.ts`), bundler resolution, matching `@types/react*` | Eliminates runtime prop drift; provides compile-time interface contracts.                |
| **Path Resolution**        | Fragile deep relative paths (`../../components/Button`)        | Scoped path alias (e.g., `@<alias>/*` or `@app/*`) across TS and bundler                                                                   | Decouples physical disk hierarchy from import sites; simplifies refactoring.             |
| **Linter Architecture**    | Legacy `.eslintrc.*` (ESLint 8 or older), brittle CLI flags    | ESLint v10 Flat Config (`eslint.config.js`) via `@eslint/compat`                                                                           | Unified modular configuration; composable flat array; native ESM support.                |
| **Import Ordering**        | Non-deterministic, scattered import declarations               | `eslint-plugin-simple-import-sort` with explicit tier grouping                                                                             | Minimizes Git merge conflicts; separates framework, 3rd-party, alias, and local imports. |
| **Code Formatting**        | Inconsistent IDE defaults or linter rule clashes               | Prettier (`.prettierrc.json`) + `eslint-config-prettier`                                                                                   | Total separation of AST correctness (ESLint) from aesthetic code layout (Prettier).      |
| **Dependency Integrity**   | No architectural boundary enforcement                          | Circular dependency gate via `madge`                                                                                                       | Guarantees clean directed acyclic dependency graphs (DAG); prevents runtime TDZ errors.  |
| **Git Lifecycle Hooks**    | Absent or unmaintained `.git` hooks                            | `husky` v9 + `lint-staged` pre-commit and pre-push (`madge`)                                                                               | Sub-second staged AST & style validation at local commit boundary; fast DX at scale.     |
| **Task Orchestration**     | Standard package script execution                              | Optional Nx Standalone (`project.json`, `nx.json`) with computation caching                                                                | Caches target executions and executes only on affected files during local hooks.         |
| **CI/CD & PR Protocol**    | Absent or ad-hoc CI scripts                                    | GitHub Actions (`ci.yaml`, `pr-validation.yaml`) + PR Template                                                                             | Automated trunk CI, affected/full PR validation gates, and structured review checklists. |

---

## 2. Autonomous Agent Execution Instructions

Execute the migration in strict chronological sequence. If any step fails, diagnose and resolve the issue before continuing to the next phase.

### Checkpoint & Commit Protocol

To guarantee atomic bisectability (`git bisect`), rollback safety, and readable PR review history, the executing agent must commit all changes **at the completion of EACH phase** using Conventional Commits. Never collapse multiple phases into a single bulk commit. If a phase fails verification, resolve all errors before creating the checkpoint commit.

### Phase 1: Environment Discovery & Git Hygiene

1. **Verify Git Repository:**
   Husky requires an initialized Git repository with an existing branch. Check for `.git`:
   ```bash
   git status || git init
   ```
2. **Detect Package Identity & Versions:**
   - Read `package.json`.
   - Identify the project name (`name`) and current React major version (`dependencies.react`).
   - Define the project's path alias prefix:
     - Default rule: `@app/*` OR derive from package name (e.g., `"name": "react-quiz"` -> `@quiz/*`, `"name": "project-management"` -> `@pm/*`).
3. **Standardize on `pnpm`:**

   - Pin `packageManager` in `package.json`:
     ```json
     {
       "packageManager": "pnpm@12.10.1"
     }
     ```
   - Delete any existing legacy lockfiles and directories:
     - **POSIX / Bash:**
       ```bash
       rm -rf package-lock.json yarn.lock bun.lockb node_modules
       ```
     - **PowerShell (Windows):**
       ```powershell
       Remove-Item -Recurse -Force -ErrorAction SilentlyContinue package-lock.json, yarn.lock, bun.lockb, node_modules
       ```
   - **Authorize Native Dependency Builds (pnpm v10+ / v12+):**
     Modern pnpm strictly isolates build lifecycle scripts (`ERR_PNPM_IGNORED_BUILDS`). Authorize native compilers (such as `esbuild` used by Vite) upfront by creating `pnpm-workspace.yaml`:
     ```yaml
     allowBuilds:
       esbuild: true
     ```
     _(Alternatively, run `pnpm approve-builds --all` after package installation)._

4. **Phase 1 Commit Checkpoint:**
   ```bash
   git add .
   git commit -m "chore(env): establish git baseline, pin pnpm, and authorize native builds"
   ```

---

### Phase 2: TypeScript Migration & Path Aliasing

1. **Install TypeScript & Compiler Dependencies:**
   Install TypeScript, the TS ESLint parser, and React type definitions matching the major version of React present in `package.json`:

   ```bash
   pnpm add -D typescript@5.5.4 @types/react@19.0.0 @types/react-dom@19.0.0 typescript-eslint@^8.71.2
   ```

   _(Note: Match `@types/react_` versions to the project's installed React runtime version).\*

2. **Generate `tsconfig.json`:**
   Configure modern bundler-compatible resolution with path mapping and strict type checking:

   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": true,
       "baseUrl": ".",
       "paths": {
         "@<alias>/*": ["./src/*"]
       }
     },
     "include": ["src"]
   }
   ```

   _(Replace `<alias>` with the selected alias, e.g., `app` or the project short name)._  
   _(Note for legacy migrations: If upgrading a massive legacy codebase where immediate strictness produces thousands of errors, stage incrementally with `"strictNullChecks": true` and `"noImplicitAny": true` before enforcing `"strict": true`)._

3. **Configure Bundler Path Aliasing (e.g., `vite.config.ts` or `vite.config.js`):**
   Synchronize the alias with the bundler resolver:

   ```javascript
   import react from '@vitejs/plugin-react';
   import path from 'path';
   import { fileURLToPath } from 'url';
   import { defineConfig } from 'vite';

   const __dirname = path.dirname(fileURLToPath(import.meta.url));

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@<alias>': path.resolve(__dirname, './src'),
       },
     },
   });
   ```

4. **Convert Source Files:**

   - Rename all `.jsx` files to `.tsx`.
   - Rename all `.js` files containing logic to `.ts` (retain `.js` only for build/config scripts if ESM).
   - In `index.html`, update the entry point script tag:
     ```html
     <!-- Before: /src/main.jsx -->
     <script type="module" src="/src/main.tsx"></script>
     ```
   - Update bundler content matchers (e.g., in `tailwind.config.js` if present) to include `.{ts,tsx}`.

5. **Provide Ambient Type Declarations (`src/vite-env.d.ts`):**
   To resolve static assets (images, SVGs, CSS modules) and `import.meta.env` without `TS2307` compiler errors, create `src/vite-env.d.ts`:

   ```typescript
   /// <reference types="vite/client" />
   ```

6. **Type Remediation:**
   Ensure all component signatures and React roots compile cleanly under TSX. Replace empty placeholder components with valid typed returns (e.g., `return null;` or valid JSX). Strictly handle nullable DOM root elements (e.g., `document.getElementById('root')!`).

7. **Phase 2 Commit Checkpoint:**
   ```bash
   git add .
   git commit -m "feat(ts): migrate sources to strict typescript with path aliasing"
   ```

---

### Phase 3: ESLint Flat Config & Import Sorting

1. **Install ESLint Packages:**

   ```bash
   pnpm add -D eslint@10.12.0 @eslint/js@10.0.1 @eslint/compat@^2.1.1 eslint-plugin-react@7.37.5 eslint-plugin-react-hooks@7.1.1 eslint-plugin-react-refresh@0.5.7 eslint-plugin-simple-import-sort@14.0.0 globals@17.13.0 eslint-config-prettier@10.1.8 typescript-eslint@^8.71.2
   ```

2. **Remove Deprecated ESLint Files:**
   Delete any `.eslintrc`, `.eslintrc.js`, `.eslintrc.json`, or `.eslintrc.yml`.

3. **Create `eslint.config.js`:**
   Establish the universal flat configuration with backward-compatible plugin adaptations and tiered import sorting:

   ```javascript
   import { fixupPluginRules } from '@eslint/compat';
   import js from '@eslint/js';
   import eslintConfigPrettier from 'eslint-config-prettier/flat';
   import react from 'eslint-plugin-react';
   import reactHooks from 'eslint-plugin-react-hooks';
   import reactRefresh from 'eslint-plugin-react-refresh';
   import simpleImportSort from 'eslint-plugin-simple-import-sort';
   import globals from 'globals';
   import tseslint from 'typescript-eslint';

   const reactPlugin = fixupPluginRules(react);

   export default tseslint.config(
     {
       linterOptions: {
         reportUnusedDisableDirectives: 'error',
       },
     },
     {
       ignores: ['dist/**', 'node_modules/**', '.nx/**'],
     },
     js.configs.recommended,
     ...tseslint.configs.recommended,
     {
       files: ['**/*.{js,ts,tsx}'],
       languageOptions: {
         ecmaVersion: 'latest',
         sourceType: 'module',
         parserOptions: {
           ecmaFeatures: { jsx: true },
         },
         globals: globals.browser,
       },
       plugins: {
         react: reactPlugin,
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
         'simple-import-sort': simpleImportSort,
       },
       settings: {
         react: { version: 'detect' },
       },
       rules: {
         ...react.configs.recommended.rules,
         ...react.configs['jsx-runtime'].rules,
         ...reactHooks.configs.flat.recommended.rules,
         'react/prop-types': 'off',
         'react/react-in-jsx-scope': 'off',
         'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
         '@typescript-eslint/no-unused-vars': [
           'error',
           {
             argsIgnorePattern: '^_',
             varsIgnorePattern: '^_',
           },
         ],
         'no-duplicate-imports': 'error',
         'padding-line-between-statements': [
           'error',
           { blankLine: 'always', prev: '*', next: 'export' },
           { blankLine: 'any', prev: 'export', next: 'export' },
         ],
         'simple-import-sort/imports': [
           'error',
           {
             groups: [
               ['^react'],
               ['^@?\\w'],
               ['^@<alias>/'],
               ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
               ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
               ['^.+\\.s?css$'],
             ],
           },
         ],
         'simple-import-sort/exports': 'error',
       },
     },
     eslintConfigPrettier,
   );
   ```

   _(Ensure `'^@<alias>/'` reflects your chosen path alias)._

4. **Phase 3 Commit Checkpoint:**
   ```bash
   git add .
   git commit -m "feat(eslint): establish flat config and tiered import ordering"
   ```

---

### Phase 4: Prettier Setup & Formatting Pipeline

1. **Install Prettier:**

   ```bash
   pnpm add -D prettier@3.3.3
   ```

2. **Create `.prettierrc.json`:**

   ```json
   {
     "semi": true,
     "singleQuote": true,
     "trailingComma": "all",
     "printWidth": 100,
     "bracketSpacing": true,
     "endOfLine": "lf",
     "arrowParens": "avoid"
   }
   ```

3. **Create `.prettierignore`:**

   ```text
   node_modules
   dist
   pnpm-lock.yaml
   .nx
   ```

4. **Phase 4 Commit Checkpoint:**
   ```bash
   git add .
   git commit -m "feat(prettier): configure formatting pipeline and ignore rules"
   ```

---

### Phase 5: Circular Dependency Checks (Madge)

1. **Install Madge:**

   ```bash
   pnpm add -D madge@8.0.0
   ```

2. **Configure Script:**
   Add target command to `package.json`:
   `"check:cycles": "madge --circular --extensions ts,tsx src"`

3. **Phase 5 Commit Checkpoint:**
   ```bash
   git add .
   git commit -m "feat(arch): configure madge circular dependency detection"
   ```

---

### Phase 6: Git Hook Automation (Husky + lint-staged)

1. **Install Husky & lint-staged:**

   ```bash
   pnpm add -D husky@9.1.7 lint-staged@15.2.10
   ```

2. **Register Prepare Script & lint-staged Configuration:**
   In `package.json`, add:

   ```json
   {
     "scripts": {
       "prepare": "husky",
       "lint:staged": "lint-staged"
     },
     "lint-staged": {
       "*.{js,ts,tsx}": ["eslint --max-warnings 0 --no-warn-ignored --fix", "prettier --write"],
       "*.{json,css,html,md}": ["prettier --write"]
     }
   }
   ```

3. **Initialize Husky Hooks:**

   ```bash
   pnpm run prepare
   ```

4. **Create `.husky/pre-commit`:**
   Enforce sub-second validation by running strictly on staged changes:

   ```sh
   pnpm lint-staged
   ```

5. **Create `.husky/pre-push`:**
   Run full-project circular dependency gate prior to remote push:

   ```sh
   pnpm check:cycles
   ```

6. **Phase 6 Commit Checkpoint:**
   _(Note: This commit activates Husky hooks. All subsequent commits will automatically dogfood `.husky/pre-commit` via `lint-staged`)._
   ```bash
   git add .
   git commit -m "feat(husky): bind pre-commit (lint-staged) and pre-push (madge) hooks"
   ```

---

### Phase 7: Optional Task Orchestrator (Nx Standalone Layer)

If the project requires computation caching, affected-graph capabilities, or unified monorepo management:

1. **Install Nx:**

   ```bash
   pnpm add -D nx@^23.3.0
   ```

2. **Configure `pnpm-workspace.yaml` (if applicable):**

   ```yaml
   allowBuilds:
     esbuild: true
     nx: true
   ```

3. **Create `nx.json`:**

   ```json
   {
     "$schema": "./node_modules/nx/schemas/nx-schema.json",
     "defaultBase": "main",
     "namedInputs": {
       "default": ["{projectRoot}/**/*"],
       "production": [
         "default",
         "!{projectRoot}/eslint.config.js",
         "!{projectRoot}/.prettierrc.json"
       ]
     },
     "targetDefaults": {
       "build": {
         "cache": true,
         "dependsOn": ["^build"],
         "inputs": ["production", "^production"],
         "outputs": ["{projectRoot}/dist"]
       },
       "lint": {
         "cache": true,
         "inputs": ["default"]
       },
       "format:check": {
         "cache": true,
         "inputs": ["default"]
       },
       "check:cycles": {
         "cache": true,
         "inputs": ["default"]
       }
     },
     "analytics": false
   }
   ```

4. **Create `project.json`:**

   ```json
   {
     "name": "<project-name>",
     "$schema": "node_modules/nx/schemas/project-schema.json",
     "projectType": "application",
     "sourceRoot": "src",
     "targets": {
       "build": {
         "executor": "nx:run-commands",
         "options": { "command": "vite build" }
       },
       "serve": {
         "executor": "nx:run-commands",
         "options": { "command": "vite" }
       },
       "preview": {
         "executor": "nx:run-commands",
         "options": { "command": "vite preview" }
       },
       "lint": {
         "executor": "nx:run-commands",
         "options": { "command": "eslint . --max-warnings 0 --no-warn-ignored" }
       },
       "lint:fix": {
         "executor": "nx:run-commands",
         "options": {
           "command": "eslint . --max-warnings 0 --no-warn-ignored --fix"
         }
       },
       "check:cycles": {
         "executor": "nx:run-commands",
         "options": { "command": "madge --circular --extensions ts,tsx src" }
       }
     }
   }
   ```

5. **Update Husky Hooks for Nx:**
   When Nx is active, update `.husky/pre-commit` to utilize affected caching and isolate daemons:

   ```sh
   # POSIX: export NX_DAEMON=false; PowerShell: $env:NX_DAEMON="false"
   export NX_DAEMON=false
   pnpm nx affected -t lint:fix
   pnpm format:uncommitted
   ```

   And `.husky/pre-push`:

   ```sh
   export NX_DAEMON=false
   pnpm check:cycles
   ```

6. **Phase 7 Commit Checkpoint (if executed):**
   ```bash
   git add .
   git commit -m "feat(nx): configure nx standalone task caching and target graph"
   ```

---

### Phase 8: Standard Scripts Manifest

Ensure `package.json` reflects the canonical script interface:

```json
{
  "scripts": {
    "prepare": "husky",
    "start": "vite",
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0 --no-warn-ignored",
    "lint:fix": "eslint . --max-warnings 0 --no-warn-ignored --fix",
    "lint:staged": "lint-staged",
    "check:cycles": "madge --circular --extensions ts,tsx src",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "preview": "vite preview"
  }
}
```

2. **Phase 8 Commit Checkpoint:**
   ```bash
   git add .
   git commit -m "chore(scripts): finalize enterprise scripts manifest"
   ```

---

### Phase 9: Continuous Integration & GitHub Workflows (`.github`)

1. **Create Pull Request Template (`.github/pull_request_template.md`):**
   Standardizes PR documentation and self-review compliance:

   ```markdown
   ## Description

   <!-- Provide a brief description of the architectural context, changes, and motivation -->

   ## Ticket / Issue

   <!-- Link relevant tracking ticket or issue (e.g. #123) -->

   ## Type of Change

   - [ ] `feat`: New feature or capability
   - [ ] `fix`: Bug fix
   - [ ] `refactor`: Structural or architectural improvement
   - [ ] `perf`: Performance optimization
   - [ ] `chore`: Tooling, dependencies, or configuration

   ## Checklist

   - [ ] Self-review completed
   - [ ] Monorepo verification passed locally (`pnpm lint`, `pnpm typecheck`, `pnpm check:cycles`)
   - [ ] Formatted with Prettier (`pnpm format:check`)
   - [ ] Screenshots or recordings attached (for UI changes)
   ```

2. **Create Trunk Validation Workflow (`.github/workflows/ci.yaml`):**
   Validates trunk pushes against code formatting, circular dependencies, linter rules, type safety, and production build:

   ```yaml
   name: CI

   on:
     push:
       branches: [main, master]

   permissions:
     contents: read

   concurrency:
     group: ci-${{ github.ref }}
     cancel-in-progress: true

   jobs:
     pipeline:
       name: Trunk Validation (Format, Cycles, Lint, Typecheck, Build)
       runs-on: ubuntu-latest
       steps:
         - name: Checkout repository
           uses: actions/checkout@v4

         - name: Setup pnpm
           uses: pnpm/action-setup@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'pnpm'

         - name: Install dependencies
           run: pnpm install --frozen-lockfile

         - name: Verify Code Formatting
           run: pnpm format:check

         - name: Verify Architectural Cycles
           run: pnpm check:cycles

         - name: Run Quality Matrix
           run: pnpm run lint && pnpm run typecheck && pnpm run build
   ```

   _(Note: When Phase 7 Nx orchestration is enabled, replace the last step with `pnpm nx run-many -t lint typecheck build --parallel=3`)_.

3. **Create PR Validation Workflow (`.github/workflows/pr-validation.yaml`):**
   Enforces identical validation on pull requests targeting trunk:

   ```yaml
   name: PR Validation

   on:
     pull_request:
       branches: [main, master]

   permissions:
     contents: read

   concurrency:
     group: pr-${{ github.event.pull_request.number || github.ref }}
     cancel-in-progress: true

   jobs:
     validate:
       name: Validate PR (Format, Cycles, Lint, Typecheck, Build)
       runs-on: ubuntu-latest
       steps:
         - name: Checkout repository
           uses: actions/checkout@v4
           with:
             fetch-depth: 0

         - name: Setup pnpm
           uses: pnpm/action-setup@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'pnpm'

         - name: Install dependencies
           run: pnpm install --frozen-lockfile

         - name: Verify Code Formatting
           run: pnpm format:check

         - name: Verify Architectural Cycles
           run: pnpm check:cycles

         - name: Validate PR Changes
           run: >
             pnpm nx affected
             -t lint typecheck build
             --base=origin/${{ github.base_ref }}
             --head=HEAD
             --parallel=3
   ```

   _(Note: For non-Nx standalone setups without affected calculation, substitute the final step with `pnpm run lint && pnpm run typecheck && pnpm run build`)_.

4. **Phase 9 Commit Checkpoint:**
   ```bash
   git add .
   git commit -m "ci(github): configure pull request template, trunk validation, and pr validation workflows"
   ```

---

## 3. Autonomous Verification & Quality Gates

The agent must run and pass the following quality gates in order:

1. **Dependency Resolution:**
   ```bash
   pnpm install --frozen-lockfile || pnpm install
   ```
2. **Type Check Verification:**
   ```bash
   pnpm typecheck
   ```
   _(Must exit with code 0 without any ambient or prop mismatch errors)._
3. **Lint & Import Arrangement:**
   ```bash
   pnpm lint:fix
   ```
   _(Must exit with code 0)._
4. **Format Validation:**
   ```bash
   pnpm format:check
   ```
   _(Must exit with code 0 with no formatting warnings)._
5. **Architectural Graph Verification:**
   ```bash
   pnpm check:cycles
   ```
   _(Must report 0 circular dependencies)._
6. **Production Compilation:**
   ```bash
   pnpm build
   ```
   _(Must generate a clean production bundle in `dist/`)._
7. **Hook Verification:**
   Verify `.husky/pre-commit` (`pnpm lint-staged`) and `.husky/pre-push` (`pnpm check:cycles`) are executable (`chmod +x .husky/*` on POSIX systems or properly tracked by Git on Windows).
