# 从"快思考"到"慢思考"

> LLM 应用的问题往往不是模型不够强，是设计模式没有充分利用模型的推理能力。

## 为什么需要显式的推理模式？

早期我写 LLM 应用时，习惯直接提问拿答案——后来发现，面对稍微复杂的任务（比如多步推理、需要调用外部工具、或者需要在多个可能性中决策），直接输出频繁出错。问题的根源在于：**LLM 默认的"下一个词预测"机制本质上是 System 1 思维——快速、直觉性、但容易在需要深度推理时产生幻觉**。

引入显式的推理模式（System 2 思维），本质上是在 LLM 的快速直觉之上，叠加一层结构化的推理过程。下面逐一拆解每种模式的核心机制、实现方式和落地经验。

---

## 1. Chain-of-Thought：最简单的 System 2

### 核心机制

CoT 的核心极简：在输出最终答案之前，先生成中间推理步骤。这迫使模型把"得出答案"和"解释推理"解耦。

### 实现模式

**Zero-shot CoT**——加一句 "让我们一步一步思考"：

```python
def zero_shot_cot(prompt: str, llm) -> str:
    return llm.invoke(f"{prompt}\n\n请一步一步思考，然后给出最终答案。")
```

**Few-shot CoT**——给 2-3 个带推理链的示例：

```python
FEW_SHOT_EXAMPLES = """
问：一个水池，甲管注水需 4 小时注满，乙管注水需 6 小时注满。两管同时开，几小时注满？
推理：甲管每小时注 1/4，乙管每小时注 1/6。两管一起每小时注 1/4 + 1/6 = 5/12。所以时间 = 1 ÷ 5/12 = 12/5 = 2.4 小时。
答：2.4 小时。

问：{question}
推理："""
```

### 经验教训

- **自洽性（Self-Consistency）** 是 CoT 最强的增强手段。采样多个推理路径（temperature > 0），取多数答案，准确性提升可达 10-15%。代价是延迟乘以 5-10 倍。
- **长链退化**：超过 10 步的推理链，中间步骤的准确率可能逐级衰减。解决方案是"反思机制"——让模型在推理过程中自我检查。
- **适用边界**：CoT 在数学题、逻辑推理、常识推理上效果显著；在非结构化创意任务（写故事、头脑风暴）上反而约束模型。

---

## 2. ReAct：在推理中行动

ReAct 的核心洞察是：**推理不能只停留在脑子里，要和外部世界交互**。将 CoT 的推理步骤与工具调用交替进行，让模型能观察行动结果再继续推理。

### LangGraph 实现：一个可运行的 ReAct Agent

下面是我在生产项目中使用的一段 LangGraph 实现骨架：

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Literal, List
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage


class AgentState(TypedDict):
    messages: List
    next_agent: str


def should_continue(state: AgentState) -> Literal["tools", "end"]:
    last_msg = state["messages"][-1]
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    return "end"


def call_model(state: AgentState, llm, tools):
    system_prompt = (
        "你是一个智能助手，可以通过工具获取实时信息。\n"
        "请遵循以下流程：思考 -> 调用工具（如需要）-> 观察结果 -> 继续推理\n"
        "当得到最终答案时，直接给出回答，不要调用工具。"
    )
    response = llm.bind_tools(tools).invoke([
        ("system", system_prompt),
        *state["messages"]
    ])
    return {"messages": [response]}


def call_tool(state: AgentState, tool_map):
    last_msg = state["messages"][-1]
    tool_results = []
    for tc in last_msg.tool_calls:
        tool_fn = tool_map[tc["name"]]
        result = tool_fn.invoke(tc["args"])
        tool_results.append(
            ToolMessage(content=str(result), tool_call_id=tc["id"])
        )
    return {"messages": tool_results}


