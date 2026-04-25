# MCP 协议：让 Agent 真正连接外部世界

> MCP（Model Context Protocol）是 Anthropic 推出的开放协议，旨在标准化 AI Agent 与外部工具、数据源之间的交互方式。如果把 LLM 比作大脑，MCP 就是它的手和眼睛。

## 从 Function Calling 到 MCP：一次协议级别的进化

在 MCP 出现之前，让 LLM 调用外部工具主要靠各平台私有的 Function Calling 方案。OpenAI、Anthropic、Google 各自定义了一套工具调用格式，开发者要为每个平台写不同的适配层。MCP 的出现改变了这个局面——它是一个**中间层协议**，一次实现，到处运行。

下面的对比可以看得更清楚：

| 维度 | MCP | Function Calling (OpenAI) |
|------|-----|--------------------------|
| **协议性质** | 开放标准，JSON-RPC 2.0 之上 | 平台私有 API 参数 |
| **传输层** | 支持 stdio、SSE、Streamable HTTP | HTTP-only |
| **工具注册** | 动态发现（list_tools） | 静态定义，在 chat completion 请求中传入 |
| **工具生命周期** | Server 独立运行，可热更新 | 每次请求重新定义 |
| **认证方式** | OAuth 2.0、API Key 等，协议层内置 | 上层应用自行处理 |
| **资源模型** | 工具 + 资源 + 提示词模板三种原语 | 仅有工具（函数） |
| **流式支持** | 原生支持，Transport 层可流 | SSE 流式，但工具调用是独立的 chunks |
| **并发控制** | Server 端自主控制 | 由客户端控制 |
| **生态** | 快速增长，VS Code、JetBrains 已集成 | 成熟，但仅限于 OpenAI 生态 |
| **安全沙箱** | 协议层建议，Server 端实现 | 无协议级规范 |

核心区别在于：Function Calling 是**API 参数**，MCP 是**独立协议**。这意味着 MCP Server 是一个独立进程，可以有自己的认证、限流、监控，甚至可以用任意语言编写。而 Function Calling 只是大模型请求中的一个 JSON 字段，所有逻辑都得在客户端侧实现。

## MCP 协议的消息流

MCP 基于 JSON-RPC 2.0，所有通信都是结构化的请求-响应模式。我把它拆成三个阶段：

### 1. 初始化阶段

客户端发送 `initialize` 请求，服务端返回协议版本、服务端能力（capabilities）和服务端信息：

```json
// Client → Server
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    },
    "clientInfo": {
      "name": "my-agent",
      "version": "1.0.0"
    }
  }
}

// Server → Client
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "weather-server",
      "version": "0.1.0"
    }
  }
}
```

初始化完成后，客户端发送 `initialized` 通知，双方正式进入工作阶段。

### 2. 工具发现阶段

客户端通过 `tools/list` 获取服务端的能力清单。这是 MCP 和 Function Calling 最大的不同点——**动态发现**。服务端可以运行时注册、注销工具，客户端实时更新。

```json
// Client → Server
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}

// Server → Client
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "获取指定城市的实时天气信息",
        "inputSchema": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string",
              "description": "城市名称，如 Beijing、Shanghai"
            },
            "units": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"],
              "default": "celsius"
            }
          },
          "required": ["city"]
        }
      }
    ]
  }
}
```

如果服务端声明了 `listChanged` 能力，当工具列表变更时，服务端会主动发送通知：

```json
// Server → Client (notification)
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed",
  "params": {}
}
```

### 3. 工具调用阶段

客户端发起 `tools/call` 请求，服务端执行并返回结果。这里有两个关键设计：

- **isError 字段**：工具执行出错不等于 RPC 错误。业务错误由 isError 标识，RPC 层面的错误才是真正的异常。
- **content 数组**：支持返回多种内容类型，包括文本、图片（base64）、资源引用等。

