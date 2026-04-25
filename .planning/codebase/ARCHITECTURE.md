# Architecture

**Analysis Date:** 2026-04-25

## Pattern Overview

**Overall:** Single-page scrolling portfolio with progressive reveal animations. No client-side routing library -- uses native `scrollIntoView` for navigation between sections.

**Key Characteristics:**
- Single-page application (SPA) with zero routing dependencies -- all sections rendered top-to-bottom in a single `main` element
- Data-driven component architecture: all content is passed as props from a centralized data layer (`src/data/portfolio.ts`)
- Scroll-driven animation system using custom `useInView` hook with `IntersectionObserver`
- Memoized components (`React.memo`) throughout for render optimization
- Theme system managed via custom hook with localStorage persistence and `@media (prefers-color-scheme)` integration
- No client-side state management library -- all state is local (component-level `useState`)

## Layers

**Data Layer:**
- Purpose: Centralized source of truth for all portfolio content
- Location: `src/data/portfolio.ts`
- Contains: Raw data arrays (`demos`, `blogPosts`, `skills`, `timeline`, `models`, `frameworks`, `evaluations`) typed via `src/types/index.ts`
- Depends on: `src/types/index.ts` for TypeScript interfaces
- Used by: `src/App.tsx` -- imports all data and passes as props to child components

**Type Layer:**
- Purpose: Shared TypeScript interfaces used across the data and component layers
- Location: `src/types/index.ts`
- Contains: Interfaces `Message`, `Demo`, `BlogPost`, `Skill`, `TimelineEvent`, `Model`, `Framework`, `Evaluation`
- Used by: `src/data/portfolio.ts` (data typing), all section components (prop typing)

**Component Layer:**
- Purpose: Presentational components that receive data as props and render UI
- Location: `src/components/`
- Contains: 8 section components + 1 interactive chat demo (`HeroChat`) + 3 custom hooks
- Depends on: Data layer (via props from App), custom hooks for animation/theme/typing effects

**Custom Hook Layer:**
- Purpose: Reusable logic for scroll detection, theme management, and typewriter effects
- Location: `src/components/hooks/`
- Contains: `useInView.ts`, `useTheme.ts`, `useTyping.ts`
- Used by: All section components for scroll-reveal animations; Nav for theme toggling; Hero for terminal typing effect

**Styling Layer (CSS + Tailwind):**
- Purpose: Visual design system, animations, utility classes
- Location: `src/index.css` (design tokens, keyframes, component styles), `src/App.css` (unused), Tailwind utility classes applied inline
- Contains: CSS custom properties (design tokens), keyframe animations, terminal block styles, glow effects, grid backgrounds, responsive breakpoints

## Data Flow

**Page Render Flow:**

1. `src/main.tsx` mounts `<App />` inside `React.StrictMode`
2. `src/App.tsx` imports all data arrays from `src/data/portfolio.ts`
3. App renders a flat sequence of 8 section components, passing relevant data slices as props
4. Each section component renders its data using a card/list sub-component pattern
5. Scroll-reveal animations are triggered by the `useInView` hook firing on each card/element

**Interaction Flow:**

- Nav section buttons trigger `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
- Projects code toggle: `useState<boolean>` in `ProjectCard` controls inline code block visibility
- HeroChat tab switching: `useState` local state toggles between RAG/Agent/Eval views
- Theme switch: `useTheme` hook updates `data-theme` attribute on `<html>`, persisted to `localStorage('p2-theme')`

**State Management:**
- No global state management library. All state is local via `useState` and `useEffect`.
- Theme state: shared via `useTheme` hook (called in `Nav.tsx` only -- no prop drilling needed)
- Scroll position: `useState` + `useCallback` in `Nav.tsx` for sticky header behavior
- Chat simulation: `useState` for messages + `useRef` + `setTimeout` for delayed response in `HeroChat.tsx`
- Animation triggers: Each card's visibility is tracked independently via `useInView`

## Component Hierarchy

```
<App>
  <Nav />                           # Sticky header with section nav + theme toggle
  <main>
    <Hero />                        # Terminal intro + headline + stats grid
      └─ <useInView />              # Trigger entrance animations
      └─ <useTyping />              # Typewriter effect on terminal text
    <Projects list={demos} />       # 2-col grid of project cards
      └─ <ProjectCard /> × 8       # Individual project with code expand toggle
    <Models list={models} />        # 4-col grid of model cards
      └─ <ModelCard /> × 8
    <Frameworks frameworks={…} evaluations={…} />  # Two sub-sections: tools + benchmarks
      └─ <FrameworkCard /> × 6
      └─ <EvalCard /> × 6
    <Writing list={blogPosts} />    # 2-col layout: heading + blog list
      └─ <BlogItem /> × 5
    <Stack list={skills} />         # 5-col grid of skill category cards
      └─ <SkillCard /> × 8
    <Timeline list={timeline} />    # Single-column timeline event list
      └─ <TimelineEvent /> × 8
  </main>
  <Footer />                        # Links + section quick-jump