# 构建图
builder = StateGraph(AgentState)
builder.add_node("agent", call_model)
builder.add_node("tools", call_tool)
builder.set_entry_point("agent")
builder.add_conditional_edges("agent", should_continue)
builder.add_edge("tools", "agent")
graph = builder.compile()
```

这段代码的关键设计决策：

- **工具调用的路由**：`should_continue` 判断最后一条消息是否有 tool_calls，有则走工具节点，无则结束。这种"自循环"结构让 agent 可以连续调用 10+ 个工具。
- **ToolMessage 回传**：每个工具调用的结果被包装为 ToolMessage 再喂回 model，形成完整的"思考-行动-观察"闭环。
- **循环次数上限**：实际运行中我会在 StateGraph 上设置 `recursion_limit=25`，防止无限循环。

### ReAct 的失败模式

| 失败模式 | 表现 | 解决方案 |
|---------|------|---------|
| 工具循环 | 反复调用相同工具不肯结束 | 加入 max_iterations 硬限制；prompt 中强调"如果已经获得足够信息，直接回答" |
| 错误恢复 | 工具返回错误后 agent 崩溃 | 给每个工具调用加 try/except，将错误消息转为普通 ToolMessage |
| 上下文膨胀 | 多轮工具调用后超出 token 限制 | 实现 Message 压缩策略（如保留最近的 N 轮、历史摘要化） |

---

## 3. Tree-of-Thoughts：搜索推理树

ToT 适合那些需要**在多个可能性中搜索**的任务——比如写代码时选择不同的架构方案，或者做规划时在多条路径中挑最优。

### 核心思想

把推理过程看作一棵树，每一层代表一个推理步骤，每个节点代表一个中间状态。用搜索算法（BFS 或 DFS）探索这棵树，到达叶子节点时评估答案质量。

### BFS 实现：推理树的广度搜索

```python
from typing import List, Dict, Any


def tot_bfs(
    problem: str,
    llm,
    branches_per_step: int = 3,
    max_depth: int = 3,
    top_k: int = 2,
) -> List[Dict[str, Any]]:
    """BFS 搜索推理树，每层保留 top_k 个最优节点"""

    def propose_next_steps(state: str, step_num: int) -> List[str]:
        prompt = (
            f"问题：{problem}\n"
            f"当前进度（第 {step_num} 步）：{state}\n\n"
            f"请列出接下来 {branches_per_step} 种可能的推进方向。"
            f"每个方向用一句话描述，用编号 1. 2. 3. 列出。"
        )
        response = llm.invoke(prompt)
        return [
            s.strip() for s in response.split("\n")
            if s.strip() and s[0].isdigit()
        ]

    def evaluate_state(state: str) -> float:
        prompt = (
            f"问题：{problem}\n"
            f"当前方案：{state}\n\n"
            f"请评估这个方案解决上述问题的可能性，"
            f"给出 0.0 到 1.0 的分数。只输出数字，不要解释。"
        )
        try:
            return float(llm.invoke(prompt).strip())
        except ValueError:
            return 0.5

    # BFS 搜索
    frontier = [
        {
            "state": f"初始思路：{problem[:100]}",
            "path": [],
            "depth": 0,
            "score": 0.5,
        }
    ]

    for depth in range(max_depth):
        candidates = []
        for node in frontier:
            next_states = propose_next_steps(node["state"], depth)
            for ns in next_states[:branches_per_step]:
                full_state = f"{node['state']} -> {ns}"
                score = evaluate_state(full_state)
                candidates.append({
                    "state": full_state,
                    "path": node["path"] + [ns],
                    "depth": depth + 1,
                    "score": score,
                })

        # 按评分排序，保留 top_k
        candidates.sort(key=lambda x: x["score"], reverse=True)
        frontier = candidates[:top_k]

        # 提前终止：如果最高分已超过阈值
        if frontier and frontier[0]["score"] > 0.9:
            break

    return frontier
```

### 什么时候 ToT 值得？

我在项目中总结的经验阈值——评估你的任务是否适合 ToT：

```
任务复杂性 = 推理步骤数 x 每步分支数

ToT 有优势的条件：
  - 任务可分解为 3-8 个独立决策步骤
  - 每个步骤有 2-5 个合理选项
  - 中间状态可被有效评估（评估器是关键瓶颈）
  - 错误的早期决策会显著影响最终结果

ToT 不划算的条件：
  - 步骤之间高度耦合（前一步的选择影响后一步的选项空间）
  - 评估器本身不可靠（评估不准导致搜索方向偏斜）
  - 任务本身只需要 1-2 步推理（CoT 或 ReAct 就够了）
```

---

## 4. 决策框架：如何选择推理模式

我构建了一个简单的路由逻辑，根据任务特征动态选择推理模式：

```python
from dataclasses import dataclass


