# 为什么纯向量 RAG 迟早会遇到天花板

> 向量检索解决"语义相似"的问题，但解决不了"实体关系缺失"的问题。

## 一个真实的上线教训

去年我做了一个法律文书问答系统，纯向量 RAG 方案，Embedding 模型用的 bge-large-zh，Chunk 策略试了 4 种，召回率 benchmark 跑出来 92%。当时觉得稳了。

上线第一天就被喷了。用户的 query 是"张三起诉过李四吗，结果是什么"，系统把"张三欠王五钱"和"李四被赵六起诉"的文档都召回了，就是没把"张三诉李四合同纠纷案"这条记录放在前排。因为向量空间里，"起诉"这个语义太泛了——张三和任何人的诉讼都"语义相似"，真正的实体关系反而被噪声淹没了。

这就是纯向量 RAG 的核心问题：**它理解"像什么"，但不理解"谁和谁有什么关系"**。

## 纯向量 RAG 的三堵墙

```
用户问题: "张三的代理律师是谁，他代理过哪些案件"
                │
        ┌───────┴───────┐
        │  向量检索      │
        │  余弦相似度    │
        │  Top-K 召回    │
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │  召回结果:     │
        │  "张三欠款纠纷"│  ← 实体"张三"命中
        │  "代理律师费  │  ← 关键词"代理律师"命中
        │   用规定"     │
        │  "李四代理律  │  ← 法律文书混入
        │   师王五"     │
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │  LLM 回答:     │
        │  "可能是王五"  │  ← 猜的，没有证据链
        └───────────────┘
```

三个具体痛点：

1. **实体关系盲区**：向量不知道"张三"和"李四"之间存在"诉讼"关系，它只知道这两个 token 出现在不同文档里
2. **多跳推理断裂**："张三的律师的另一个客户是谁"需要 2 跳推理，纯向量检索无法维护路径依赖
3. **上下文碎片化**：相关三元组分散在多个 Chunk 中，Top-K 截断后关键关系丢失

## KG-RAG：给检索加上关系引擎

先上一个我在生产环境中实际使用的架构：

```
                               ┌─────────────────────┐
                               │   用户 Query         │
                               └──────────┬──────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
            ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
            │ 实体抽取     │    │ Query 向量化 │    │ Query 重写      │
            │ LLM-based    │    │              │    │ 提取实体关系     │
            └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘
                   │                   │                      │
                   ▼                   ▼                      │
            ┌──────────────────────────────────────┐          │
            │          并行检索层                    │          │
            │  ┌─────────────┐  ┌───────────────┐   │          │
            │  │ 向量检索     │  │ 图谱查询      │   │◄─────────┘
            │  │ FAISS/HNSW  │  │ Cypher/SPARQL │   │
            │  └──────┬──────┘  └───────┬───────┘   │
            └─────────┼──────────────────┼───────────┘
                      │                  │
                      ▼                  ▼
            ┌──────────────────────────────────────┐
            │          结果融合层                   │
            │  1. 去重向量和图谱重叠的实体           │
            │  2. 基于图谱路径扩展上下文              │
            │  3. 按关系距离排序                     │
            └──────────────────┬───────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────────┐
            │          LLM 生成                     │
            │  注入扩展后的结构化上下文               │
            └──────────────────────────────────────┘
```

### 核心实现：实体抽取 Pipeline

```python
# entity_extractor.py
import json
from typing import List, Dict
from langchain_core.prompts import ChatPromptTemplate

EXTRACTION_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """从文本中抽取实体和关系，以 JSON 格式输出。
实体类型: PERSON, ORG, CASE, LAW, PRODUCT
关系类型: 起诉, 代理, 判决, 涉及, 担任

输出格式:
{{
  "entities": [{{"name": str, "type": str}}],
  "relations": [{{"source": str, "target": str, "type": str}}]
}}
"""),
    ("human", "{text}")
])

def extract_triplets(text: str, llm) -> Dict:
    """抽取实体关系三元组，返回结构化数据"""
    response = llm.invoke(EXTRACTION_PROMPT.format(text=text))
    # 生产环境需要加 JSON 解析容错
    try:
        return json.loads(response.content)
    except json.JSONDecodeError:
        # fallback: 正则提取脏数据
        return _fallback_parse(response.content)

# 使用示例
doc = "2024年3月，原告张三委托北京大成律师事务所王五律师，就合同纠纷一案起诉被告李四。"
triplets = extract_triplets(doc, llm)
# 输出:
# {
#   "entities": [
#     {"name": "张三", "type": "PERSON"},
#     {"name": "李四", "type": "PERSON"},
#     {"name": "王五", "type": "PERSON"},
#     {"name": "北京大成律师事务所", "type": "ORG"}
#   ],
#   "relations": [
#     {"source": "张三", "target": "李四", "type": "起诉"},
#     {"source": "张三", "target": "王五", "type": "代理"},
#     {"source": "王五", "target": "北京大成律师事务所", "type": "任职"}
#   ]
# }
```

### 图谱存储与查询（Neo4j）

```python
# graph_store.py
from neo4j import GraphDatabase

class KGStore:
    def __init__(self, uri: str, user: str, password: str):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def insert_triplets(self, triplets: Dict):
        with self.driver.session() as session:
            for ent in triplets["entities"]:
                session.run(
                    "MERGE (e:Entity {name: $name, type: $type})",
                    name=ent["name"], type=ent["type"]
                )
            for rel in triplets["relations"]:
                session.run(
                    """
                    MATCH (s:Entity {name: $source})
                    MATCH (t:Entity {name: $target})
                    MERGE (s)-[r:RELATION {type: $rel_type}]->(t)
                    """,
                    source=rel["source"],
                    target=rel["target"],
                    rel_type=rel["type"]
                )

    def query_relation_path(self, entity_name: str, max_hops: int = 2) -> List:
        """查询指定实体的 N 跳邻接关系"""
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH path = (s:Entity {name: $name})-[*1..$max_hops]-(t)
                RETURN path
                LIMIT 50
                """,
                name=entity_name,
                max_hops=max_hops
            )
            return [record["path"] for record in result]
```

