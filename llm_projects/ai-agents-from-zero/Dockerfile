# 使用Python 3.9作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件
COPY . /app

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 设置环境变量
ENV PYTHONUNBUFFERED=1
ENV OPENAI_API_KEY=your_api_key

# 暴露端口
EXPOSE 8000

# 运行应用
CMD ["uvicorn", "src.mcp.server:app", "--host", "0.0.0.0", "--port", "8000"]
