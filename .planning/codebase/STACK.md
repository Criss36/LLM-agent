# Technology Stack

**Analysis Date:** 2026-04-25

## Languages

**Primary:**
- TypeScript ~6.0.2 - 所有源代码使用 TypeScript，类型检查由 `tsc -b` 负责
- CSS3 + Tailwind CSS 4 自定义属性 - 样式系统

**Secondary:**
- HTML5 - `index.html` 为入口点（`lang="zh-CN"`）

## Runtime

**Environment:**
- Node.js (运行 Vite 构建工具所需)
- 浏览器端运行时（Chrome/Firefox/Safari 最近 2 个主版本）

**Package Manager:**
- npm (Node 内置)
- Lockfile: `package-lock.json`（标准 npm 锁定文件）

## Frameworks

**Core:**
- React ^19.2.5 - UI 组件库，用于构建组件化界面
- React DOM ^19.2.5 - DOM 渲染入口

**Build:**
- Vite ^8.0.10 - 开发服务器和生产构建
- @vitejs/plugin-react ^6.0.1 - Vite React 插件（HMR + Babel 编译）

**Styling:**
- Tailwind CSS ^4.2.4 - 原子化 CSS 框架（CSS 变量 + 实用类）
- @tailwindcss/vite ^4.2.4 - Tailwind CSS 4 Vite 插件（零配置集成）

**Linting:**
- ESLint ^10.2.1 - 代码质量检查
- @eslint/js ^10.0.1 - ESLint 核心 JS 配置
- typescript-eslint ^8.58.2 - TypeScript ESLint 支持
- eslint-plugin-react-hooks ^7.1.1 - React Hooks 规则检查
- eslint-plugin-react-refresh ^0.5.2 - React Fast Refresh 规则检查
- globals ^17.5.0 - ESLint 全局变量定义

## Key Dependencies

**Critical:**
- React 19 - 组件化 UI 架构，使用 `memo` 进行性能优化，`useState`/`useEffect`/`useRef`/`useCallback` 管理状态和副作用
- TypeScript 6 - 全量类型定义在 `src/types/index.ts`，使用 `interface` 定义所有数据模型
- Vite 8 - 零配置启动，`tsc -b && vite build` 生产构建流程
- Tailwind CSS 4 - 通过 `@tailwindcss/vite` 插件集成，`@import` 加载 Google Fonts

**Infrastructure:**
- @types/react ^19.2.14 - React 类型定义
- @types/react-dom ^19.2.3 - React DOM 类型定义
- @types/node ^24.12.2 - Node 类型定义（Vite 配置所需）

## Configuration

**Build:**
- `vite.config.ts` (`D:\桌面\项目集合\LLM-agent\vite.config.ts`) - Vite 构建配置，注册 `react()` 和 `tailwindcss()` 两个插件，无额外自定义
- `tsconfig.json` (`D:\桌面\项目集合\LLM-agent\tsconfig.json`) - TypeScript 配置（target ES2020, lib ES2020+DOM+DOM.Iterable, module ESNext, moduleResolution bundler, strict 模式, react-jsx, noEmit）

**Linting:**
- ESLint 配置：在 `package.json` 中引用 `eslint` 命令，配置文件不存在独立文件（`eslint.config.js` 未找到），可能使用默认规则集或 Vite 模板预设规则

**Environment:**
- 无 `.env` 文件 - 纯静态站点，无环境变量需求
- 所有配置硬编码在源代码中（标题、主题、内容数据）

## 类型系统

**自定义类型**（`src/types/index.ts`）：
- `Message` - 聊天消息类型（id, role, content, timestamp）
- `Demo` - 项目展示类型（id, title, titleEn, description, tags, code?, status）
- `BlogPost` - 博客文章类型（id, title, excerpt, date, tags, readTime）
- `Skill` - 技能分类类型（category, items[]）
- `TimelineEvent` - 时间线事件类型（period, event）
- `Model` - LLM 模型类型（name, provider, params, context, commercial）
- `Framework` - 框架类型（name, type, description）
- `Evaluation` - 评估标准类型（name, scope）

**TypeScript 严格模式：**
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `skipLibCheck: true`

## 构建流程

```bash
npm run dev      # vite             → 开发服务器 (HMR)
npm run build    # tsc -b && vite build → 生产构建 (tsc 类型检查 + vite 打包)
npm run preview  # vite preview      → 预览生产构建
npm run lint     # eslint .          → 代码质量检查
```

## 项目结构摘要

```
llm-career-portfolio/
├── index.html         # HTML 入口点
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
├── package.json       # 依赖和脚本
├── src/
│   ├── main.tsx       # React 渲染入口
│   ├── App.tsx        # 根组件（布局编排）
│   ├── index.css      # 全局样式 + 设计 Token
│   ├── types/index.ts # 所有类型定义
│   ├── data/
│   │   └── portfolio.ts  # 静态数据源
│   └── components/
│       ├── *.tsx        # 页面组件
│       └── hooks/       # 自定义 Hooks
└── dist/              # 构建产出
```

---

*Stack analysis: 2026-04-25*
