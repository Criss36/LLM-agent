# 🤖 My LLM works

> 你好！我是一名专注于 **LLM 应用开发** 的工程师。这个仓库展示了我在中文大模型（RAG 系统、多 Agent 架构、模型微调、推理优化）领域的实战项目。
>
> 📂 **源代码**: 本仓库

---

## 🎯 关于我

- 🔭 专注于中文 LLM 应用、RAG 系统、多 Agent 协作、模型微调与推理优化
- 🏗️ 交付过 10+ 生产级 AI 项目
- 📖 持续沉淀 LLM 工程方法论
- 🧠 对标 [Awesome-Chinese-LLM](https://github.com/HqWu-HITCS/Awesome-Chinese-LLM)，深入研究中文大模型生态
- 💼 熟悉 ChatGLM、Qwen、Yi、DeepSeek 等主流中文底座模型

---

## 🚀 Demo 展示

### 🔍 知识图谱增强 RAG 系统 *(Live)*
不只做向量检索，还用知识图谱补全实体关系，解决"孤立答案缺少上下文"的问题。
- 技术栈: LangChain + Neo4j + BGE Embedding + HyDE + Cohere Rerank
- 在法律/医疗场景下，KG-RAG 比纯向量 RAG 完整率提升 35%

### 🤖 MCP 多 Agent 协作平台 *(Live)*
集成 MCP（Model Context Protocol）协议，让 Agent 能调用外部工具（浏览器、GitHub API、数据库）。
- 技术栈: LangGraph + MCP + CrewAI + FastAPI
- Supervisor 模式：研究员 / 工程师 / 审核员角色分工

### 🏛️ 中文 LLM 全栈微调平台 *(Live)*
基于 LLaMA-Factory 的中文模型微调平台，支持 ChatGLM/Qwen/Yi 等主流底座。
- 技术栈: LLaMA-Factory + DeepSpeed + LoRA/QLoRA
- 单卡 8GB 可训练 7B 模型，支持 100+ 开源模型

### 🏥 医疗领域 RAG 系统 *(Live)*
基于 HuatuoGPT/MedicalGPT 微调模型，结合医学知识图谱，支持多轮问诊。
- 技术栈: HuatuoGPT + LangChain + Neo4j
- 召回率 94%，专业度评分超 ChatGPT

### ⚖️ 法律领域 RAG 系统 *(Live)*
基于 LawGPT/ChatLaw 法律大模型，集成法律法规知识库、判例库。
- 技术栈: LawGPT + 向量检索 + LangChain
- 准确率 91%，覆盖民法、刑法、商法等领域

### 📊 LLM 评测系统 *(Live)*
覆盖 C-Eval / FlagEval / OpenCompass 三维指标 + G-Eval + LLM-as-Judge。
- 技术栈: C-Eval + DeepEval + RAGAS + GitHub Actions
- 每次 PR 自动跑回归，不达标不能合并

### ⚡ vLLM 生产推理优化 *(Live)*
PagedAttention + Continuous Batching + Tensor Parallelism，QPS 从 20 提升到 120。
- 技术栈: vLLM + PagedAttention + SLoRA
- P95 延迟从 800ms 压到 120ms

### 📝 结构化数据抽取 *(Live)*
非结构化文本 → 带 Schema 校验的 JSON/Pydantic 模型。
- 技术栈: Pydantic + JSON Mode + asyncio
- 精度 99.3%，自动重试机制

---

## 🛠 技术栈

| 领域 | 技术 |
|------|------|
| **中文底座模型** | ChatGLM / GLM-4, Qwen / Qwen2.5, Yi, DeepSeek, InternLM, Baichuan, MiniMax |
| **RAG 与检索** | LangChain / LangGraph, 知识图谱 RAG, Hybrid Search, BGE / Cohere Rerank, 向量数据库 |
| **Agent 与 MCP** | MCP 协议集成, CrewAI, LangGraph 状态机, Tool Calling |
| **模型训练与微调** | LLaMA-Factory, ChatGLM-Efficient-Tuning, LoRA / QLoRA / Full-tuning, DeepSpeed ZeRO |
| **推理部署** | vLLM / TGI, PagedAttention, Continuous Batching, Tensor Parallelism, SLoRA |
| **评测** | C-Eval / FlagEval / OpenCompass, RAGAS / DeepEval, G-Eval / LLM-as-Judge, LangSmith |
| **垂直领域** | HuatuoGPT / MedicalGPT（医疗）, LawGPT / ChatLaw（法律）, FinGPT（金融）, EduChat（教育） |
| **基础设施** | FastAPI, Docker, K8s, Redis, PostgreSQL, asyncio |
| **前端** | React + TypeScript + TailwindCSS |

---

## 📝 技术博客

| 文章 | 标签 | 日期 |
|------|------|------|
| [2026 中文 LLM 全景图：从底座模型到行业应用](./docs/chinese-llm-landscape.md) | 中文 LLM, ChatGLM, Qwen, 模型评测 | 2026-04-15 |
| [为什么纯向量 RAG 迟早会遇到天花板](./docs/kg-rag.md) | RAG, 知识图谱, Neo4j, RAGFlow | 2026-03-20 |
| [MCP 协议：让 Agent 真正连接外部世界](./docs/mcp-protocol.md) | MCP, Agent, 工具调用, LangGraph | 2026-03-05 |
| [跑了 500 组实验后，我总结的 LLM 评测方法论](./docs/llm-eval.md) | 评测, RAGAS, G-Eval, LLM-as-Judge | 2026-02-10 |
| [从"快思考"到"慢思考"：LLM 应用开发的思维转换](./docs/thinking-mode.md) | CoT, ReAct, Agent, 架构设计 | 2026-01-15 |

---

## 🏛️ 中文 LLM 模型生态

基于 [Awesome-Chinese-LLM](https://github.com/HqWu-HITCS/Awesome-Chinese-LLM) 整理：

### 主流底座模型

| 模型 | 厂商 | 参数量 | 上下文 | 可商用 |
|------|------|--------|--------|--------|
| ChatGLM | 清华 | 6B/12B | 32K | ✅ |
| GLM-4 | 清华 | 9B/128B | 128K | ✅ |
| Qwen2.5 | 阿里 | 7B-72B | 128K | ✅ |
| Yi | 零一万物 | 6B/34B | 200K | ✅ |
| DeepSeek-V2 | 深度求索 | 236B | 128K | ✅ |
| InternLM2 | 上海 AI Lab | 7B/20B | 200K | ✅ |
| Baichuan2 | 百川 | 7B/13B | 128K | ✅ |
| MiniMax-Text-01 | MiniMax | 456B | 1M | ✅ |

### 垂直领域模型

| 领域 | 模型 | 说明 |
|------|------|------|
| 🏥 医疗 | HuatuoGPT, MedicalGPT, BianQue, Taiyi-LLM | 中医、西医、心理健康 |
| ⚖️ 法律 | LawGPT, ChatLaw, LexiLaw, DISC-LawLLM | 合同审查、诉讼预测 |
| 💰 金融 | 轩辕, FinGPT, DISC-FinLLM, Tongyi-Finance | 金融分析、风控 |
| 📚 教育 | EduChat, QiaoBan, Taoli | 数学辅导、情感陪伴 |

### 微调框架

| 框架 | 说明 |
|------|------|
| LLaMA-Factory | 支持 100+ 模型的微调框架 |
| ChatGLM-Efficient-Tuning | ChatGLM 专用微调工具 |
| bert4torch | 大模型训练和部署框架 |

### 推理框架

| 框架 | 说明 |
|------|------|
| vLLM | PagedAttention 高吞吐推理 |
| LMDeploy | InternLM 推理优化 |
| text-generation-inference | HuggingFace 推理服务 |
| fastllm | 纯 C++ 全平台加速 |

### 评测基准

| 基准 | 说明 |
|------|------|
| C-Eval | 52 学科，13948 道题 |
| FlagEval | 多维度能力评测 |
| OpenCompass | 一站式评测平台 |
| SuperCLUE | 中文通用对话评测 |
| GAOKAO-Bench | 中国高考题目 |

---

## 📈 成长时间线

```
2024.Q1  从零构建首个 RAG 问答机器人
2024.Q2  引入知识图谱，KG-RAG 完整率提升 35%
2024.Q3  CrewAI 多 Agent 上线，接入 MCP 协议
2024.Q4  C-Eval / RAGAS 评测体系落地，召回率 91%
2025.Q1  基于 ChatGLM/Qwen 构建中文 LLM 微调平台
2025.Q2  vLLM 部署，QPS 从 20 提升到 120
2025.Q3  医疗/法律垂直领域 RAG 落地，覆盖 10+ 场景
2025.Q4  GitHub Actions 评测流水线，PR 自动回归
```

---

## 🐍 LLM 实战项目代码

本仓库整合了多个优秀的开源大模型项目代码，便于学习和实战：

### 📦 llm_projects/

| 项目 | 来源 | 说明 |
|------|------|------|
| **Chinese-LLaMA-Alpaca-3** | [ymcui/Chinese-LLaMA-Alpaca-3](https://github.com/ymcui/Chinese-LLaMA-Alpaca-3) | 中文LLaMA-3预训练/微调/推理/评测全流程代码 |
| **llm-action-notes** | [liguodongiot/llm-action](https://github.com/liguodongiot/llm-action) | 大模型训练/推理/压缩/评测实战教程笔记 |

#### Chinese-LLaMA-Alpaca-3 核心功能

- **训练**: LoRA/QLoRA微调，支持预训练和指令精调
- **推理**: HuggingFace/vLLM推理，支持Flash Attention
- **评测**: C-Eval/CMMLU/MMLU/LongBench评测
- **合并**: LoRA权重合并脚本

```bash
# 查看项目详情
cd llm_projects/Chinese-LLaMA-Alpaca-3
cat README.md
```

---

## 👋 联系我

- **GitHub**: [Criss36](https://github.com/Criss36)
- **邮箱**: 1773077198@qq.com
- **求职状态**: 🔍 开放 LLM 应用开发 / AI 工程相关机会

---
