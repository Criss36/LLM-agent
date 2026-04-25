# LLM应用工程师个人主页

## 这是什么

Criss36 的个人作品集网站，展示 LLM（大语言模型）全栈工程能力。React + TypeScript + Tailwind CSS 4 构建的科幻风格交互式简历，包含项目展示、技能树、时间线、技术博客和交互式 Demo（RAG/Agent/评测）。部署于 Vite 构建管线。

## 核心价值

访客能直观感受到 Criss36 的 LLM 工程深度 —— 代码质量、设计品味、技术广度三者兼备。

## 需求

### 已验证（现有功能）

- ✓ 响应式导航栏（吸顶 + 背景透明度动画）— 现有
- ✓ 英雄区（打字机效果标题 + 粒子背景）— 现有
- ✓ 项目展示网格带悬停效果 — 现有
- ✓ 模型列表展示 — 现有
- ✓ 框架/工具链网格 — 现有
- ✓ 时间线组件（滚动触发出场动画）— 现有
- ✓ 技术博客文章列表 — 现有
- ✓ 页脚 — 现有
- ✓ 交互式 RAG/Agent/评测 Demo 面板 — 现有
- ✓ 暗色科幻主题设计系统（CSS 变量、发光效果）— 现有
- ✓ 4 篇技术深度文档（kg-rag/mcp-protocol/llm-eval/thinking-mode）— 现有
- ✓ GitHub 仓库集成（LLM-agent / Chinese-LLaMA-Alpaca-3 / RAG-Anything / llm-action）— 现有

### 进行中

- [ ] **PERF-01**: 修复 `HeroChat.tsx` `setTimeout` 内存泄漏（未挂载时清理定时器）
- [ ] **PERF-02**: 修复 `useInView` 不支持重复触发的问题（替换为新增 `once` 参数）
- [ ] **STYLE-01**: 删除 `index.css` 重复的 `:focus-visible` 规则
- [ ] **CONTENT-01**: 补充 docs/ 缺失的技术文档（已有: kg-rag, mcp-protocol, llm-eval, thinking-mode）
- [ ] **CONTENT-02**: 更新 portfolio.ts 数据源（项目经历、技能清单、博客文章）
- [ ] **A11Y-01**: 添加 aria-label、键盘导航支持、Focus 管理
- [ ] **PERF-03**: 图片懒加载、字体子集化、Tree-shaking 优化
- [ ] **TEST-01**: 建立基础测试框架（Vitest + Playwright）
- [ ] **CI-01**: GitHub Actions 自动构建 + 部署

### 超出范围

- 添加后端服务或数据库 — 纯静态站点，无后端需求
- 多语言国际化（i18n）— 以中文内容为主
- LLM-action 知识库内容维护 — 那是独立的上游镜像

## 背景

项目起源于 4 个独立 LLM 相关仓库的整合需求，最终统一为个人作品集站点。站点的技术深度文档覆盖 KG-RAG、MCP 协议、LLM 评测方法论、推理模式设计。

## 约束

- **技术栈**: React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 — 已锁定，无迁移计划
- **部署**: 静态站点（GitHub Pages 或类似服务）
- **浏览器**: 现代浏览器（Chrome/Firefox/Safari 最近 2 个主版本）
- **内容**: 中文为主要展示语言

## 关键决策

| 决策 | 理由 | 结果 |
|----------|-----------|---------|
| React 19 + Vite 8 | 最新生态，性能优异 | ✓ 有效 |
| Tailwind CSS 4 | CSS 变量 + 原子化样式，一致性高 | ✓ 有效 |
| 无状态管理库 | 纯展示站点，props 够用 | — 待评估 |
| 科幻暗色主题 | LLM/AI 领域常见视觉风格 | ✓ 有效 |
| 4 个独立 GitHub 仓库 | 子项目有独立价值，LLM-agent 为聚合页 | ✓ 有效 |

---
*最后更新: 2026-04-25 初始化*
