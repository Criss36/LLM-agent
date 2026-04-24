#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
基础智能体实现
"""
import os
import openai
from typing import Dict, Any, List


class BaseAgent:
    def __init__(self, model="gpt-4", temperature=0.7):
        """初始化基础智能体"""
        self.model = model
        self.temperature = temperature
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        openai.api_key = self.api_key
    
    def generate(self, prompt: str, **kwargs) -> str:
        """生成回复"""
        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                **kwargs
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"
    
    def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """多轮对话"""
        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                **kwargs
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"
    
    def with_tools(self, prompt: str, tools: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """带工具调用的生成"""
        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                tools=tools,
                tool_choice="auto",
                temperature=self.temperature
            )
            return response.model_dump()
        except Exception as e:
            return {"error": str(e)}


if __name__ == "__main__":
    # 示例使用
    agent = BaseAgent()
    
    # 简单对话
    response = agent.generate("Tell me about AI agents")
    print("Response:", response)
    
    # 多轮对话
    messages = [
        {"role": "user", "content": "What's the capital of France?"},
        {"role": "assistant", "content": "The capital of France is Paris."},
        {"role": "user", "content": "What's its population?"}
    ]
    response = agent.chat(messages)
    print("Chat response:", response)
