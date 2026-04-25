# Codebase Structure

**Analysis Date:** 2026-04-25

## Directory Layout

```
LLM-agent/
├── index.html                       # HTML entry point, mounts #root
├── package.json                     # Dependencies: React 19, Vite 8, Tailwind 4
├── tsconfig.json                    # TypeScript config (strict, ES2020, react-jsx)
├── vite.config.ts                   # Vite plugins: react + tailwindcss
├── CLAUDE.md                        # Project-level Claude instructions
├── .planning/
│   └── codebase/                    # Architecture analysis documents (this file)
├── src/                             # Application source code
│   ├── main.tsx                     # React mount point
│   ├── App.tsx                      # Root component, section layout
│   ├── index.css                    # Global styles, design tokens, animations
│   ├── App.css                      # Unused (empty/leftover)
│   ├── vite-env.d.ts                # Vite environment type declarations
│   ├── types/
│   │   └── index.ts                 # Shared TypeScript interfaces (7 total)
│   ├── data/
│   │   └── portfolio.ts             # All portfolio content as typed arrays
│   ├── assets/
│   │   ├── hero.png                 # Hero section image
│   │   ├── react.svg                # React logo asset
│   │   └── vite.svg                 # Vite logo asset
│   └── components/
│       ├── Nav.tsx                  # Sticky header + nav + theme toggle
│       ├── Hero.tsx                 # Hero/landing section
│       ├── HeroChat.tsx             # Interactive LLM chat simulation (3 tabs)
│       ├── Projects.tsx             # Project cards grid (2-col)
│       ├── Models.tsx               # Chinese LLM model cards grid (4-col)
│       ├── Frameworks.tsx           # Frameworks + evaluations grid
│       ├── Writing.tsx              # Blog post list
│       ├── Stack.tsx                # Skill/toolchain cards grid
│       ├── Timeline.tsx             # Career timeline
│       ├── Footer.tsx               # Footer with links
│       └── hooks/
│           ├── useInView.ts         # IntersectionObserver scroll-reveal hook
│           ├── useTheme.ts          # Theme persistence hook (dark/light/system)
│           └── useTyping.ts         # Typewriter text effect hook
├── llm_projects/                    # Linked submodules for individual LLM projects
│   ├── ai-agents-from-zero/         # Agent development from scratch
│   ├── Chinese-LLaMA-Alpaca-3/      # Chinese LLaMA fine-tuning
│   ├── llm-action/                  # LLM in action tutorials
│   ├── llm-action-notes/            # Study notes on LLM action
│   ├── RAG-Anything/                # Universal RAG system
│   └── TRAINING_GUIDE.md            # Training methodology guide
├── docs/                            # Technical deep-dive blog articles (markdown)
│   ├── chinese-llm-landscape.md     # 2026 Chinese LLM landscape
│   ├── kg-rag.md                    # Knowledge graph RAG deep-dive
│   ├── llm-eval.md                  # LLM evaluation methodology
│   ├── mcp-protocol.md              # MCP protocol analysis
│   ├── rag-deep-dive.md             # RAG system deep-dive
│   └── thinking-mode.md             # Thinking modes for LLM apps
├── public/
│   └── favicon.svg                  # Site favicon
├── dist/                            # Production build output (gitignored)
└── node_modules/                    # Dependencies (gitignored)
```

## Directory Purposes

**`src/components/`:**
- Purpose: All React UI components organized as flat files (one per section), plus a `hooks/` subdirectory for reusable logic
- Contains: 10 component files (Nav, Hero, HeroChat, Projects, Models, Frameworks, Writing, Stack, Timeline, Footer) + 3 hook files
- Key files: `HeroChat.tsx` (most complex component, 177 lines, 3 sub-views), `Projects.tsx` (cards with code expand toggle)
- File count: 10 .tsx files + 3 .ts hook files

**`src/components/hooks/`:**
- Purpose: Reusable React hooks extracted from component logic
- Contains: `useInView.ts` (scroll-reveal, 25 lines), `useTheme.ts` (theme persistence, 17 lines), `useTyping.ts` (typewriter effect, 17 lines)
- Each hook is a single exported function, 17-25 lines each

