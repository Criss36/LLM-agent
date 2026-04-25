# External Integrations

**Analysis Date:** 2026-04-25

## 运行时外部服务

**本项目是一个纯静态前端作品集站点，无任何运行时后端集成。**

- 未调用任何第三方 API 服务
- 无后端服务器、无数据库依赖
- 无身份验证系统
- 无分析/监控工具集成
- 无错误追踪服务（Sentry 等）

## 字体加载（唯一运行时外部依赖）

**Google Fonts** — 通过 `src/index.css` 第 5 行的 CSS `@import` 加载：

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
```

| 字体 | 字重 | 用途 |
|------|------|------|
| Space Mono | 400/700/italic | 代码块、终端 UI、标签（`src/index.css` 中 `.mono`, `.tag-cyber`, `.terminal` 等类） |
| Inter | 300/400/500/600 | 正文文本 |
| Syne | 600/700/800 | 标题和展示型文本（h1-h4） |

**注意：** 未做字体子集化优化。这是项目启动时的阻塞网络请求。已在 `REQUIREMENTS.md` 的 **PERF-03** 中标记为待优化项。

## 外部链接（硬编码）

**GitHub 个人主页链接**（`src/components/Nav.tsx` 第 113 行）：
```tsx
<a href="https://github.com/Criss36" target="_blank" rel="noopener noreferrer">
```
- 使用 `target="_blank"` + `rel="noopener noreferrer"`（安全最佳实践）
- 内联 GitHub SVG 图标，无外部图标库依赖

## 数据存储

**Databases:**
- 无数据库依赖
- 所有数据静态定义在 `src/data/portfolio.ts` 中：
  - `demos` - 8 个项目展示（RAG 知识图谱、MCP 多 Agent、中文微调平台等）
  - `blogPosts` - 5 篇技术博客
  - `skills` - 8 个技能分类
  - `timeline` - 8 个时间线事件
  - `models` - 8 个 LLM 模型
  - `frameworks` - 6 个框架
  - `evaluations` - 6 个评估标准

**File Storage:**
- 本地静态资源：`src/assets/` 目录下的图片（`hero.png`, `react.svg`, `vite.svg`）
- 根目录图标：`favicon.svg`, `icons.svg`

## CI/CD & 部署

**当前状态：**
- 无 CI 流水线配置（无 `.github/` 目录）
- `dist/` 构建产出存在，包含 `index.html`, `favicon.svg`, `icons.svg`, `assets/` 子目录

**待实施**（来自 `REQUIREMENTS.md` 的 **CI-01**）：
- GitHub Actions 自动构建 + 部署到 GitHub Pages
- 这是项目路线图中最高优先级的缺失功能

**部署目标：**
- GitHub Pages 或类似静态托管服务（在 `PROJECT.md` 约束中指定）
- 纯静态文件部署，无服务器端运行时需求

## 环境变量 & 密钥

- **无环境变量文件**（无 `.env` 文件）
- **无 API 密钥或密钥**需管理
- 纯静态站点，所有配置硬编码在源代码中

## 技术栈内容引用（非集成）

项目描述中引用的技术和工具是开发者的项目经验内容（`src/data/portfolio.ts`），**并非本网站集成的外部服务**：

| 技术领域 | 引用的技术 |
|---------|-----------|
| RAG 检索 | LangChain/LangGraph, Neo4j, Milvus, Chroma, BGE Embedding, Cohere Rerank, HyDE |
| Agent 编排 | MCP 协议, CrewAI, LangGraph 状态机, Supervisor 模式 |
| 模型微调 | LLaMA-Factory, ChatGLM-Efficient-Tuning, LoRA/QLoRA, DeepSpeed ZeRO |
| 推理部署 | vLLM, TGI, PagedAttention, Continuous Batching, SLoRA |
| LLM 评测 | C-Eval, FlagEval, OpenCompass, RAGAS, DeepEval, G-Eval, LLM-as-Judge |
| 垂直领域 | HuatuoGPT（医疗）, LawGPT/ChatLaw（法律）, FinGPT（金融）, EduChat（教育） |
| 中文底座模型 | ChatGLM/GLM-4, Qwen/Qwen2.5, Yi, DeepSeek, InternLM, Baichuan, MiniMax |
| 工程基础设施 | FastAPI, Docker, Redis, PostgreSQL, Pydantic, asyncio |

---

## 集成架构图

```
┌─────────────────────────────────────────────────────┐
│                   浏览器 (客户端)                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │         LLM-agent 作品集（静态站点）            │    │
│  │                                               │    │
│  │  ┌──────┐ ┌────────┐ ┌──────┐ ┌─────────┐    │    │
│  │  │ Nav  │ │ Hero   │ │ Proj │ │ Models  │    │    │
│  │  └──────┘ └────────┘ └──────┘ └─────────┘    │    │
│  │  ┌────────┐ ┌───────┐ ┌────────┐ ┌──────┐   │    │
│  │  │Framewrk│ │Writing│ │ Stack  │ │Timeln│   │    │
│  │  └────────┘ └───────┘ └────────┘ └──────┘   │    │
│  │                                               │    │
│  │  数据源: src/data/portfolio.ts（静态）         │    │
│  └──────────────┬──────────────────────────────┘    │
│                 │                                    │
│  ┌──────────────▼──────────────────────────────┐    │
│  │        外部 HTTP 请求（唯一下游）             │    │
│  │                                               │    │
│  │  Google Fonts API                             │    │
│  │  (Space Mono + Inter + Syne)                 │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  GitHub 链接 (target="_blank" 新窗口)                │
└─────────────────────────────────────────────────────┘
```

---

*Integration audit: 2026-04-25*
