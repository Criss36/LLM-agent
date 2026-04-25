---
wave: 1
name: 内容完善与数据更新
requirements: [CONTENT-01, CONTENT-02]
files_modified:
  - docs/kg-rag.md
  - docs/llm-eval.md
  - docs/mcp-protocol.md
  - docs/thinking-mode.md
  - src/data/portfolio.ts
  - index.html
autonomous: true
---

## Goal

完成站点内容完善与数据更新：扩展 4 篇短文档为完整的深度技术文章，审计并更新 portfolio.ts 数据源，补充 index.html 缺失的 SEO 元标签。

## Tasks

### Task 1: 扩展 4 篇短技术文档为完整深度文章

**Files:**
- docs/kg-rag.md
- docs/llm-eval.md
- docs/mcp-protocol.md
- docs/thinking-mode.md

<read_first>
- docs/kg-rag.md (当前 24 行 — 简短占位符)
- docs/llm-eval.md (当前 21 行 — 简短占位符)
- docs/mcp-protocol.md (当前 17 行 — 简短占位符)
- docs/thinking-mode.md (当前 19 行 — 简短占位符)
- docs/rag-deep-dive.md (参考：已完成的 RAG 深度文章风格标准)
- docs/chinese-llm-landscape.md (参考：已完成的 LLM 全景图文章风格标准)
</read_first>

<action>
将以下 4 篇文章从简短占位符扩展为完整的技术深度文章，每篇 2000-5000 字（约 80-200 行），参考 rag-deep-dive.md 和 chinese-llm-landscape.md 的内容深度和结构风格。

**每篇文章必须包含的结构：**
1. 标题（保留原标题）
2. 引言 — 用实际工程经历引出问题
3. 核心分析 — 3-5 个小节，每节有清晰小标题
4. 代码示例 — 至少 1 个代码块（Python 伪代码，用 ``` 包裹），不可用纯文字描述替代
5. 踩坑经验 — 至少 1 个"踩过的坑"段落，包含具体指标/数据（参考 rag-deep-dive.md 的坑 1/2/3 风格）
6. 对比表格 — 至少 1 个 Markdown 表格展示对比数据
7. 实践建议 — 基于真实经验的 actionable 建议
8. 总结 — 核心 takeaway

**各文章具体扩展方向：**

**1. docs/kg-rag.md — "为什么纯向量 RAG 迟早会遇到天花板"**
当前：24 行。扩展方向：
- 纯向量 RAG 的 3 个具体失败案例场景分析（实体关系缺失、多跳推理、孤立答案）
- 知识图谱构建完整流程：实体抽取 → 关系抽取 → 图谱存储（Neo4j/Cypher）
- 混合检索（向量 + 图谱路径）的 Python 代码实现
- 图谱增强上下文的量化效果对比
- 与 RAGFlow / GraphRAG / LightRAG 等主流方案对比

**2. docs/llm-eval.md — "跑了 500 组实验后，我总结的 LLM 评测方法论"**
当前：21 行。扩展方向：
- Context Precision / Recall / Faithfulness / Relevance 四个指标的计算逻辑和判断标准
- RAGAS 框架使用教程和配置示例
- G-Eval Prompt 模板设计
- LLM-as-Judge 的偏袒问题（Positional Bias、Verbosity Bias）与缓解策略
- 阈值设定的经验法则
- CI/CD 集成 GitHub Actions 的 YAML 示例

**3. docs/mcp-protocol.md — "MCP 协议：让 Agent 真正连接外部世界"**
当前：17 行。扩展方向：
- MCP 协议工作流详解：Client → Server → Tool 调用链路
- 在 LangGraph 中集成 MCP 的完整代码示例
- 安全沙箱机制（权限控制 + 资源隔离）
- MCP vs Function Calling vs Tool Use 深度对比（不仅是表格）
- 生产环境部署 MCP Server 的注意事项
- 实际项目中使用 MCP 前后的效果数据

**4. docs/thinking-mode.md — "从快思考到慢思考：LLM 应用开发的思维转换"**
当前：19 行。扩展方向：
- Chain-of-Thought Prompt 模板设计与效果对比
- ReAct 循环的 Python 实现（思考→行动→观察）
- Tree-of-Thoughts BFS/DFS 搜索策略代码
- 不同任务类型选择推理模式的决策流程
- 延迟与准确性权衡的实际案例数据
- 与 o1 / DeepSeek-R1 等推理模型的比较
</action>

<acceptance_criteria>
- docs/kg-rag.md >= 80 行，包含代码块（```）和 Markdown 表格（|）
- docs/llm-eval.md >= 80 行，包含代码块和 Markdown 表格
- docs/mcp-protocol.md >= 80 行，包含代码块和 Markdown 表格
- docs/thinking-mode.md >= 80 行，包含代码块和 Markdown 表格
- 每篇文章 >= 2000 字节
- 内容中无"TODO"、"待扩展"、"placeholder"等占位符标记
</acceptance_criteria>

---

### Task 2: 审计并更新 portfolio.ts 数据源

**Files:** src/data/portfolio.ts

<read_first>
- src/data/portfolio.ts (当前 240 行)
- src/types/index.ts (数据类型定义)
- docs/kg-rag.md (Task 1 扩展后)
- docs/llm-eval.md (Task 1 扩展后)
- docs/mcp-protocol.md (Task 1 扩展后)
- docs/thinking-mode.md (Task 1 扩展后)
</read_first>

<action>
审计并更新 portfolio.ts 的全部 7 个导出数组，修复数据不一致问题。

