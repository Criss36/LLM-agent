# llm-action 教程笔记

本目录整合自 [liguodongiot/llm-action](https://github.com/liguodongiot/llm-action)，包含大模型训练、推理、压缩、评测等全流程实战教程。

## 核心教程索引

### LLM训练实战

| 模型 | 训练方法 | 参数规模 | 教程 |
|------|---------|---------|------|
| Alpaca | Full Fine-tuning | 7B | [从0到1复现斯坦福羊驼](https://github.com/liguodongiot/llm-action) |
| Alpaca(LLaMA) | LoRA | 7B~65B | [二十分钟完成微调](https://github.com/liguodongiot/llm-action) |
| ChatGLM | LoRA | 6B | [基于LoRA高效微调](https://github.com/liguodongiot/llm-action) |
| ChatGLM | P-Tuning v2 | 6B | [DeepSpeed微调指南](https://github.com/liguodongiot/llm-action) |
| LLaMA | QLoRA | 7B/65B | [48G显存微调65B](https://github.com/liguodongiot/llm-action) |
| OPT | RLHF | 0.1B~66B | [DeepSpeed Chat](https://github.com/liguodongiot/llm-action) |

### LLM推理优化

- [vLLM生产推理优化](https://github.com/liguodongiot/llm-action)：PagedAttention + Continuous Batching
- [TensorRT-LLM部署](https://github.com/liguodongiot/llm-action)：高性能推理引擎
- [FlashAttention加速](https://github.com/liguodongiot/llm-action)：访存优化技术

### LLM压缩

#### 量化技术
- **GPTQ/LLM.int8()**：训练后量化
- **AWQ/AutoAWQ**：Activation-Aware量化
- **QLoRA**：量化感知微调
- **FP8/FP6**：8位/6位浮点量化

#### 剪枝技术
- **LLM-Pruner**：结构化剪枝
- **SparseGPT/Wanda**：非结构化剪枝
- **SliceGPT**：矩阵剪枝

#### 知识蒸馏
- **MINILLM/GKD**：Standard KD
- **MT-COT/SCOTT**：CoT蒸馏
- **Lion**：指令跟随蒸馏

### LLM评测

| 基准 | 描述 | 规模 |
|------|------|------|
| C-Eval | 52学科中文评测 | 13,948题 |
| CMMLU | 中文知识和推理 | 67主题 |
| MMLU | 英文多学科 | 57学科 |
| LongBench | 长文本理解 | 4,750测试 |
| OpenCompass | 司南2.0评测 | 多维度 |

### LLM对齐技术

- **PPO**：近端策略优化
- **DPO**：直接偏好优化
- **ORPO**：odds ratio偏好优化

### 分布式训练

- **数据并行**：DDP, ZeRO
- **流水线并行**：GPipe, PipeDream
- **张量并行**：Megatron-LM
- **MOE并行**：专家并行

## 参考资源

- 原项目：[liguodongiot/llm-action](https://github.com/liguodongiot/llm-action)
- LLM训练实战汇总
- PEFT微调实战教程
- 分布式训练并行技术
