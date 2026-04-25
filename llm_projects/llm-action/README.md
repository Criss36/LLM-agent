# llm-action 实战代码

本目录整合自 [liguodongiot/llm-action](https://github.com/liguodongiot/llm-action)，包含大模型训练、推理、压缩等实战代码。

## 目录结构

```
llm-action/
├── scripts/
│   ├── training/                    # 训练脚本
│   │   ├── alpaca-lora/            # Alpaca LoRA微调
│   │   │   ├── finetune.py        # 训练脚本
│   │   │   └── inference.py       # 推理脚本
│   │   ├── chatglm-lora/           # ChatGLM LoRA微调
│   │   │   └── finetune.py        # 训练脚本
│   │   ├── qlora.py               # QLoRA高效微调
│   ├── inference/                   # 推理脚本
│   │   ├── vllm_client.py         # vLLM客户端
│   │   └── chatglm3_demo.py       # ChatGLM3演示
│   └── compression/                 # 模型压缩
└── README.md                       # 说明文档
```

## 核心功能

### 训练部分

#### Alpaca-LoRA 微调
- **finetune.py**: 基于LoRA的Alpaca模型微调
- **inference.py**: 微调后模型的推理

#### ChatGLM-LoRA 微调
- **finetune.py**: 基于LoRA的ChatGLM模型微调

#### QLoRA 高效微调
- **qlora.py**: 4-bit量化LoRA微调，支持大模型在消费级GPU上训练

### 推理部分

#### vLLM 高性能推理
- **vllm_client.py**: vLLM推理服务客户端

#### ChatGLM3 本地推理
- **chatglm3_demo.py**: ChatGLM3命令行交互演示

## 技术栈

- **框架**: PyTorch, Transformers, PEFT, DeepSpeed
- **量化**: bitsandbytes (4-bit, 8-bit)
- **推理**: vLLM, HuggingFace
- **微调**: LoRA, QLoRA, P-Tuning v2

## 快速使用

### Alpaca-LoRA 微调

```bash
cd scripts/training/alpaca-lora
python finetune.py --base_model meta-llama/Llama-2-7b-hf --data_path tatsu-lab/alpaca --output_dir ./lora-alpaca
```

### QLoRA 微调

```bash
cd scripts/training
python qlora.py --model_name_or_path meta-llama/Llama-2-7b-hf --dataset tatsu-lab/alpaca
```

### vLLM 推理

```bash
cd scripts/inference
python vllm_client.py --prompt "Hello, how are you?"
```

### ChatGLM3 本地推理

```bash
cd scripts/inference
python chatglm3_demo.py
```

## 参考资源

- 原项目：[liguodongiot/llm-action](https://github.com/liguodongiot/llm-action)
- 教程笔记：[llm-action-notes/README.md](../llm-action-notes/README.md)
