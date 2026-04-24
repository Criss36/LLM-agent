# AI Agents From Zero

本项目整合自 [didilili/ai-agents-from-zero](https://github.com/didilili/ai-agents-from-zero)，提供完整的AI智能体开发教程和实战代码。

## 项目特点

- 🧭 系统性学习路径，从大模型基础到企业级智能体开发
- 🐍 聚焦Python生态，基于LangChain/LangGraph技术栈
- 📘 通俗易懂，适合零基础入门
- 💼 企业级实战项目，对标真实业务场景
- ✅ 可运行案例，提供完整源码和环境配置
- 📚 教程、源码、面试题库三位一体

## 目录结构

```
ai-agents-from-zero/
├── src/                        # 源代码
│   ├── agents/                 # 智能体实现
│   │   ├── base_agent.py       # 基础智能体
│   │   ├── langchain_agent.py  # LangChain智能体
│   │   └── langgraph_agent.py  # LangGraph智能体
│   ├── rag/                    # RAG系统
│   │   ├── vector_store.py     # 向量存储
│   │   ├── retriever.py        # 检索器
│   │   └── knowledge_graph.py  # 知识图谱
│   ├── mcp/                    # MCP协议集成
│   │   ├── client.py           # MCP客户端
│   │   └── server.py           # MCP服务器
│   ├── tools/                  # 工具集
│   │   ├── web_search.py       # 网页搜索
│   │   ├── calculator.py       # 计算器
│   │   └── file_io.py          # 文件操作
│   └── utils/                  # 工具函数
│       ├── prompt.py           # 提示词模板
│       └── config.py           # 配置管理
├── examples/                   # 示例项目
│   ├── merchant_assistant/     # 商户运营管家
│   ├── e-commerce_agent/       # 电商小二
│   └── market_analyzer/        # 市场罗盘
├── tests/                      # 测试代码
├── requirements.txt            # 依赖文件
├── Dockerfile                  # 容器配置
└── README.md                   # 说明文档
```

## 核心功能

### 智能体开发
- **基础智能体**：基于LLM的简单智能体实现
- **LangChain智能体**：使用LangChain框架的智能体
- **LangGraph智能体**：基于状态机的复杂智能体
- **多智能体协作**：多个智能体协同完成任务

### RAG系统
- **向量检索**：基于Embedding的相似度搜索
- **知识图谱**：实体关系增强的检索
- **多路召回**：混合检索策略
- **HyDE**：假设文档嵌入技术
- **Rerank**：重排序优化

### MCP协议集成
- **工具调用**：智能体调用外部工具
- **服务解耦**：智能体与工具的解耦
- **跨智能体通信**：智能体之间的通信

### 工具集
- **网页搜索**：实时信息获取
- **计算器**：数学计算
- **文件操作**：读写文件
- **其他工具**：可扩展的工具系统

## 技术栈

| 类别 | 技术/平台 | 说明 |
|------|-----------|------|
| **大模型** | OpenAI, LLaMA, Qwen | 模型API调用 |
| **框架** | LangChain, LangGraph | 智能体开发框架 |
| **协议** | MCP | 模型上下文协议 |
| **RAG** | FAISS, Neo4j, BGE Embedding | 检索增强生成 |
| **部署** | Docker, vLLM | 容器化部署 |
| **语言** | Python | 主要开发语言 |

## 快速开始

### 环境配置

```bash
# 安装依赖
pip install -r requirements.txt

# 配置环境变量
export OPENAI_API_KEY=your_api_key
```

### 运行示例

```bash
# 运行基础智能体
python src/agents/base_agent.py

# 运行LangChain智能体
python src/agents/langchain_agent.py

# 运行LangGraph智能体
python src/agents/langgraph_agent.py
```

### 容器化部署

```bash
# 构建镜像
docker build -t ai-agents-from-zero .

# 运行容器
docker run -e OPENAI_API_KEY=your_api_key -p 8000:8000 ai-agents-from-zero
```

## 实战项目

### 1. 商户运营管家
- **功能**：智能客服、运营建议、数据分析
- **技术**：LangChain + RAG + 知识图谱
- **场景**：电商平台商户运营

### 2. 电商小二
- **功能**：订单处理、售后咨询、产品推荐
- **技术**：多智能体协作 + 工具调用
- **场景**：电商客服

### 3. 市场罗盘
- **功能**：市场分析、竞品监控、趋势预测
- **技术**：RAG + 网页搜索 + 数据分析
- **场景**：市场调研

## 学习路径

1. **基础篇**：大模型基础、提示词工程
2. **框架篇**：LangChain、LangGraph使用
3. **RAG篇**：检索增强生成技术
4. **Agent篇**：智能体开发与工具调用
5. **MCP篇**：模型上下文协议集成
6. **部署篇**：容器化部署与性能优化
7. **实战篇**：企业级项目开发

## 面试题库

本项目包含AI智能体相关的面试题库，涵盖：
- 大模型基础理论
- LangChain/LangGraph使用
- RAG系统设计
- 智能体架构
- 工程化部署
- 性能优化

## 参考资源

- [LangChain官方文档](https://docs.langchain.com/)
- [LangGraph官方文档](https://docs.langchain.com/langgraph/)
- [MCP协议文档](https://model-context-protocol.github.io/)
- [FAISS文档](https://faiss.ai/)
- [Neo4j文档](https://neo4j.com/docs/)

## 贡献

欢迎提交Issue和Pull Request，一起完善这个项目！

## 许可证

MIT License
