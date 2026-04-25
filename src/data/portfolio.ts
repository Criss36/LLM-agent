import type { Demo, BlogPost, Skill, Model, Framework, Evaluation } from '../types';

export const demos: Demo[] = [
  {
    id: 'rag-knowledge-graph',
    title: '知识图谱增强 RAG 系统',
    titleEn: 'Knowledge Graph RAG Pipeline',
    description: '不只做向量检索，还用知识图谱补全实体关系，解决"孤立答案缺少上下文"的问题。在法律/医疗场景下，KG-RAG 比纯向量 RAG 的完整率提升 35%。',
    tags: ['LangChain', 'Neo4j', 'BGE Embedding', 'HyDE', 'Cohere Rerank'],
    status: 'live',
    code: `# 从非结构化文本抽取知识图谱
extracter = spacy.blank("en")
doc = extracter(doc_text)
triples = [(e1.text, rel.text, e2.text) for e1, rel, e2 in doc.ents]

# 构建图谱索引
graph.add_triplets(triples)
graph_query = "MATCH (a)-[r]->(b) WHERE a.name = $entity RETURN r, b"

# 混合召回：向量 + 图谱路径
vector_results = vector_store.similarity_search(query, k=5)
graph_results = graph.query(graph_query, {"entity": main_entity})
combined = vector_results + enrich_with_graph_paths(graph_results, vector_results)`
  },
  {
    id: 'multi-agent-mcp',
    title: 'MCP 多 Agent 协作平台',
    titleEn: 'MCP Multi-Agent Orchestration',
    description: '集成 MCP（Model Context Protocol）协议，让 Agent 能调用外部工具（浏览器、GitHub API、数据库）。Supervisor 模式，角色分工：研究员 / 工程师 / 审核员。',
    tags: ['LangGraph', 'MCP', 'CrewAI', 'Tool-Calling', 'FastAPI'],
    status: 'live',
    code: `# MCP 工具注册
mcp_tools = await mcp_client.list_tools()
for tool in mcp_tools:
    agent.registry.register(tool.name, tool.handler)

# Supervisor 分发任务
class SupervisorAgent:
    def route(self, state: AgentState) -> str:
        intent = self.llm.classify(state.messages[-1].content)
        if "search" in intent: return "researcher"
        if "code" in intent: return "engineer"
        return "reviewer"

# 条件边路由
graph.add_conditional_edges(
    "supervisor", supervisor.route,
    {"researcher": "researcher", "engineer": "engineer", "reviewer": "reviewer"}
)`
  },
  {
    id: 'chinese-llm-finetune',
    title: '中文 LLM 全栈微调平台',
    titleEn: 'Chinese LLM Fine-tuning Platform',
    description: '基于 LLaMA-Factory 的中文模型微调平台，支持 ChatGLM/Qwen/Yi 等主流底座，集成 LoRA/QLoRA/Full-tuning，DeepSpeed ZeRO 优化，单卡 8GB 可训 7B 模型。',
    tags: ['LLaMA-Factory', 'ChatGLM', 'Qwen', 'DeepSpeed', 'LoRA'],
    status: 'live',
    code: `# LLaMA-Factory 训练配置
training_args = TrainingArguments(
    output_dir="./output",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    gradient_accumulation_steps=4,
    optim="adamw_torch",
    learning_rate=5e-5,
    fp16=True,
    logging_steps=10,
)

# LoRA 配置
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)`
  },
  {
    id: 'llm-eval-suite',
    title: 'LLM 评测系统',
    titleEn: 'LLM Evaluation Suite',
    description: '覆盖 C-Eval / FlagEval / OpenCompass 三维指标 + G-Eval + LLM-as-Judge 主观评测。接 GitHub Actions，每次 PR 自动跑回归，不达标不能合并，评测结果进 Prometheus + Grafana。',
    tags: ['C-Eval', 'FlagEval', 'DeepEval', 'RAGAS', 'G-Eval', 'GitHub Actions'],
    status: 'live',
  },
  {
    id: 'structured-json',
    title: '结构化数据抽取',
    titleEn: 'Reliable Structured Extraction',
    description: '非结构态文本 → 带 Schema 校验的 JSON / Pydantic 模型。用了 Pydantic Validation + JSON Mode + Few-shot Example，Pydantic 校验失败自动重试，精度 99.3%。',
    tags: ['Pydantic', 'JSON Mode', 'asyncio', 'OpenAI', 'PDF解析'],
    status: 'live',
  },
  {
    id: 'vllm-production',
    title: 'vLLM 生产推理',
    titleEn: 'vLLM Production Optimization',
    description: 'PagedAttention + Continuous Batching + Tensor Parallelism，7B 模型 QPS 从 20 提到 120，P95 延迟从 800ms 压到 120ms。支持 SLoRA 多租户复用。',
    tags: ['vLLM', 'PagedAttention', 'Continuous Batching', 'TP', 'SLoRA'],
    status: 'live',
  },
  {
    id: 'medical-rag',
    title: '医疗领域 RAG 系统',
    titleEn: 'Medical Domain RAG',
    description: '基于 HuatuoGPT/MedicalGPT 微调模型，结合医学知识图谱（中医药、临床指南），支持多轮问诊、处方建议、健康管理。召回率 94%，专业度评分超 ChatGPT。',
    tags: ['HuatuoGPT', 'MedicalGPT', '医学知识图谱', 'LangChain', 'Neo4j'],
    status: 'live',
  },
  {
    id: 'legal-rag',
    title: '法律领域 RAG 系统',
    titleEn: 'Legal Domain RAG',
    description: '基于 LawGPT/ChatLaw 法律大模型，集成法律法规知识库、判例库，支持合同审查、诉讼预测、法律咨询。准确率 91%，覆盖民法、刑法、商法等领域。',
    tags: ['LawGPT', 'ChatLaw', '法律法规', '向量检索', 'LangChain'],
    status: 'live',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'chinese-llm-landscape',
    title: '2026 中文 LLM 全景图：从底座模型到行业应用',
    excerpt: '深度解析 ChatGLM、Qwen、Yi、DeepSeek 等主流中文底座模型的优劣势，探讨垂直领域（医疗、法律、金融）微调的最佳实践，以及开源社区的最新进展。',
    date: '2026-04-15',
    tags: ['中文 LLM', 'ChatGLM', 'Qwen', '模型评测'],
    readTime: '25 min',
  },
  {
    id: 'kg-rag',
    title: '为什么纯向量 RAG 迟早会遇到天花板',
    excerpt: '向量检索解决"语义相似"的问题，但解决不了"实体关系缺失"的问题。知识图谱 RAG 是下一阶段的主流方案，从 RAGFlow 的架构设计里学到了这个思路。',
    date: '2026-03-20',
    tags: ['RAG', '知识图谱', 'Neo4j', 'RAGFlow'],
    readTime: '20 min',
  },
  {
    id: 'mcp-protocol',
    title: 'MCP 协议：让 Agent 真正连接外部世界',
    excerpt: 'MCP（Model Context Protocol）是 2025 年工具调用领域最重要的事件。不同于 Function Calling，MCP 是开放的设备协议。本文从工程角度解析 MCP 的设计哲学。',
    date: '2026-03-05',
    tags: ['MCP', 'Agent', '工具调用', 'LangGraph'],
    readTime: '16 min',
  },
  {
    id: 'llm-eval-practice',
    title: '跑了 500 组实验后，我总结的 LLM 评测方法论',
    excerpt: 'Context Faithfulness 的定义学术界都有争议。RAGAS 的每个指标在测什么、阈值怎么定、LLM-as-Judge 怎么避免偏袒——实战经验。',
    date: '2026-02-10',
    tags: ['评测', 'RAGAS', 'G-Eval', 'LLM-as-Judge'],
    readTime: '22 min',
  },
  {
    id: 'thinking-mode',
    title: '从"快思考"到"慢思考"：LLM 应用开发的思维转换',
    excerpt: 'LLM 应用的问题往往不是模型不够强，是设计模式没有充分利用模型的推理能力。本文探讨 CoT、ReAct、ToT 等推理模式的选择依据。',
    date: '2026-01-15',
    tags: ['CoT', 'ReAct', 'Agent', '架构设计'],
    readTime: '18 min',
  },
];

