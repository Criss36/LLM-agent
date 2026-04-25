# LLM 评测方法论

> 跑了 500 组实验后，我总结的 LLM 评测方法论。

## 评测维度与指标计算

### Context Precision — 召回内容是否相关

Context Precision 衡量检索到的文档中有多少是真正相关的。计算公式为：

```
Precision@k = (相关文档在 top-k 中的数量) / k

AP@k = Σ(Precision@i × rel(i)) / (相关文档总数)
```

其中 `rel(i)` 表示第 i 个位置是否相关（0 或 1）。举个例子：系统召回了 5 个文档，相关文档在第 1、3、5 位，则：

```
Precision@1 = 1/1 = 1.0
Precision@3 = 2/3 ≈ 0.67
Precision@5 = 3/5 = 0.60
AP = (1.0 + 0.67 + 0.60) / 3 ≈ 0.76
```

我在实际项目中踩过的坑：单纯堆高 Precision 会导致召回不足。有次把 Precision 优化到 0.95 以上后，Context Recall 反而跌到了 0.6 以下——因为检索器只敢返回最确定的那几个 chunk，把可能相关的全部过滤掉了。

**解决办法**：采用 **Recall@k 与 Precision@k 的加权调和平均**作为联合指标，权重设为 Recall : Precision = 1.5 : 1，因为对 RAG 系统来说，漏掉关键信息的代价通常高于捎带一些无关内容。

### Faithfulness — 回答是否忠于上下文

Faithfulness 检查 LLM 的回答是否包含未在上下文中出现的陈述。RAGAS 的实现方式是对回答逐句分解，对每个句子用 LLM 判断是否可被上下文支持：

```python
# 简化版 Faithfulness 判定逻辑
def check_faithfulness(response: str, contexts: list[str]) -> float:
    sentences = split_into_sentences(response)
    supported = 0
    for sent in sentences:
        verdict = llm_judge(
            f"上下文：{' '.join(contexts)}\n"
            f"判断以下陈述是否被上下文支持，只回答 YES 或 NO：\n"
            f"陈述：{sent}"
        )
        if verdict.strip().upper() == "YES":
            supported += 1
    return supported / len(sentences) if sentences else 1.0
```

一个真实教训：当上下文包含表格或 JSON 格式数据时，LLM 对 Faithfulness 的自我评估经常误判。我排查了一周，发现是因为 Markdown 表格被检索器切碎后丢失了表头，LLM 看到孤立的数据单元后误以为"上下文没有提到这个数字"。

**改进方案**：检索时保留 chunk 的上下文窗口（前后各 2 个 chunk），拼接后送入判准模型。

### Answer Relevance — 回答是否对用户有用

Answer Relevance 衡量 LLM 的回答与问题的语义相关度。RAGAS 的做法是：让 LLM 根据回答反推问题，然后计算原始问题与反推问题的余弦相似度。

```python
def compute_answer_relevance(question: str, answer: str, embedding_fn) -> float:
    # 根据回答反推 N 个可能的问题
    reverse_questions = llm_reverse_questions(answer, n=3)
    
    # 计算每个反推问题与原始问题的余弦相似度
    q_emb = embedding_fn(question)
    sims = []
    for rq in reverse_questions:
        rq_emb = embedding_fn(rq)
        sim = cosine_similarity(q_emb, rq_emb)
        sims.append(sim)
    
    return sum(sims) / len(sims)  # 取平均值
```

观察到的一个规律：当回答全是空话套话（如"这是一个复杂的问题，需要具体分析"），Answer Relevance 会显著偏低——因为套话无法反推出有信息量的原始问题。

## RAGAS 评分方法论与生产调优

RAGAS（Retrieval Augmented Generation Assessment）是目前最成熟的 RAG 评测框架之一。核心思路是自动化——用 LLM 来评 LLM，无需人工标注海量样本。

我的标准评测管线：

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy,
    context_precision, context_recall
)
from datasets import Dataset

def run_evaluation_pipeline(
    questions: list[str],
    answers: list[str],
    contexts: list[list[str]],
    ground_truths: list[str]
) -> dict:
    dataset = Dataset.from_dict({
        "question": questions,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths,
    })

    result = evaluate(
        dataset,
        metrics=[
            context_precision,
            context_recall,
            faithfulness,
            answer_relevancy,
        ],
        llm=your_eval_llm,
        embeddings=your_embedding_fn,
    )
    return result.to_pandas().to_dict()