**`src/types/`:**
- Purpose: Centralized TypeScript type definitions shared between data and components
- Contains: Single `index.ts` file with 7 interfaces: `Demo`, `BlogPost`, `Skill`, `TimelineEvent`, `Model`, `Framework`, `Evaluation`, plus `Message` (used in HeroChat)

**`src/data/`:**
- Purpose: All static content data for the portfolio, organized as typed arrays
- Contains: Single `portfolio.ts` file (~240 lines) exporting 7 data arrays (demos, blogPosts, skills, timeline, models, frameworks, evaluations)

**`llm_projects/`:**
- Purpose: Git-linked submodule directories for individual LLM projects (each is its own repo under Criss36)
- Contains: 5 project directories + 1 guide file (TRAINING_GUIDE.md)
- Generated: No (version-controlled manually)
- Committed: Yes

**`docs/`:**
- Purpose: Technical deep-dive articles in markdown format, content companion to the portfolio
- Contains: 6 markdown files covering RAG, MCP, evaluation, thinking modes, Chinese LLM landscape
- Date format: ISO date strings (e.g., `2026-04-15`)

**`src/assets/`:**
- Purpose: Static image/SVG assets imported by Vite (not served directly)
- Contains: `hero.png`, `react.svg`, `vite.svg`
- Note: `hero.png` exists but no component references it directly (may be legacy or used via CSS)

**`public/`:**
- Purpose: Static assets served directly by Vite without processing
- Contains: `favicon.svg` (referenced from `index.html` line 5)

**`dist/`:**
- Purpose: Production build output from `npm run build`
- Generated: Yes (via `tsc -b && vite build`)
- Committed: No (in `.gitignore`)

## Key File Locations

**Entry Points:**
- `index.html`: HTML shell with `<html lang="zh-CN">`, `<div id="root">`, and `<script type="module" src="/src/main.tsx">`
- `src/main.tsx`: React DOM mount -- `ReactDOM.createRoot(document.getElementById('root')!).render(<App />)`
- `vite.config.ts`: Build configuration with 2 plugins (`react()`, `tailwindcss()`)

**Configuration:**
- `package.json`: 3 runtime deps (`react`, `react-dom`, `tailwindcss`, `@tailwindcss/vite`), 11 devDeps including `vite`, `typescript`, `eslint`, `@vitejs/plugin-react`
- `tsconfig.json`: Strict mode enabled, `target: ES2020`, `jsx: react-jsx`, `noUnusedLocals: true`, `noUnusedParameters: true`
- `vite.config.ts`: Minimal -- only plugin list, no custom resolve aliases, no proxy, no build overrides

**Data Layer:**
- `src/data/portfolio.ts` (240 lines): All content data. Each array has specific structure:
  - `demos: Demo[]` (8 items) -- id, title, titleEn, description, tags[], status, code?
  - `blogPosts: BlogPost[]` (5 items) -- id, title, excerpt, date, tags[], readTime
  - `skills: Skill[]` (8 items) -- category, items[]
  - `timeline` (8 items) -- period, event
  - `models: Model[]` (8 items) -- name, provider, params, context, commercial
  - `frameworks: Framework[]` (6 items) -- name, type, description
  - `evaluations: Evaluation[]` (6 items) -- name, scope

**Styling:**
- `src/index.css` (394 lines): Complete design system -- CSS custom properties (tokens), Tailwind directives, component classes (`.card-project`, `.btn-primary`, `.terminal`, `.tag-chip`), keyframe animations, responsive utilities
- `src/App.css`: Exists but is empty / unused (no import found)
- Tailwind utility classes applied inline in JSX via `className`

**Types:**
- `src/types/index.ts`: All 7 data interfaces plus `Message` interface for HeroChat

## Component File Characteristics

