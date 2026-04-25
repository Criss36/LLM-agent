# MCP 协议：让 Agent 真正连接外部世界

> MCP（Model Context Protocol）是 AI Agent 连接外部工具的标准协议。

## 核心概念

- **Tool Registry**: Agent 注册可用工具
- **Context Passing**: 传递上下文和工具调用结果
- **Supervisor 模式**: 路由任务到合适的子 Agent

## 与其他方案对比

| 方案 | 开放性 | 安全性 | 生态 |
|------|--------|--------|------|
| MCP | 开放协议 | 沙箱执行 | 快速增长 |
| Function Calling | 平台绑定 | 取决于实现 | 成熟 |