```

**关键参数调优经验**：

1. **评判模型选择**：用 GPT-3.5 做 Judge 时 Faithfulness 的 F1 只有 0.72（对比人工标注），换 GPT-4 后提升到 0.89。成本确实翻了三倍，但评测可信度更重要。生产环境我采用分层策略——PR 回归用 Haiku 做快速筛查，发版前用 Sonnet 或 Opus 做深度评估。

2. **测试集规模**：30 条样本就能给出有统计意义的指标趋势（标准误差 < 0.03），但发现边缘案例需要 200+ 条。日常迭代用 50 条，周报用 200 条全量集。

## LLM-as-Judge 偏差 mitigation

LLM 给自己打分天然带有几种系统性偏差：

| 偏差类型 | 表现 | 缓解策略 |
|---------|------|---------|
| **位置偏差** | 倾向于给长回答更高分 | 引入长度归一化惩罚 |
| **自我增强偏差** | 对同系列模型输出评分更高 | 使用不同系列模型做 Judge |
| **极端评分** | 容易打满分或零分 | 引入 Likert 5 级量表替代二元判定 |
| **模板敏感度** | 措辞变化导致评分不稳定 | 固定评估提示词模板并版本化管理 |

我治理这些偏差的实践方案：

```python
# 多 Judge 投票 + 去除极端值
def robust_judge(response: str, context: str, judges: list[str]) -> float:
    scores = []
    for judge_model in judges:
        prompt = EVAL_PROMPT_TEMPLATE.format(
            context=context,
            response=response,
        )
        score = call_llm(judge_model, prompt)
        scores.append(float(score))

    # 去除最高最低分后取平均
    trimmed = sorted(scores)[1:-1]
    return sum(trimmed) / len(trimmed) if trimmed else sum(scores) / len(scores)
```

实际效果：引入 3 模型投票（Claude + GPT-4 + Gemini）后将评分标准差从 0.31 降到 0.12，同时把与人工评分的一致度（Spearman ρ）从 0.68 提升到 0.87。

## GitHub Actions CI/CD 自动化回归

评测必须嵌入 CI/CD 管线，否则指标一定会静默退化。这是我的实际配置：

```yaml
# .github/workflows/eval-regression.yml
name: LLM Eval Regression

on:
  pull_request:
    paths:
      - 'src/**'
      - 'config/**'

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run evaluation suite
        run: |
          pip install ragas datasets openai
          python scripts/run_eval.py \
            --testset tests/data/regression_set.json \
            --output results/report.json

      - name: Check thresholds
        run: |
          python scripts/check_thresholds.py \
            --input results/report.json \
            --thresholds '{
              "context_precision": 0.85,
              "context_recall": 0.85,
              "faithfulness": 0.90,
              "answer_relevancy": 0.85
            }'

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            const report = require('./results/report.json');
            const body = `## 评测报告\n\n`
              + `| 指标 | 当前值 | 阈值 | 状态 |\n`
              + `|------|--------|------|------|\n`
              + report.metrics.map(m =>
                  `| ${m.name} | ${m.value.toFixed(3)} | ${m.threshold} | ${m.pass ? ':' + 'white_check_mark:' : ':' + 'x:'} |`
                ).join('\n');
            github.rest.issues.createComment({
              ...context.repo,
              issue_number: context.payload.pull_request.number,
              body
            });
```

配套的阈值检查脚本：

```python
# scripts/check_thresholds.py
import json, sys

def check_thresholds(report_path: str, thresholds: dict):
    with open(report_path) as f:
        report = json.load(f)

    all_pass = True
    for metric, threshold in thresholds.items():
        value = report["metrics"][metric]
        passed = value >= threshold
        print(f"{metric}: {value:.3f} / {threshold} -> {'PASS' if passed else 'FAIL'}")
        all_pass &= passed

    if not all_pass:
        sys.exit(1)

if __name__ == "__main__":
    check_thresholds(sys.argv[1], json.loads(sys.argv[2]))
```

## 阈值设定方法论

阈值不是拍脑袋定的。我的方法基于 3 个步骤：

1. **基线采集**：在当前生产版本上跑 5 次全量评测，取各指标均值的 90% 作为初始阈值下限
2. **回归模拟**：人工注入常见退化（降低 chunk 大小、去掉 reranker），观察指标下降幅度，确保阈值能捕获这些退化
3. **灰度验证**：阈值运行两周后统计误报率，若超过 10% 则上调阈值

当前生产阈值体系：
- `faithfulness ≥ 0.90` — 最敏感指标，知识幻觉不可接受
- `context_recall ≥ 0.85` — 保证召回不滑坡
- `context_precision ≥ 0.80` — 允许一定冗余
- `answer_relevancy ≥ 0.85` — 用户体验下线

## 500 组实验的核心教训

1. **评测指标之间会互相拉扯**。单纯优化一个指标通常导致另一个指标劣化。提升 context_precision（减少召回的 chunk 数量）往往导致 context_recall 下降；过度追求 faithfulness 会让回答变得干瘪，伤及 answer_relevancy。

2. **评测集的设计比算法更重要**。花一周构建高质量的金标准评测集，其 ROI 远高于花一周调 chunk_size。我维护了 3 个评测集：单元集（50 条，快速回归）、回归集（200 条，周维度）、边缘案例集（100 条，专门覆盖长文档、表格、多语言等边界）。

3. **指标趋势比绝对值有意义**。单次数值波动 ±0.03 很正常，不要据此做决策。监控面板上我画的是 7 日移动平均线，只有连续 3 天下滑才触发告警。

4. **不要在评测管线上省钱**。用弱模型做 Judge 节省的 5 美元 API 费用，可能让你花 5 小时排查一个不存在的"回归"。评测可信度直接决定了迭代速度，这是整个 RAG 系统中最值得投入的部分。