### 融合检索的核心逻辑

```python
def hybrid_retrieve(query: str, top_k: int = 5, max_hops: int = 2):
    # 1. 实体抽取
    triplets = extract_triplets(query, llm)

    # 2. 向量检索（并行）
    vector_results = vector_store.similarity_search(query, k=top_k)

    # 3. 图谱检索（并行）
    graph_context = []
    for ent in triplets["entities"]:
        paths = kg_store.query_relation_path(ent["name"], max_hops)
        graph_context.extend(paths)

    # 4. 融合策略：图谱路径中的实体在向量结果中出现时，提升权重
    fusion_scores = _fusion_rank(vector_results, graph_context)

    # 5. 构造增强上下文
    enhanced_context = _build_context(fusion_scores, graph_context)
    return enhanced_context

def _fusion_rank(vector_results, graph_context):
    """基于图谱关系的重排序"""
    graph_entities = set()
    for path in graph_context:
        for node in path.nodes:
            graph_entities.add(node["name"])

    for doc in vector_results:
        # 如果向量结果中的实体出现在图谱中，加分
        boost = sum(1.0 for ent in graph_entities if ent in doc.page_content)
        doc.metadata["fusion_score"] = doc.metadata.get("score", 0.5) + boost * 0.15

    return sorted(vector_results, key=lambda d: d.metadata["fusion_score"], reverse=True)
```

## 向量 vs KG-RAG vs 混合：选型决策矩阵

| 维度 | 纯向量 RAG | 纯 KG-RAG | 混合 KG-RAG |
|------|-----------|----------|------------|
| 语义相似搜索 | 强 | 弱 | 强 |
| 多跳推理 | 弱（1-2 跳极限） | 强（5+ 跳） | 强 |
| 实体关系查询 | 弱 | 极强 | 极强 |
| 长尾知识覆盖 | 好 | 差（实体未抽取即丢失） | 好 |
| 索引成本 | 低 | 高（需 LLM 抽三元组） | 高 |
| 查询延迟 | 50-200ms | 200-800ms | 300-1200ms |
| 维护复杂度 | 低 | 中 | 中-高 |

**我的经验法则：**

- **纯向量足矣**：内容型知识库（博客、文档、FAQ），不涉及复杂实体关系
- **必须上 KG**：法律、医疗、金融、科研文献，其中实体关系和多跳推理是核心需求
- **混合是长期方案**：生产环境中两者互补，向量保证召回广度，图谱保证推理深度

## 生产环境的几个坑

### 1. 实体抽取的准确率噩梦

我用 GPT-4 抽取三元组，准确率大概 85%。换成开源模型（Qwen-14B）直接掉到 60%+。解决方案：

- **规则兜底**：先用正则抽取明显实体（如"原告/被告：XXX"），再用 LLM 补充
- **回滚策略**：图谱查不到时降级为纯向量检索，不阻塞用户

### 2. 图谱膨胀

一个月没维护，我的 Neo4j 实例涨到了 200 万节点。查询从 200ms 飙到 3s。

- 定期清理孤立节点（degree < 2 且存在超过 30 天）
- 对频繁查询的路径做缓存（Redis，TTL=5min）
- 实体归一化："北京大成律师事务所" 和 "大成律师事务所北京总部" 合并

### 3. LLM 上下文窗口

KG 扩展后上下文可能膨胀到 10K+ tokens。解决方案：对扩展的路径按关系距离截断，只保留 2 跳以内的路径。

```
原始扩展（太长了）:
张三 -[起诉]-> 李四 -[代理]-> 王五 -[任职]-> 大成律所 -[代理]-> 赵六 -[起诉]-> 孙七

截断后（保留 2 跳）:
张三 -[起诉]-> 李四 -[代理]-> 王五
```

## 效果对比：我在法律场景的真实数据

测试集：500 条法律咨询问题，人工标注正确答案。评估指标：Answer Exact Match（答案完全正确率）。

| 方案 | Answer EM | 平均延迟 |
|------|----------|---------|
| 纯向量 RAG (top-5) | 61.2% | 180ms |
| 纯向量 RAG (top-10) | 64.8% | 210ms |
| 纯 KG-RAG | 52.3% | 450ms |
| 混合 KG-RAG (2-hop) | **78.6%** | 680ms |
| 混合 KG-RAG (3-hop) | **82.1%** | 950ms |

纯向量在 top-5 到 top-10 的提升只有 3.6%，说明多加 Chunk 解决不了关系缺失的问题。混合方案直接拉升到 78.6%，代价是延迟从 200ms 涨到 680ms——在大多数场景下完全可以接受。

## 总结

KG-RAG 不是要替代向量检索，而是补上"关系理解"这块拼图。如果你的业务中用户问的不只是"有没有关于 X 的内容"，而是"X 和 Y 之间是什么关系，经过 Z 之后结果如何"，那你迟早需要上知识图谱。

下期我会分享如何在生产环境中用 LangGraph 实现 KG-RAG 的自动化索引 Pipeline，以及如何监控图谱质量。欢迎关注。

---

*实践者：Criss36 | 专注于 LLM 应用的工程化落地*