@dataclass
class TaskProfile:
    needs_tools: bool       # 是否需要调用外部工具
    step_count: int         # 估计的推理步骤数
    branching: int          # 每步的可行分支数
    latency_budget: float   # 容忍的最大延迟（秒）
    cost_sensitivity: float # 0=不敏感, 1=极度敏感


def select_reasoning_mode(profile: TaskProfile) -> str:
    """根据任务画像选择最优推理模式"""
    if not profile.needs_tools:
        if profile.step_count <= 1:
            return "direct"
        elif profile.step_count <= 5:
            return "cot"
        else:
            threshold = "cot_self_consistency" if profile.latency_budget > 5 else "cot"
            return threshold

    # 需要工具调用
    if profile.branching > 1 and profile.step_count > 3:
        return "tot" if profile.latency_budget > 10 else "react"

    return "react"
```

这个决策框架的核心原则：

- **优先最低成本**：能用 Direct 就不用 CoT，能用 CoT 就不用 ReAct。每次升级推理模式，token 消耗至少翻 2-3 倍。
- **延迟预算是硬约束**：ToT 的典型延迟在 10-30 秒之间，如果用户侧需要实时响应，直接排除。
- **工具需求是分水岭**：一旦需要调用外部工具，就至少需要 ReAct 级别的模式。

---

## 5. 生产环境的关键考量

### 延迟预算管理

| 模式 | 典型延迟 | token 消耗倍数 | 适用场景 |
|------|---------|---------------|---------|
| Direct | 0.5-2s | 1x | 简单问答、信息提取 |
| CoT | 2-5s | 3-5x | 数学、逻辑推理 |
| CoT + SC | 10-30s | 15-50x | 高准确率要求的推理 |
| ReAct | 3-15s | 5-20x | 工具调用、信息检索 |
| ToT | 15-60s | 20-100x | 复杂规划、架构设计 |

### 成本优化策略

**1. 模型分级路由**

不是所有推理步骤都需要最强模型。我在生产中使用三级路由：

```python
def tiered_reasoning(question: str) -> str:
    profile = classify_task(question)  # 用轻量模型分类
    if profile.complexity == "low":
        return fast_llm.invoke(question)      # Haiku 级别
    elif profile.complexity == "medium":
        return cot(question, balanced_llm)    # Sonnet 级别
    else:
        return react(question, powerful_llm)  # Opus 级别
```

**2. 缓存推理链**

对相同的推理模式，可以将 CoT 链指纹化缓存。例如对于重复的计算类问题，直接返回缓存中的推理模板，大幅降低 token 消耗。

**3. 动态温度调度**

- 探索阶段（搜索分支）：temperature = 0.7-0.9，鼓励多样化
- 收敛阶段（选择最优）：temperature = 0.1-0.2，减少随机性
- 单次推理（CoT）：temperature = 0，保证确定性

### 降级策略

```python
import asyncio


async def reasoning_with_fallback(question: str) -> str:
    """分层降级：ToT -> ReAct -> CoT -> Direct"""
    modes = [
        ("tot",  tot_invoke,   30),
        ("react", react_invoke, 15),
        ("cot",  cot_invoke,    5),
        ("direct", direct_invoke, 2),
    ]
    for mode_name, handler, timeout in modes:
        try:
            result = await asyncio.wait_for(handler(question), timeout=timeout)
            if validate_output(result):
                return result
        except (TimeoutError, ValueError) as e:
            print(f"[Fallback] {mode_name} failed: {e}，降级到下一级")
            continue
    return "抱歉，当前无法处理该问题，请稍后重试。"
```

---

## 6. 总结：推理模式不是什么？

最后想说一点容易踩的坑：

- **推理模式不是银弹**。如果你的 LLM 基础能力就不够（比如对领域知识不了解），再强的推理模式也救不了。RAG + 推理模式的组合通常优于纯推理。
- **不要过度工程化**。我见过很多团队一开始就上 ToT + 多 Agent 架构，结果连最简单的问答都做不好。**从 Direct 开始，证明了基线，再逐步升级**。
- **评估先于优化**。没有评估就去优化推理模式是盲目的。先用 200+ 测试集跑出各类模式的 baseline，确认瓶颈确实在推理深度上，再去改模式。

> 推理模式的选择，本质是**在准确性、延迟、成本之间做三角权衡**。没有银弹，只有根据场景做的有意识取舍。
