# 高并发测试指南

## 功能说明

本目录包含大模型推理服务的高并发测试工具，用于测试vLLM等推理服务的性能和稳定性。

## 测试工具

### concurrency_test.py

**功能**: 测试vLLM API的高并发性能

**特点**:
- 支持多并发级别测试
- 统计平均响应时间
- 计算成功率
- 计算吞吐量 (requests/second)
- 支持多次迭代取平均值

**使用方法**:

```bash
# 基本用法
python concurrency_test.py

# 自定义API URL和并发级别
python concurrency_test.py \
    --api-url http://localhost:8000/v1/completions \
    --concurrency 1 5 10 20 50 \
    --iterations 5

# 自定义测试提示
python concurrency_test.py \
    --prompts "Hello, how are you?" "Tell me about AI" "What's the weather like?"
```

**测试结果示例**:

```
Running load test...
API URL: http://localhost:8000/v1/completions
Prompts: 3
================================================================================

Testing concurrency: 1
------------------------------------------------------------
Iteration 1/3
  Time: 1.23s, Avg per request: 1.23s, Success: 1/1
Iteration 2/3
  Time: 1.19s, Avg per request: 1.19s, Success: 1/1
Iteration 3/3
  Time: 1.21s, Avg per request: 1.21s, Success: 1/1

  Average: 1.21s per request, 100.00% success rate
  Throughput: 0.83 requests/second

Testing concurrency: 5
------------------------------------------------------------
Iteration 1/3
  Time: 1.87s, Avg per request: 0.37s, Success: 5/5
Iteration 2/3
  Time: 1.92s, Avg per request: 0.38s, Success: 5/5
Iteration 3/3
  Time: 1.89s, Avg per request: 0.38s, Success: 5/5

  Average: 0.38s per request, 100.00% success rate
  Throughput: 13.24 requests/second

SUMMARY
------------------------------------------------------------
Concurrency | Avg Time (s) | Success Rate | Throughput (req/s)
------------------------------------------------------------
          1 |         1.21 |     100.00% |              0.83
          5 |         0.38 |     100.00% |             13.24
```

## 性能优化建议

1. **调整vLLM配置**:
   - `max_model_len`: 根据模型支持的最大上下文长度设置
   - `tensor_parallel_size`: 根据GPU数量设置
   - `gpu_memory_utilization`: 建议设置为0.9

2. **系统优化**:
   - 增加GPU内存
   - 优化网络带宽
   - 使用NVMe SSD作为缓存

3. **负载均衡**:
   - 部署多个vLLM实例
   - 使用Nginx进行负载均衡

## 常见问题

1. **连接超时**:
   - 检查vLLM服务是否正常运行
   - 调整超时设置

2. **内存不足**:
   - 减少并发数
   - 增加GPU内存

3. **响应时间过长**:
   - 检查模型大小
   - 优化提示长度
   - 调整vLLM配置

## 参考资源

- [vLLM Documentation](https://vllm.readthedocs.io/)
- [LLM推理优化技术](https://github.com/liguodongiot/llm-action)