</App>
```

**Interactive Sub-Component (HeroChat):**
```
<HeroChat />                        # Simulated LLM chat interface (3-tab demo)
  ├── <RAGView />                   # Q&A simulator with input + message list
  ├── <AgentView />                 # Agent step visualization
  └── <EvalView />                  # Evaluation metrics display
```

## Entry Points

**Browser Entry:**
- Location: `index.html`
- Responsibilities: Sets `<html lang="zh-CN">`, defines `<div id="root">`, loads `<script type="module" src="/src/main.tsx">`

**Application Entry:**
- Location: `src/main.tsx`
- Responsibilities: Mounts React app in `React.StrictMode`, imports global CSS (`src/index.css`)
- Rendering: `ReactDOM.createRoot(document.getElementById('root')!).render(<App />)`

**Build Entry:**
- Location: `vite.config.ts`
- Plugins: `@vitejs/plugin-react` + `@tailwindcss/vite`
- TypeScript config: `tsconfig.json` with strict mode, `tsc -b` before build
- Build output: `dist/`

## Routing

**Strategy:** No router library. Single-page scroll-based navigation.

- Nav buttons call `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
- Section `id` attributes: `top`, `projects`, `writing`, `stack`, `journey`
- Footer also has inline scroll-to buttons for `projects` and `writing`
- No URL hash, no browser history integration, no route parameters

## Error Handling

**Strategy:** Minimal. This is a static portfolio site with no async operations (except HeroChat simulation).

**Patterns:**
- `HeroChat.tsx` (line 37): `setTimeout` cleanup via `useEffect` return with `clearTimeout(timerRef.current)`
- `useTheme.ts` (line 7): `try/catch` around `localStorage` access to handle private browsing / storage restrictions
- No formal error boundaries implemented
- No try/catch in component rendering

## Cross-Cutting Concerns

**Logging:** Not used. No logging framework, no console.log statements in production code.

**Validation:** Only in `HeroChat.tsx` (line 40): `if (!query.trim()) return;` before sending simulated message.

**Authentication:** Not applicable. Static portfolio site with no auth.

**Accessibility:**
- Skip-to-content link (line 18-22 of `App.tsx`) as first focusable element
- `aria-label` on semantic elements: nav (`"主导航"`), sections, GitHub link (`"GitHub（在新窗口打开）"`)
- `aria-expanded` on mobile menu toggle and code expand buttons
- `aria-pressed` on theme toggle buttons
- `role="group"` on theme switcher (`"切换主题"`)
- Semantic HTML throughout: `header`, `main`, `nav`, `section`, `article`, `footer`
- `@media (prefers-reduced-motion: reduce)` rule (line 295 of `index.css`) kills all animations/transitions
- `sr-only` utility class for screen-reader-only content
- Section elements have `aria-labelledby` pointing to their heading

**Animation System:**
- All scroll reveals share the same pattern: `opacity: 0->1` + `translateY` transition triggered by `useInView`
- Card stagger delays: `index * N ms` (50-90ms per item depending on section)
- Consistent cubic-bezier timing: `ease 0.5s-0.8s`
- Terminal `useTyping` effect with configurable speed (38ms default)
- CSS keyframe animations: `glow-pulse` (LIVE badges), `blink` (cursor), `fadeUp` (general entrance)
- `scroll-behavior: smooth` on `<html>` (line 64 of `index.css`)

**Performance:**
- All section components wrapped in `React.memo` (exported via `memo()`)
- All card sub-components wrapped in `React.memo`
- Scroll listener in Nav uses `{ passive: true }` (line 31 of `Nav.tsx`)
- `useInView` defaults to `once: true`, disconnecting observer after first intersection
- No unnecessary re-renders: data is static, passed as props, not fetched asynchronously

---

*Architecture analysis: 2026-04-25*
