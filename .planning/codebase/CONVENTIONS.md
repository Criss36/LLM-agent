# Coding Conventions

**分析日期：** 2026-04-25

## 命名模式

**文件：**
- React 组件使用 PascalCase：`Nav.tsx`、`Hero.tsx`、`HeroChat.tsx`、`Footer.tsx`、`Projects.tsx`、`Models.tsx`、`Frameworks.tsx`、`Writing.tsx`、`Stack.tsx`、`Timeline.tsx`
- Hooks 使用 camelCase，带 `use` 前缀：`useTheme.ts`、`useTyping.ts`、`useInView.ts`
- 数据文件使用 camelCase：`portfolio.ts`
- 类型定义文件使用 `index.ts` 位于 `types/` 目录下
- 样式文件使用 `App.css` 和 `index.css`（全局样式集中在 `index.css`）

**函数：**
- 组件函数使用 PascalCase：`function Nav()`、`function Hero()`
- 内部辅助组件使用 PascalCase：`ProjectCard`、`BlogItem`、`SkillCard`、`TimelineEvent`、`ModelCard`、`FrameworkCard`、`EvalCard`、`RAGView`、`AgentView`、`EvalView`
- 自定义 hooks 使用 camelCase：`useTheme`、`useTyping`、`useInView`
- 回调变量通常使用 arrow function 语法：`const send = () => {...}`、`const scrollTo = useCallback(...)`

**变量：**
- 常量使用 UPPER_SNAKE_CASE：`THEMES`、`NAV_ITEMS`、`STATS`、`MODE_TABS`
- 普通变量使用 camelCase：`scrolled`、`menuOpen`、`typed`、`codeOpen`

**类型：**
- 接口使用 PascalCase：`Demo`、`BlogPost`、`Skill`、`Model`、`Framework`、`Evaluation`、`TimelineEvent`、`Message`
- Props 类型使用 `interface Props` 或内联定义
- 类型别名使用 `type` 而非 `interface` 用于联合类型

## 编码风格

**格式化：**
- 无 Prettier 配置（项目根目录无 `.prettierrc`）
- 无 Biome 配置（项目根目录无 `biome.json`）
- 代码风格不统一：部分文件使用分号，部分不使用（`src/App.tsx` 无分号 vs 大多数组件使用分号）

**Linting：**
- ESLint v10 作为 devDependency 安装，但**项目根目录缺少 ESLint 配置文件**（无 `eslint.config.*` 或 `.eslintrc.*`）
- 使用 `eslint-plugin-react-hooks` 和 `eslint-plugin-react-refresh` 插件作为依赖，但未配置
- `package.json` 中包含 `"lint": "eslint ."` 脚本，但由于缺少配置文件，运行会失败
- 唯一一处 lint 抑制注释位于 `src/components/Nav.tsx:23`：`// eslint-disable-next-line react-hooks/exhaustive-deps`

**TypeScript 配置：**
- `tsconfig.json` 启用严格模式：`strict: true`
- 启用 `noUnusedLocals` 和 `noUnusedParameters` -- TypeScript 6.0
- 使用 `react-jsx` 转换，无需显式导入 React

## 导入组织

**顺序：**
1. React 核心导入（`react`、`react-dom`）
2. 自定义 hooks（`./hooks/useXxx`）
3. 类型导入（`../types` 或 `type { ... }` 语法的内联接口）
4. 数据导入（`../data/portfolio`）

**路径别名：**
- 未配置 Vite 路径别名（`vite.config.ts` 中无 `resolve.alias` 配置）
- 所有导入使用相对路径

## 组件模式

**默认导出：**
- 所有页面级组件使用 `export default`：`export default function App()`、`export default function HeroChat()`
- 所有内部辅助组件使用具名函数，不导出

**React.memo 使用：**
- 几乎所有组件使用 `memo()` 包裹进行性能优化
- 模式：`const Nav = memo(() => { ... })` 然后 `export default Nav`
- 或 `export default memo<Props>(({ list }) => { ... })`

