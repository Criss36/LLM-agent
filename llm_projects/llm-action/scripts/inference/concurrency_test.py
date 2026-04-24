#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
高并发测试脚本 for vLLM
"""
import asyncio
import time
import aiohttp
import argparse
import numpy as np
from concurrent.futures import ThreadPoolExecutor


class VLLMConcurrentTester:
    def __init__(self, api_url="http://localhost:8000/v1/completions"):
        self.api_url = api_url
        self.session = None
    
    async def initialize(self):
        """初始化HTTP会话"""
        self.session = aiohttp.ClientSession()
    
    async def close(self):
        """关闭HTTP会话"""
        if self.session:
            await self.session.close()
    
    async def generate(self, prompt, max_tokens=128, temperature=0.7):
        """单个请求生成"""
        data = {
            "model": "meta-llama/Llama-2-7b-hf",
            "prompt": prompt,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": False
        }
        
        start_time = time.time()
        try:
            async with self.session.post(self.api_url, json=data) as response:
                if response.status == 200:
                    result = await response.json()
                    end_time = time.time()
                    return {
                        "success": True,
                        "text": result["choices"][0]["text"],
                        "time": end_time - start_time
                    }
                else:
                    end_time = time.time()
                    return {
                        "success": False,
                        "error": f"HTTP {response.status}",
                        "time": end_time - start_time
                    }
        except Exception as e:
            end_time = time.time()
            return {
                "success": False,
                "error": str(e),
                "time": end_time - start_time
            }
    
    async def test_concurrent(self, prompts, concurrency=10):
        """并发测试"""
        tasks = []
        start_time = time.time()
        
        for i in range(concurrency):
            prompt = prompts[i % len(prompts)]
            task = self.generate(prompt)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks)
        total_time = time.time() - start_time
        
        return results, total_time
    
    def run_load_test(self, prompts, concurrency_levels=[1, 5, 10, 20, 50], iterations=3):
        """运行负载测试"""
        print("Running load test...")
        print(f"API URL: {self.api_url}")
        print(f"Prompts: {len(prompts)}")
        print("=" * 80)
        
        results_summary = []
        
        for concurrency in concurrency_levels:
            print(f"\nTesting concurrency: {concurrency}")
            print("-" * 60)
            
            all_times = []
            all_success = []
            
            for i in range(iterations):
                print(f"Iteration {i+1}/{iterations}")
                
                # 运行并发测试
                results, total_time = asyncio.run(self._run_test(concurrency, prompts))
                
                # 统计结果
                success_count = sum(1 for r in results if r["success"])
                avg_time = total_time / concurrency if concurrency > 0 else 0
                
                all_times.append(avg_time)
                all_success.append(success_count / concurrency)
                
                print(f"  Time: {total_time:.2f}s, Avg per request: {avg_time:.2f}s, Success: {success_count}/{concurrency}")
            
            # 计算平均值
            avg_avg_time = np.mean(all_times)
            avg_success_rate = np.mean(all_success)
            
            results_summary.append({
                "concurrency": concurrency,
                "avg_time_per_request": avg_avg_time,
                "success_rate": avg_success_rate,
                "throughput": concurrency / avg_avg_time if avg_avg_time > 0 else 0
            })
            
            print(f"\n  Average: {avg_avg_time:.2f}s per request, {avg_success_rate:.2%} success rate")
            print(f"  Throughput: {concurrency / avg_avg_time:.2f} requests/second")
        
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("-" * 80)
        print("Concurrency | Avg Time (s) | Success Rate | Throughput (req/s)")
        print("-" * 80)
        
        for result in results_summary:
            print(f"{result['concurrency']:11} | {result['avg_time_per_request']:12.2f} | {result['success_rate']:12.2%} | {result['throughput']:16.2f}")
        
        return results_summary
    
    async def _run_test(self, concurrency, prompts):
        """单次测试"""
        if self.session is None:
            await self.initialize()
        
        return await self.test_concurrent(prompts, concurrency)


def main():
    parser = argparse.ArgumentParser(description="vLLM High Concurrency Tester")
    parser.add_argument("--api-url", default="http://localhost:8000/v1/completions",
                      help="vLLM API URL")
    parser.add_argument("--prompts", default=["Hello, how are you?", "Tell me about AI", "What's the weather like?"],
                      nargs="*", help="Test prompts")
    parser.add_argument("--concurrency", default=[1, 5, 10, 20],
                      nargs="*", type=int, help="Concurrency levels")
    parser.add_argument("--iterations", default=3, type=int, help="Iterations per concurrency level")
    
    args = parser.parse_args()
    
    # 确保有足够的测试提示
    if len(args.prompts) < max(args.concurrency):
        # 复制提示以确保足够
        while len(args.prompts) < max(args.concurrency):
            args.prompts.extend(args.prompts)
    
    tester = VLLMConcurrentTester(args.api_url)
    
    try:
        asyncio.run(tester.initialize())
        tester.run_load_test(
            prompts=args.prompts,
            concurrency_levels=args.concurrency,
            iterations=args.iterations
        )
    finally:
        asyncio.run(tester.close())


if __name__ == "__main__":
    main()
