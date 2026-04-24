#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP客户端实现
"""
import asyncio
import aiohttp
import json
from typing import Dict, Any, Optional


class MCPClient:
    def __init__(self, server_url: str = "http://localhost:8000"):
        """初始化MCP客户端"""
        self.server_url = server_url
        self.session = None
    
    async def initialize(self):
        """初始化会话"""
        self.session = aiohttp.ClientSession()
    
    async def close(self):
        """关闭会话"""
        if self.session:
            await self.session.close()
    
    async def call_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """调用工具"""
        if not self.session:
            await self.initialize()
        
        url = f"{self.server_url}/api/tools/{tool_name}"
        
        try:
            async with self.session.post(
                url,
                json=parameters,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    return {
                        "success": False,
                        "error": f"HTTP {response.status}",
                        "data": None
                    }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    async def list_tools(self) -> Dict[str, Any]:
        """列出所有可用工具"""
        if not self.session:
            await self.initialize()
        
        url = f"{self.server_url}/api/tools"
        
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    return {
                        "success": False,
                        "error": f"HTTP {response.status}",
                        "tools": []
                    }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "tools": []
            }
    
    async def health_check(self) -> Dict[str, Any]:
        """健康检查"""
        if not self.session:
            await self.initialize()
        
        url = f"{self.server_url}/health"
        
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    return {
                        "status": "error",
                        "message": f"HTTP {response.status}"
                    }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }


async def main():
    """示例使用"""
    client = MCPClient()
    
    try:
        # 健康检查
        health = await client.health_check()
        print("Health check:", health)
        
        # 列出工具
        tools = await client.list_tools()
        print("Available tools:", tools)
        
        # 调用工具（示例）
        if tools.get("success", False):
            # 假设存在calculator工具
            result = await client.call_tool("calculator", {"expression": "25 * 4 + 10"})
            print("Calculator result:", result)
            
            # 假设存在web_search工具
            result = await client.call_tool("web_search", {"query": "AI agents"})
            print("Web search result:", result)
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