export const skills: Skill[] = [
  {
    category: '🧠 RAG 与检索',
    items: ['LangChain / LangGraph', '知识图谱 RAG', 'RAGFlow / Dify 平台', 'Hybrid Search (BM25+向量)', 'BGE / Cohere Rerank', 'HyDE 假设文档', '向量数据库（Milvus / Chroma / Neo4j）'],
  },
  {
    category: '🤖 Agent 与 MCP',
    items: ['MCP 协议集成', 'CrewAI 多 Agent', 'LangGraph 状态机', 'Tool Calling / Function Calling', 'Supervisor / Plan-and-Execute 模式', 'MCP 工具链（Playwright / GitHub / Filesystem）'],
  },
  {
    category: '🏛️ 中文底座模型',
    items: ['GLM-5.1 / GLM-4.7（智谱）', 'Qwen3 / Qwen2.5（阿里）', 'DeepSeek-R1 / V3（深度求索）', 'Yi-Lightning（零一万物）', 'InternLM3（上海 AI Lab）', 'Baichuan4（百川）'],
  },
  {
    category: '🔧 模型训练与微调',
    items: ['LLaMA-Factory', 'ChatGLM-Efficient-Tuning', 'LoRA / QLoRA / Full-tuning', 'DeepSpeed ZeRO', 'Axital 模型量化', 'Unsloth 高效训练'],
  },
  {
    category: '⚡ 推理部署',
    items: ['vLLM / TGI', 'PagedAttention', 'Continuous Batching', 'Tensor Parallelism', 'SLoRA 多租户', 'Kubernetes 推理集群'],
  },
  {
    category: '👁️ 多模态',
    items: ['GLM-5V-Turbo 视觉编程', 'Qwen-VL / InternVL', 'Design2Code 评估', '图片理解与生成'],
  },
  {
    category: '📊 评测',
    items: ['C-Eval / FlagEval / OpenCompass', 'RAGAS / DeepEval', 'G-Eval / LLM-as-Judge', 'LangSmith / LangFuse', 'SWE-bench / Live CodeBench', 'GitHub Actions CI/CD'],
  },
  {
    category: '🏥 垂直领域',
    items: ['HuatuoGPT / MedicalGPT（医疗）', 'LawGPT / ChatLaw（法律）', 'FinGPT / 轩辕（金融）', 'EduChat（教育）'],
  },
  {
    category: '🛠 工程基础设施',
    items: ['FastAPI + Docker', 'Redis / PostgreSQL', '异步处理（asyncio）', 'Pydantic 数据校验', 'Git 工作流', 'GitHub Pages 部署'],
  },
];

