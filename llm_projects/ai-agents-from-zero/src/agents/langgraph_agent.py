#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LangGraph智能体实现
"""
from langgraph.graph import StateGraph, END
from langgraph.graph.state import CompiledStateGraph
from typing import Dict, Any, TypedDict, Optional
import os
from langchain.chat_models import ChatOpenAI
from langchain.tools import Tool


class AgentState(TypedDict):
    """智能体状态"""
    question: str
    answer: Optional[str]
    tool_calls: Optional[list]
    tool_results: Optional[list]


class LangGraphAgent:
    def __init__(self, model="gpt-4", temperature=0.7):
        """初始化LangGraph智能体"""
        self.llm = ChatOpenAI(
            model_name=model,
            temperature=temperature,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.tools = self._init_tools()
        self.graph = self._build_graph()
    
    def _init_tools(self) -> dict:
        """初始化工具"""
        # 示例工具：计算工具
        def calculate(expression):
            """计算数学表达式"""
            try:
                result = eval(expression)
                return f"Result: {result}"
            except Exception as e:
                return f"Error: {str(e)}"
        
        # 示例工具：网页搜索（模拟）
        def web_search(query):
            """搜索网页信息"""
            return f"Search results for '{query}': This is a simulated search result."
        
        tools = {
            "Calculator": calculate,
            "WebSearch": web_search
        }
        
        return tools
    
    def _build_graph(self) -> CompiledStateGraph:
        """构建状态图"""
        workflow = StateGraph(AgentState)
        
        # 添加节点
        workflow.add_node("think", self._think_node)
        workflow.add_node("act", self._act_node)
        workflow.add_node("respond", self._respond_node)
        
        # 添加边
        workflow.set_entry_point("think")
        workflow.add_conditional_edges(
            "think",
            self._should_use_tool,
            {
                "use_tool": "act",
                "direct_answer": "respond"
            }
        )
        workflow.add_edge("act", "respond")
        workflow.add_edge("respond", END)
        
        return workflow.compile()
    
    def _think_node(self, state: AgentState) -> AgentState:
        """思考节点"""
        # 这里可以添加更复杂的思考逻辑
        return state
    
    def _should_use_tool(self, state: AgentState) -> str:
        """判断是否需要使用工具"""
        # 简单判断：包含特定关键词时使用工具
        question = state["question"].lower()
        if any(keyword in question for keyword in ["calculate", "compute", "search", "find"]):
            return "use_tool"
        return "direct_answer"
    
    def _act_node(self, state: AgentState) -> AgentState:
        """行动节点"""
        question = state["question"]
        tool_results = []
        
        # 模拟工具调用
        if "calculate" in question.lower() or "compute" in question.lower():
            # 提取数学表达式
            import re
            match = re.search(r'\b(\d+\s*[+\-*/]\s*\d+)\b', question)
            if match:
                expression = match.group(1)
                result = self.tools["Calculator"](expression)
                tool_results.append(result)
        elif "search" in question.lower() or "find" in question.lower():
            # 提取搜索关键词
            query = question.replace("search", "").replace("find", "").strip()
            result = self.tools["WebSearch"](query)
            tool_results.append(result)
        
        return {
            **state,
            "tool_results": tool_results
        }
    
    def _respond_node(self, state: AgentState) -> AgentState:
        """响应节点"""
        question = state["question"]
        tool_results = state.get("tool_results", [])
        
        if tool_results:
            # 使用工具结果生成回答
            prompt = f"Question: {question}\nTool results: {tool_results}\nPlease provide a comprehensive answer."
        else:
            # 直接回答
            prompt = f"Question: {question}\nPlease provide a comprehensive answer."
        
        response = self.llm.predict(prompt)
        
        return {
            **state,
            "answer": response
        }
    
    def run(self, question: str) -> str:
        """运行智能体"""
        try:
            result = self.graph.invoke({"question": question})
            return result.get("answer", "No answer generated")
        except Exception as e:
            return f"Error: {str(e)}"


if __name__ == "__main__":
    # 示例使用
    agent = LangGraphAgent()
    
    # 直接回答的问题
    response = agent.run("Tell me about AI agents")
    print("Direct answer:", response)
    
    # 需要使用工具的问题
    response = agent.run("Calculate 25 * 4 + 10")
    print("Tool answer:", response)
    
    # 搜索问题
    response = agent.run("Search for the capital of France")
    print("Search answer:", response)