| File | Lines | Props | State | Memo'd | Sub-components |
|------|-------|-------|-------|--------|----------------|
| `App.tsx` | 40 | none | none | no | Renders all sections |
| `Nav.tsx` | 164 | none | scrolled, menuOpen | yes | inline constants |
| `Hero.tsx` | 131 | none | started | yes | inline STATS array |
| `HeroChat.tsx` | 177 | none | mode, query, messages, loading | no | RAGView, AgentView, EvalView |
| `Projects.tsx` | 135 | list: Demo[] | codeOpen (per card) | yes | ProjectCard |
| `Models.tsx` | 88 | list: Model[] | none | yes | ModelCard |
| `Frameworks.tsx` | 113 | frameworks, evaluations | none | yes | FrameworkCard, EvalCard |
| `Writing.tsx` | 59 | list: BlogPost[] | none | yes | BlogItem |
| `Stack.tsx` | 50 | list: Skill[] | none | yes | SkillCard |
| `Timeline.tsx` | 40 | list: TimelineEvent[] | none | yes | TimelineEvent |
| `Footer.tsx` | 34 | none | none | yes | none |

## Naming Conventions

**Files:**
- PascalCase for component files: `Nav.tsx`, `Hero.tsx`, `Projects.tsx`, `Models.tsx`, `Frameworks.tsx`, `Writing.tsx`, `Stack.tsx`, `Timeline.tsx`, `Footer.tsx`, `HeroChat.tsx`
- camelCase with `use` prefix for hook files: `useInView.ts`, `useTheme.ts`, `useTyping.ts`
- Lowercase for data/type/config files: `portfolio.ts`, `index.ts`, `vite.config.ts`

**Functions/Components:**
- PascalCase for exported components: `Nav`, `Hero`, `ProjectCard`, `HeroChat`
- camelCase for inline sub-components: `RAGView`, `AgentView`, `EvalView`
- camelCase with `use` prefix for hooks: `useInView`, `useTheme`, `useTyping`

**Props Interfaces:**
- Named `interface Props` (consistent convention within each component file)
- Type imports from `src/types/` e.g., `import type { Demo } from '../types'`

**Variables:**
- camelCase throughout: `scrolled`, `menuOpen`, `codeOpen`, `timerRef`, `displayed`
- `UPPER_SNAKE_CASE` for module-level constants: `NAV_ITEMS`, `THEMES`, `STATS`, `MODE_TABS`

## Import Organization

**Order (observed across all component files):**
1. React core imports: `import { useState, memo, useEffect, useCallback, useRef } from 'react'`
2. Custom hooks: `import { useInView } from './hooks/useInView'`
3. Type imports: `import type { Model } from '../types'` (only when needed)
4. Data imports: `import { demos, blogPosts } from '../data/portfolio'` (only in `App.tsx`)

**Path aliases:** None configured. All imports use relative paths (`./`, `../`).

## Where to Add New Code

**New Section Component:**
- Implementation: `src/components/NewSection.tsx`
- Add data: `src/data/portfolio.ts` (if data-driven)
- Add types: `src/types/index.ts` (if new data shape needed)
- Wire in: `src/App.tsx` -- import the new component and add to `<main>` element

**New Hook:**
- Implementation: `src/components/hooks/useNewHook.ts`
- Import convention: `import { useNewHook } from './hooks/useNewHook'` in consuming component

**New Interactive Demo (like HeroChat):**
- Implementation: `src/components/NewDemo.tsx`
- Can be standalone (self-contained state/data) or data-driven
- Wire into existing section or create new section

**New Blog Article:**
- Content: `docs/new-article.md`
- Add metadata entry to `src/data/portfolio.ts` blogPosts array: id, title, excerpt, date, tags[], readTime

**New Static Asset:**
- `src/assets/` for build-processed assets (imported in components)
- `public/` for direct-served assets (referenced by URL path)

## Module Boundaries

**Data <-> Component boundary:** Components never fetch or define their own data. All content flows from `src/data/portfolio.ts` through `App.tsx` as props. Exception: `HeroChat.tsx` has hardcoded inline data (`MODE_TABS`, `agentSteps`, `evalResults`) because it is a demo simulation, not reusable portfolio content.

**Type <-> Component boundary:** Shared types live in `src/types/index.ts`. Component-specific prop interfaces are defined inline as `interface Props` within each component file.

**Visual <-> Logic boundary:** Custom hooks (`useInView`, `useTheme`, `useTyping`) encapsulate browser API interactions and side-effect logic away from presentational components.

---

*Structure analysis: 2026-04-25*
