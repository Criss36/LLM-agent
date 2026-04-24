# Chinese-LLaMA-Alpaca-3

本项目集成自 [ymcui/Chinese-LLaMA-Alpaca-3](https://github.com/ymcui/Chinese-LLaMA-Alpaca-3)，包含中文LLaMA-3大模型的训练、推理、评测全流程代码。

## 项目特点

- 支持中文LLaMA-3基座模型和指令模型
- 提供完整的预训练和指令精调代码
- 支持LoRA/QLoRA高效微调
- 集成C-Eval、CMMLU、MMLU等评测工具
- 支持Flash Attention加速推理

## 目录结构

```
Chinese-LLaMA-Alpaca-3/
├── scripts/
│   ├── training/                    # 训练脚本
│   │   ├── run_clm_pt_with_peft.py # 预训练脚本
│   │   ├── run_clm_sft_with_peft.py# 指令精调脚本
│   │   ├── build_dataset.py        # 数据集构建
│   │   ├── run_pt.sh               # 预训练启动脚本
│   │   └── run_sft.sh              # SFT启动脚本
│   ├── inference/                   # 推理脚本
│   │   └── inference_hf.py         # HuggingFace推理
│   ├── evaluation/                 # 评测脚本
│   │   ├── ceval/                  # C-Eval评测
│   │   ├── cmmlu/                  # CMMLU评测
│   │   └── mmlu/                   # MMLU评测
│   └── merge_llama3_with_chinese_lora_low_mem.py  # LoRA合并
├── data/                           # 数据目录
└── requirements.txt                # 依赖
```

## 环境安装

```bash
pip install -r requirements.txt
```

## 快速使用

### 模型下载

从HuggingFace下载模型：
- [Llama-3-Chinese-8B](https://huggingface.co/ymcui/Llama-3-Chinese-8B)
- [Llama-3-Chinese-8B-Instruct-v3](https://huggingface.co/ymcui/Llama-3-Chinese-8B-Instruct-v3)

### 指令精调训练

```bash
cd scripts/training
bash run_sft.sh
```

### 模型推理

```bash
cd scripts/inference
python inference_hf.py --base_model /path/to/model --with_prompt
```

### 模型合并

```bash
python scripts/merge_llama3_with_chinese_lora_low_mem.py \
    --base_model path/to/llama-3-hf-model \
    --lora_model path/to/llama-3-chinese-lora \
    --output_type huggingface \
    --output_dir path/to/output-dir
```

### 模型评测

```bash
# C-Eval评测
cd scripts/evaluation/ceval
python eval.py --model_path /path/to/model --output_dir ./results

# CMMLU评测
cd scripts/evaluation/cmmlu
python eval.py --model_path /path/to/model --output_dir ./results
```

## 技术栈

- 框架: PyTorch, Transformers, PEFT, DeepSpeed
- 量化: bitsandbytes, GGUF
- 推理: vLLM, Flash Attention 2
- 评测: C-Eval, CMMLU, MMLU

## 参考项目

- [Chinese-LLaMA-Alpaca-3](https://github.com/ymcui/Chinese-LLaMA-Alpaca-3)
- [llm-action](https://github.com/liguodongiot/llm-action)