```json
// Client → Server
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "city": "Beijing",
      "units": "celsius"
    }
  }
}

// Server → Response (成功)
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "北京当前天气：23°C，晴，湿度 45%"
      }
    ]
  }
}

// Server → Response (业务错误)
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "未找到城市 'Beijin'，您是否想查询 'Beijing'？"
      }
    ],
    "isError": true
  }
}
```

## 实战：用 Python 构建 MCP Server

下面是我在实际项目中使用的 MCP Server 模板。基于 `mcp` 库，用装饰器风格注册工具，非常简洁。

```python
# weather_server.py
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types
import httpx

# 创建服务端实例
server = Server("weather-server")

# 注册工具 —— 通过装饰器动态注册到 tools 列表
@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_weather",
            description="获取指定城市的实时天气",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名（中文或英文）",
                    },
                    "units": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "default": "celsius",
                    },
                },
                "required": ["city"],
            },
        ),
        types.Tool(
            name="get_forecast",
            description="获取未来7天天气预报",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "days": {"type": "integer", "minimum": 1, "maximum": 7},
                },
                "required": ["city"],
            },
        ),
    ]


@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict
) -> list[types.TextContent | types.ImageContent]:
    # 统一错误处理：工具不存在时给出明确的错误
    if name not in {"get_weather", "get_forecast"}:
        raise ValueError(f"未知工具: {name}")

    if name == "get_weather":
        city = arguments["city"]
        units = arguments.get("units", "celsius")

        # 调用外部 API，带超时和重试
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"https://api.weather.example.com/v1/current",
                    params={"city": city, "units": units},
                )
                resp.raise_for_status()
                data = resp.json()
        except httpx.TimeoutException:
            return [types.TextContent(
                type="text",
                text=f"查询 {city} 天气超时，请稍后重试",
            )]
        except httpx.HTTPStatusError as e:
            return [types.TextContent(
                type="text",
                text=f"天气 API 返回错误: {e.response.status_code}",
            )]

        return [types.TextContent(
            type="text",
            text=f"{city} 当前天气：{data['temperature']}°{'C' if units == 'celsius' else 'F'}，{data['condition']}",
        )]

    # get_forecast 类似逻辑，省略


# 优雅的启动入口
async def main():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="weather-server",
                server_version="0.1.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

这段代码体现了几个实战要点：

1. **错误分层**：`ValueError` 这种是 RPC 层面的错误（工具不存在）；API 调用失败是业务错误，用 `isError` 返回，LLM 可以看到错误信息并尝试修复。
2. **超时控制**：每个外部调用都设置 timeout，防止一个慢 API 拖垮整个 Server。
3. **类型安全**：`inputSchema` 中的 `minimum`、`maximum`、`enum` 约束在 JSON Schema 层面就限制了非法参数。

## MCP Client 端的工具发现与调用

光有 Server 不够，还得有 Client 去消费它。下面是用 Python SDK 连接并调用 MCP Server 的示例：

```python
# mcp_client.py
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from contextlib import asynccontextmanager


@asynccontextmanager
async def mcp_session(server_script: str):
    """管理 MCP Server 生命周期的上下文管理器"""
    server_params = StdioServerParameters(
        command="python",
        args=[server_script],
    )
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 初始化
            await session.initialize()
            yield session