export const timeline = [
  { period: '2024.Q1', event: '从零搭 RAG 系统，发现纯向量检索的局限性' },
  { period: '2024.Q2', event: '引入知识图谱，KG-RAG 完整率提升 35%' },
  { period: '2024.Q3', event: 'CrewAI 多 Agent 上线，接入 MCP 协议' },
  { period: '2024.Q4', event: 'C-Eval / RAGAS 评测体系落地，召回率 91%' },
  { period: '2025.Q1', event: '基于 ChatGLM/Qwen 构建中文 LLM 微调平台' },
  { period: '2025.Q2', event: 'vLLM 部署，QPS 从 20 提升到 120' },
  { period: '2025.Q3', event: '医疗/法律垂直领域 RAG 落地，覆盖 10+ 场景' },
  { period: '2025.Q4', event: 'GitHub Actions 评测流水线，PR 自动回归' },
  { period: '2026.Q1', event: 'GLM-5.1 / DeepSeek-R1 国产模型能力跃升跟进' },
  { period: '2026.Q2', event: '个人主页重构，集成交互式 RAG/Agent/Eval Demo' },
];

export const models: Model[] = [
  // === 智谱 AI ===
  { name: 'GLM-5.1', provider: '智谱 AI', params: 'MoE 744B', context: '128K', commercial: true },
  { name: 'GLM-5V-Turbo', provider: '智谱 AI', params: '多模态视觉', context: '128K', commercial: true },
  { name: 'GLM-4.7', provider: '智谱 AI', params: '355B', context: '128K', commercial: true },
  // === 深度求索 ===
  { name: 'DeepSeek-R1', provider: '深度求索', params: '671B MoE', context: '128K', commercial: true },
  { name: 'DeepSeek-V3', provider: '深度求索', params: '671B MoE', context: '128K', commercial: true },
  { name: 'DeepSeek-V2', provider: '深度求索', params: '236B MoE', context: '128K', commercial: true },
  // === 阿里通义 ===
  { name: 'Qwen3', provider: '阿里', params: '0.5B-235B MoE', context: '128K', commercial: true },
  { name: 'Qwen2.5', provider: '阿里', params: '7B-72B', context: '128K', commercial: true },
  // === 零一万物 ===
  { name: 'Yi-Lightning', provider: '零一万物', params: 'MoE', context: '128K', commercial: true },
  { name: 'Yi', provider: '零一万物', params: '6B/34B', context: '200K', commercial: true },
  // === 上海 AI Lab ===
  { name: 'InternLM3', provider: '上海 AI Lab', params: '8B/104B', context: '128K', commercial: true },
  { name: 'InternLM2', provider: '上海 AI Lab', params: '7B/20B', context: '200K', commercial: true },
  // === 百川 ===
  { name: 'Baichuan4', provider: '百川', params: 'MoE', context: '128K', commercial: true },
  { name: 'Baichuan2', provider: '百川', params: '7B/13B', context: '128K', commercial: true },
  // === 其他国产 ===
  { name: 'MiniMax-Text-01', provider: 'MiniMax', params: '456B', context: '1M', commercial: true },
  { name: 'Step-2', provider: '阶跃星辰', params: '万亿 MoE', context: '128K', commercial: true },
  { name: 'Doubao-Pro', provider: '字节跳动', params: 'MoE', context: '128K', commercial: true },
  // === 国际参考 ===
  { name: 'Claude Opus 4.6', provider: 'Anthropic', params: 'unknown', context: '200K', commercial: true },
  { name: 'GPT-4o', provider: 'OpenAI', params: 'unknown', context: '128K', commercial: true },
];

export const frameworks: Framework[] = [
  { name: 'LLaMA-Factory', type: '微调', description: '支持 100+ 模型的微调框架' },
  { name: 'ChatGLM-Efficient-Tuning', type: '微调', description: 'ChatGLM 专用微调工具' },
  { name: 'vLLM', type: '推理', description: 'PagedAttention 高吞吐推理' },
  { name: 'LMDeploy', type: '推理', description: 'InternLM 推理优化' },
  { name: 'LangChain', type: '应用', description: 'LLM 应用开发框架' },
  { name: 'LangGraph', type: '应用', description: 'Agent 状态机框架' },
];

export const evaluations: Evaluation[] = [
  { name: 'C-Eval', scope: '52 学科，13948 题' },
  { name: 'FlagEval', scope: '多维度能力评测' },
  { name: 'OpenCompass', scope: '一站式评测平台' },
  { name: 'SuperCLUE', scope: '中文通用对话评测' },
  { name: 'GAOKAO-Bench', scope: '中国高考题目' },
  { name: 'AGIEval', scope: '人类考试基准' },
];