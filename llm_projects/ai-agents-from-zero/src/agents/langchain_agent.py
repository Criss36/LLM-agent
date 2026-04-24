#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LangChain智能体实现
"""
from langchain.agents import AgentType, initialize_agent
from langchain.chat_models import ChatOpenAI
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory
import os


class LangChainAgent:
    def __init__(self, model="gpt-4", temperature=0.7):
        """初始化LangChain智能体"""
        self.llm = ChatOpenAI(
            model_name=model,
            temperature=temperature,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.tools = self._init_tools()
        self.agent = self._init_agent()
    
    def _init_tools(self) -> list:
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
        
        tools = [
            Tool(
                name="Calculator",
                func=calculate,
                description="Useful for when you need to calculate mathematical expressions"
            ),
            Tool(
                name="WebSearch",
                func=web_search,
                description="Useful for when you need to search for information on the web"
            )
        ]
        
        return tools
    
    def _init_agent(self):
        """初始化智能体"""
        return initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=True
        )
    
    def run(self, query: str) -> str:
        """运行智能体"""
        try:
            return self.agent.run(query)
        except Exception as e:
            return f"Error: {str(e)}"
    
    def chat(self, messages: list) -> str:
        """多轮对话"""
        try:
            # 构建对话历史
            for msg in messages:
                if msg["role"] == "user":
                    self.memory.chat_memory.add_user_message(msg["content"])
                elif msg["role"] == "assistant":
                    self.memory.chat_memory.add_ai_message(msg["content"])
            
            # 处理最后一条用户消息
            last_message = messages[-1]
            if last_message["role"] == "user":
                return self.agent.run(last_message["content"])
            else:
                return "Please provide a user message"
        except Exception as e:
            return f"Error: {str(e)}"


if __name__ == "__main__":
    # 示例使用
    agent = LangChainAgent()
    
    # 简单查询
    response = agent.run("What is 25 * 4 + 10?")
    print("Response:", response)
    
    # 带工具调用的查询
    response = agent.run("What's the capital of France and what's its population?")
    print("Tool response:", response)