async def discover_and_call():
    async with mcp_session("weather_server.py") as session:
        # 1. 动态发现工具（tool discovery）
        tools = await session.list_tools()
        print(f"发现 {len(tools.tools)} 个工具:")
        for tool in tools.tools:
            print(f"  - {tool.name}: {tool.description}")

        # 2. 调用工具
        result = await session.call_tool(
            name="get_weather",
            arguments={"city": "Beijing", "units": "celsius"},
        )
        for content in result.content:
            if content.type == "text":
                print(f"结果: {content.text}")

        # 3. 处理错误场景
        result = await session.call_tool(
            name="get_weather",
            arguments={"city": "UnknownCity123"},
        )
        if result.isError:
            print(f"工具返回业务错误: {result.content[0].text}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(discover_and_call())
```

这里有个容易被忽略的细节：**`list_tools()` 应该在每次 Agent 思考前调用，而不是缓存一次用到旧**。因为 Server 可能在运行过程中更新了工具列表（通过 `list_changed` 通知）。实战中我通常在每个 Agent 循环的第一步都重新拉取一次工具列表。

## 与 LangGraph 的集成实践

在我的多 Agent 项目中，MCP 不是单独使用的，而是作为 LangGraph 图中的工具层。核心模式是**用一个 ToolNode 包装多个 MCP Server**：

```python
# mcp_langgraph_integration.py
from langgraph.graph import StateGraph, MessagesState
from langgraph.prebuilt import ToolNode, tools_condition
from mcp import ClientSession
from typing import Any


class MCPToolNode:
    """将 MCP Server 包装为 LangGraph 可调用的工具"""

    def __init__(self, session: ClientSession):
        self.session = session

    async def list_tools(self):
        """返回符合 LangGraph 工具格式的列表"""
        tools_response = await self.session.list_tools()
        langgraph_tools = []
        for tool in tools_response.tools:
            # 为每个 MCP 工具创建一个可调用函数
            async def make_tool_fn(name=tool.name, schema=tool.inputSchema):
                async def fn(**kwargs) -> Any:
                    result = await self.session.call_tool(
                        name=name, arguments=kwargs
                    )
                    if result.isError:
                        raise RuntimeError(
                            f"工具 {name} 执行失败: {result.content[0].text}"
                        )
                    return result.content[0].text
                return fn

            langgraph_tools.append(await make_tool_fn())
        return langgraph_tools


# 构建 LangGraph 图
def build_agent_graph(mcp_node: MCPToolNode):
    workflow = StateGraph(MessagesState)

    # Agent 节点：负责推理和决定调用哪个工具
    workflow.add_node("agent", call_model)
    # Tool 节点：执行工具调用
    workflow.add_node("tools", ToolNode(mcp_node.list_tools))

    # 条件边：需要工具调用就进入 tools，否则直接结束
    workflow.add_conditional_edges("agent", tools_condition)
    workflow.add_edge("tools", "agent")

    workflow.set_entry_point("agent")
    return workflow.compile()
```

这个模式的好处是**解耦**。每个 MCP Server 专注自己的领域（天气、数据库、搜索等），LangGraph 负责编排和状态管理。我甚至可以动态地启动/停止 MCP Server，而图中的逻辑完全不用改。

## 生产部署要点

把 MCP 推到生产环境，有几个坑一定要提前规避：

### 1. 安全沙箱

MCP Server 是独立进程，可以读写文件系统、调用网络、执行命令。绝对不能让不可信的 MCP Server 直接运行在你的生产环境里。

```python
# 用 subprocess 启动 MCP Server 时做沙箱限制
import subprocess
import resource

def spawn_mcp_server(script_path: str) -> subprocess.Popen:
    """启动沙箱化的 MCP Server 进程"""
    
    # 设置资源限制（Linux）
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))       # CPU 时间 5 秒
    resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))  # 内存 256MB
    
    proc = subprocess.Popen(
        ["python", script_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return proc
```

更推荐的做法是把每个 MCP Server 跑在独立的 Docker 容器里，限制网络访问、文件系统权限和资源配额。

### 2. 速率限制

Agent 可能因为 bug 或逻辑问题疯狂调用工具，必须在网关层做限流。

```python
import asyncio
from datetime import datetime, timedelta


class MCPRateLimiter:
    """基于令牌桶的 MCP 调用限流器"""
    
    def __init__(self, max_calls: int = 30, window_seconds: int = 60):
        self.max_calls = max_calls
        self.window = timedelta(seconds=window_seconds)
        self.call_timestamps: list[datetime] = []
    
    async def acquire(self, tool_name: str):
        now = datetime.now()
        # 清理窗口外的时间戳
        self.call_timestamps = [
            ts for ts in self.call_timestamps 
            if now - ts < self.window
        ]
        if len(self.call_timestamps) >= self.max_calls:
            wait_until = self.call_timestamps[0] + self.window
            wait_seconds = (wait_until - now).total_seconds()
            raise RuntimeError(
                f"工具调用限流：已达 {self.max_calls} 次/分钟上限，"
                f"请等待 {wait_seconds:.1f} 秒"
            )
        self.call_timestamps.append(now)
```

### 3. 可观测性

MCP Server 是独立进程，传统 APM 可能无法直接监控到内部调用。我通常在装饰器层面注入 tracing：

```python
from opentelemetry import trace
from functools import wraps

tracer = trace.get_tracer(__name__)

def traced_tool(name: str):
    """为 MCP 工具调用添加 OpenTelemetry 追踪"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            with tracer.start_as_current_span(f"mcp.tool.{name}") as span:
                span.set_attribute("tool.name", name)
                span.set_attribute("tool.args", str(kwargs))
                try:
                    result = await func(*args, **kwargs)
                    span.set_attribute("tool.success", True)
                    return result
                except Exception as e:
                    span.set_attribute("tool.success", False)
                    span.set_attribute("tool.error", str(e))
                    span.record_exception(e)
                    raise
        return wrapper
    return decorator
```

### 4. 连接池管理

当系统中同时运行多个 MCP Server（比如数据库 Server + 搜索 Server + 文件 Server），每个都是独立进程，连接管理就变得关键。建议用一个 `ConnectionPool` 统一管理：

```python
class MCPConnectionPool:
    """MCP Server 连接池"""
    
    def __init__(self):
        self._sessions: dict[str, ClientSession] = {}
    
    async def connect(self, name: str, command: str, args: list[str]):
        """注册并连接一个新的 MCP Server"""
        if name in self._sessions:
            await self.disconnect(name)
        
        server_params = StdioServerParameters(
            command=command,
            args=args,
        )
        read, write = await stdio_client(server_params).__aenter__()
        session = await ClientSession(read, write).__aenter__()
        await session.initialize()
        self._sessions[name] = session
        return session
    
    async def disconnect(self, name: str):
        """优雅关闭指定 Server"""
        session = self._sessions.pop(name, None)
        if session:
            await session.__aexit__(None, None, None)
    
    async def disconnect_all(self):
        """关闭所有 Server（用于应用关闭时的清理）"""
        for name in list(self._sessions.keys()):
            await self.disconnect(name)
```

## 实际踩过的坑

1. **JSON-RPC 批处理陷阱**：MCP 不支持 JSON-RPC 的批处理模式（batch），发送数组格式的请求会直接失败。不要尝试一次性批量调用多个工具。
2. **stdio 模式下子进程僵尸**：Client 崩溃后 MCP Server 子进程可能变成僵尸。务必在 Client 侧注册信号处理或使用 `asyncio` 的 `finalize` 钩子清理子进程。
3. **SSE 模式的重连**：基于 SSE 的 Transport 在网络抖动时可能断开连接，Client 需要实现指数退避重连逻辑，不要做简单的固定间隔重试。
4. **工具命名冲突**：当聚合多个 MCP Server 时，不同 Server 可能有同名的工具。我采用 `server_name:tool_name` 的命名约定来避免冲突。

## 总结

MCP 不仅仅是一个协议规范，它代表了一种架构思路——**让 AI Agent 通过标准化接口连接外部世界**。相比私有的 Function Calling，MCP 的开放性和动态发现能力让它更适合构建复杂的多 Agent 系统。结合 LangGraph 做编排、OpenTelemetry 做监控、Docker 做沙箱，MCP 完全可以支撑生产级的 Agent 应用。

如果你正在从 Function Calling 迁移到 MCP，建议的迁移路径是：先用 MCP 包装一个非核心工具（比如天气查询）做概念验证，然后逐步将核心工具迁移过来。不要一次性全量迁移，中间状态用适配器模式兼容两种协议。
