#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MCP服务器实现
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import uvicorn

# 创建FastAPI应用
app = FastAPI(
    title="MCP Server",
    description="Model Context Protocol Server",
    version="1.0.0"
)

# 工具注册
TOOLS = {
    "calculator": {
        "name": "calculator",
        "description": "Calculate mathematical expressions",
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Mathematical expression to calculate"
                }
            },
            "required": ["expression"]
        }
    },
    "web_search": {
        "name": "web_search",
        "description": "Search the web for information",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query"
                }
            },
            "required": ["query"]
        }
    },
    "file_io": {
        "name": "file_io",
        "description": "Read and write files",
        "parameters": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["read", "write"],
                    "description": "Action to perform"
                },
                "file_path": {
                    "type": "string",
                    "description": "Path to the file"
                },
                "content": {
                    "type": "string",
                    "description": "Content to write (required for write action)"
                }
            },
            "required": ["action", "file_path"]
        }
    }
}

# 工具实现
class CalculatorInput(BaseModel):
    expression: str

class WebSearchInput(BaseModel):
    query: str

class FileIOInput(BaseModel):
    action: str
    file_path: str
    content: str = None

# 健康检查
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "MCP Server is running"}

# 列出工具
@app.get("/api/tools")
def list_tools():
    return {
        "success": True,
        "tools": list(TOOLS.values())
    }

# 计算器工具
@app.post("/api/tools/calculator")
def calculator(input_data: CalculatorInput):
    try:
        expression = input_data.expression
        result = eval(expression)
        return {
            "success": True,
            "data": {
                "expression": expression,
                "result": result
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 网页搜索工具（模拟）
@app.post("/api/tools/web_search")
def web_search(input_data: WebSearchInput):
    try:
        query = input_data.query
        # 模拟搜索结果
        search_results = f"Search results for '{query}': This is a simulated search result."
        return {
            "success": True,
            "data": {
                "query": query,
                "results": search_results
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 文件IO工具
@app.post("/api/tools/file_io")
def file_io(input_data: FileIOInput):
    try:
        action = input_data.action
        file_path = input_data.file_path
        
        if action == "read":
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            return {
                "success": True,
                "data": {
                    "action": action,
                    "file_path": file_path,
                    "content": content
                }
            }
        elif action == "write":
            if input_data.content is None:
                raise HTTPException(status_code=400, detail="Content is required for write action")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(input_data.content)
            return {
                "success": True,
                "data": {
                    "action": action,
                    "file_path": file_path,
                    "message": "File written successfully"
                }
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 主入口
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
