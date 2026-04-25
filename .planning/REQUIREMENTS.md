# 需求定义

## v1 需求

### 性能优化
- [ ] **PERF-01**: `HeroChat.tsx` 组件卸载时清理 `setTimeout`，消除内存泄漏
- [ ] **PERF-02**: `useInView` hook 支持重复触发（新增 `once` 参数，默认 true 保持向后兼容）
- [ ] **PERF-03**: 图片懒加载、字体子集化、Tree-shaking 优化

### 样式清理
- [ ] **STYLE-01**: 删除 `index.css` 中重复的 `:focus-visible` 规则

### 内容完善
- [ ] **CONTENT-01**: 补充 docs/ 缺失的技术文档
- [ ] **CONTENT-02**: 更新 `portfolio.ts` 数据源（项目经历、技能清单、博客文章）

### 无障碍
- [ ] **A11Y-01**: 添加 aria-label、键盘导航支持、Focus 管理

### 测试
- [ ] **TEST-01**: 建立基础测试框架（Vitest + Playwright），核心组件快照测试

### CI/CD
- [ ] **CI-01**: GitHub Actions 自动构建 + 部署到 GitHub Pages

## v2 需求（推迟）

- 交互式 Demo 增强（多轮对话、真实 API 接入）
- 暗色/亮色主题切换完善
- 页面过渡动画（View Transition API）

## 超出范围

- 后端服务或数据库 — 纯静态站点
- 多语言国际化（i18n）
- LLM-action 知识库内容维护

## 可追溯性

| 阶段 | 需求 |
|------|------|
| 阶段 1: 高 ROI 缺陷修复与样式清理 | PERF-01, PERF-02, STYLE-01 |
| 阶段 2: 内容完善与数据更新 | CONTENT-01, CONTENT-02 |
| 阶段 3: 无障碍与性能优化 | A11Y-01, PERF-03 |
| 阶段 4: 测试基础设施 | TEST-01 |
| 阶段 5: CI/CD 流水线 | CI-01 |