**组件 Composing：**
- 主 `App.tsx` 渲染 `Nav`、`Hero`、`Projects`、`Models`、`Frameworks`、`Writing`、`Stack`、`Timeline`、`Footer`
- 每个 Section 组件包含内部辅助子组件：`ProjectCard`、`BlogItem`、`SkillCard`、`TimelineEvent`、`ModelCard`、`FrameworkCard`、`EvalCard`

**Props 类型：**
- 模式 1 — 内联接口：
```typescript
// Projects.tsx
interface Demo { id: string; title: string; ... }
interface Props { list: Demo[] }
```
- 模式 2 — 从 `types/index.ts` 导入：
```typescript
// Models.tsx
import type { Model } from '../types';
interface Props { list: Model[] }
```
- 模式 3 — 直接在子组件泛型中内联类型：
```typescript
// Projects.tsx
const ProjectCard = memo<{ demo: Demo; index: number }>(({ demo, index }) => { ... })
```

## Hooks 模式

**useInView 自定义 Hook：**
- 几乎所有 section 使用 `useInView` 实现滚动进入视口的发现动画
- 返回 `{ ref, v }`，其中 `v` 是布尔值表示是否在视口中
- 使用正向转换：`opacity: v ? 1 : 0`、`transform: v ? 'translateY(0)' : 'translateY(24px)'`
- 交错延迟使用 `index * 60ms` 或 `index * 90ms` 等模式
- 所有 section 使用 `ref as React.RefObject<HTMLElement>` type assertion（可能不安全但一致）

**其他 Hooks：**
- `useTheme`：管理暗/亮/系统主题，使用 `localStorage` 持久化（键名：`p2-theme`）
- `useTyping`：打字机效果，返回逐字显示的字符串

## 样式

**方法：**
- Tailwind CSS v4 + 自定义 CSS 变量（在 `index.css` 中定义）
- 自定义 CSS 类：`card-glow`、`border-glow`、`btn-glow`、`tag-cyber`、`section-label`、`terminal`、`text-gradient` 等
- 内联样式广泛使用 `style={{}}` 注入 CSS 变量引用，如 `style={{ fontFamily: 'var(--font-display)' }}`
- **不一致问题**：`index.css` 第 303-394 行包含额外重复的实用类（`btn-primary`、`btn-secondary`、`tag-chip`、`card-project`），这些是之前 Tailwind 版块的副本

**设计变量：**
- CSS 自定义属性以 `--` 开头：`--void`、`--cyan`、`--purple`、`--font-display` 等
- 赛博朋克/科幻风格主题，青色 + 紫色调色板

## 错误处理

**模式：**
- 最小化的错误处理
- `useTheme` 中的 `try/catch` 用于 `localStorage` 访问：
  ```typescript
  try { return (localStorage.getItem('p2-theme') as Theme) || 'dark'; } catch { return 'dark'; }
  ```
- 无全局错误边界
- `HeroChat.tsx` 中使用 `useRef` 进行清理的 `timerRef` 模式

## 无障碍

- Section 元素上使用 `aria-label` 和 `aria-labelledby`
- 导航区域使用 `aria-label="主导航"`
- 按钮使用 `aria-expanded`、`aria-pressed`
- 跳转链接提供：`<a href="#main" className="sr-only focus:not-sr-only ...">跳到内容</a>`
- 主题切换使用 `role="group"`
- 图标使用 `aria-hidden="true"`

## 已知问题

- `App.css` 文件存在但未在任何地方导入（Vite 默认模板遗留产物）
- `index.html` 中存在重复的 `</title></title>` 标签（`dist/index.html` 中同样存在）
- 缺少 ESLint 配置文件虽然 `eslint` 被列为依赖
- 编码风格不统一：有些文件末尾有分号（`Nav.tsx`、`Hero.tsx`），有些没有（`App.tsx`、`useTheme.ts`）
- `Nav.tsx` 使用 `// eslint-disable-next-line react-hooks/exhaustive-deps` 避免 `scrollTo` 回调的依赖警告

---

*约定分析：2026-04-25*