**1. blogPosts[] — 修复 ID 不匹配和阅读时长**
- 将 blogPosts[3].id 从 `"llm-eval-practice"` 改为 `"llm-eval"`，与 docs/llm-eval.md 文件名一致。当前 "llm-eval-practice" 没有对应文档文件，会导致博客链接指向不存在的页面（404）
- 根据 Task 1 扩展后的文章实际长度，更新对应的 readTime 字段，使阅读时长与内容量匹配
- 更新 blogPosts[0].date 为 `"2026-04-25"`（最新更新日期）

**2. demos[] — 补充缺失的 code 字段**
为以下缺少 code 的 Demo 添加 6-15 行真实可用的 Python 代码块（用模板字符串 ``包裹，风格参考已有 code 字段）：
- `llm-eval-suite` — 添加 RAGAS + DeepEval 评测管线代码
- `structured-json` — 添加 Pydantic Validation + JSON Mode 提取代码
- `vllm-production` — 添加 vLLM PagedAttention 配置代码
- `medical-rag` — 添加 HuatuoGPT + 医学知识图谱问诊代码
- `legal-rag` — 添加法律条文检索 + 判决预测代码

**3. skills[] — 审查补充**
补充新的技能类别或项目（如 Docker/K8s 等），不删除已有项目，保持分类清晰。

**4. models[] — 审查补充**
如需要，补充 DeepSeek-V3 等近期重要模型，保持格式一致。

**5. frameworks[] + evaluations[] — 审查补充**
根据需要补充新工具或评测基准。
</action>

<acceptance_criteria>
- blogPosts 中无 `id: "llm-eval-practice"` 遗留（已改为 `"llm-eval"`）
- blogPosts 包含 id 值：`kg-rag`、`llm-eval`、`mcp-protocol`、`thinking-mode`、`chinese-llm-landscape`
- 至少 6 个 demo 包含 code 字段（grep -c "code: \`" src/data/portfolio.ts >= 6）
- npm run build 通过，无 TypeScript 编译错误
- npm run lint 通过
</acceptance_criteria>

---

### Task 3: 补充 index.html 缺失的 SEO 元标签

**Files:** index.html

<read_first>
- index.html (当前 13 行)
- .planning/codebase/CONCERNS.md (HTML and SEO Issues 章节)
</read_first>

<action>
修复 index.html 中的 HTML 和 SEO 问题：

**1. 修复重复 `</title>` 标签**
- 当前行 7: `<title>LLM 应用工程师 | Criss36 Portfolio</title></title>`
- 改为: `<title>LLM 应用工程师 | Criss36 Portfolio</title>`

**2. 添加 meta description**
```
<meta name="description" content="Criss36 的 LLM 应用工程师个人作品集。展示 RAG 系统、知识图谱、MCP 协议、LLM 微调与评测等全栈 AI 工程能力。包含交互式 Demo 和深度技术博客。" />
```

**3. 添加 Open Graph 标签**
```
<meta property="og:title" content="LLM 应用工程师 | Criss36 Portfolio" />
<meta property="og:description" content="Criss36 的 LLM 应用工程师个人作品集 — RAG / 知识图谱 / MCP / LLM 微调与评测" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://criss36.github.io/LLM-agent/" />
<meta property="og:image" content="https://criss36.github.io/LLM-agent/og-image.png" />
<meta property="og:locale" content="zh_CN" />
```

**4. 添加 Twitter Card 标签**
```
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="LLM 应用工程师 | Criss36 Portfolio" />
<meta name="twitter:description" content="Criss36 的 LLM 应用工程师个人作品集 — RAG / 知识图谱 / MCP / LLM 微调与评测" />
```

**5. 可选补充：keywords 和 canonical**
```
<meta name="keywords" content="LLM, RAG, 知识图谱, MCP, Agent, 大语言模型, AI 工程" />
<link rel="canonical" href="https://criss36.github.io/LLM-agent/" />
```

标签在 `<head>` 中按语义分组排列：charset → viewport → description → OG 组 → Twitter 组 → title → canonical。每个标签独占一行，合理缩进。
</action>

<acceptance_criteria>
- index.html 中 `</title>` 仅出现一次（非重复）
- 包含 `<meta name="description" content="...">` 且 content 长度在 20-200 字之间
- 包含 `og:title`、`og:description`、`og:type`、`og:url`、`og:image` 五个 OG 标签
- 包含 `twitter:card`、`twitter:title`、`twitter:description` 三个 Twitter Card 标签
- npm run build 通过
</acceptance_criteria>

## Verification

1. `npm run build` 通过
2. `npm run lint` 通过
3. 运行验证检查:
   ```bash
   for f in docs/kg-rag.md docs/llm-eval.md docs/mcp-protocol.md docs/thinking-mode.md; do
     lines=$(wc -l < "$f")
     bytes=$(wc -c < "$f")
     has_code=$(grep -cq '```' "$f" && echo "yes" || echo "no")
     has_table=$(grep -cq '|' "$f" && echo "yes" || echo "no")
     echo "$f: ${lines}lines ${bytes}bytes code=${has_code} table=${has_table}"
   done
   code_count=$(grep -c 'code: `' src/data/portfolio.ts || true)
   echo "Demos with code: $code_count"
   og_count=$(grep -c 'og:' index.html || true)
   echo "OG tags: $og_count"
   ```
4. 确认无 "llm-eval-practice" 字符串残留

## Success Criteria

1. 4 篇 docs 文件每篇 >= 80 行，包含代码块和表格，无占位符内容
2. blogPosts 所有 id 与 docs/ 文件名一致
3. 至少 6 个 demo 包含 code 代码示例
4. index.html 包含完整的 meta description + OG + Twitter Card 标签
5. npm run build 和 npm run lint 均通过
