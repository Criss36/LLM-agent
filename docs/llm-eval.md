# LLM 评测方法论

> 跑了 500 组实验后，我总结的 LLM 评测方法论。

## 评测维度

1. **Context Precision** — 召回内容是否相关
2. **Context Recall** — 是否遗漏重要上下文
3. **Faithfulness** — 回答是否忠于上下文
4. **Answer Relevance** — 回答是否对用户有用

## 工具链

- **RAGAS**: RAG 系统专项评测
- **G-Eval**: 基于 LLM 的主观评测
- **LLM-as-Judge**: 用模型评判模型

## CI/CD 集成

GitHub Actions 自动跑回归，所有指标 > 0.85 才能合并。
