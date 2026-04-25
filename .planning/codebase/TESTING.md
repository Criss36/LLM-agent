# Testing Patterns

**分析日期：** 2026-04-25

## 测试框架

**运行器：**
- **无测试框架已安装或配置**
- `package.json` 中无测试运行器依赖（无 Vitest、Jest、Playwright 等）
- `package.json` 的 `scripts` 中无测试命令

**断言库：**
- 未检测到断言库

**运行命令：**
```bash
# 无测试命令可用
# 仅有的脚本命令：
npm run dev              # 开发服务器
npm run build            # 生产构建（tsc -b && vite build）
npm run lint             # ESLint（当前因缺少配置而失败）
npm run preview          # 预览生产构建
```

## 测试文件组织

**位置：**
- 无测试目录或测试文件存在
- 已搜索 `src/` 和项目根目录中的 `*.test.*`、`*.spec.*`、`__tests__/`，均未找到

**命名：**
- 不适用 — 无测试文件

**结构：**
```
不适用 — 无测试目录存在
```

## 测试结构

**套件组织：**
- 无测试套件存在

**模式：**
- 未建立设置、清理或断言模式

## Mocking

**框架：**
- 未安装 mocking 库

**模式：**
- 未建立 mocking 模式

## Fixtures 和 Factories

**测试数据：**
- 数据定义在 `src/data/portfolio.ts` 中，包含 `Demo[]`、`BlogPost[]`、`Skill[]`、`Model[]`、`Framework[]`、`Evaluation[]`、`TimelineEvent[]` 数组
- 这些数据源可用于测试，但当前无测试使用它们

**位置：**
- `src/data/portfolio.ts` — 项目数据结构的主数据源

## 覆盖率

**要求：** 未设置覆盖率目标 — 无覆盖率工具已安装或配置

**查看覆盖率：**
```bash
# 无覆盖率命令可用
```

## 测试类型

**单元测试：**
- **无** — 未建立

**集成测试：**
- **无** — 未建立

**E2E 测试：**
- **无** — 未建立。Playwright 未配置为依赖

## 可测试性分析

**现有代码中可测试的元素：**

| 模块 | 文件 | 可测试性 |
|-----------|------|--------------|
| Custom hooks | `src/components/hooks/useTheme.ts` | 高 — 纯逻辑，无 DOM 依赖 |
| Custom hooks | `src/components/hooks/useTyping.ts` | 高 — 纯状态逻辑 |
| Custom hooks | `src/components/hooks/useInView.ts` | 中 — 需要 IntersectionObserver mock |
| Data constants | `src/data/portfolio.ts` | 高 — 纯数据，可被测试验证 |
| Type definitions | `src/types/index.ts` | 高 — 接口可被导入并用于类型检查测试 |
| Components | `src/components/*.tsx` | 中 — 需要 React 测试库（@testing-library/react） |
| HeroChat interaction | `src/components/HeroChat.tsx` | 中 — 包含计时器交互和异步更新 |

## 推荐设置

要为项目添加测试覆盖，需要以下依赖和配置：

**所需依赖：**
```
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**推荐 Vitest 配置**（添加到 `vite.config.ts`）：
```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

**推荐测试命令**（添加到 `package.json`）：
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

**应优先测试的文件**（按优先级排序）：
1. `src/components/hooks/useTheme.ts` — 最简单的纯逻辑
2. `src/components/hooks/useTyping.ts` — 纯时间驱动逻辑
3. `src/components/hooks/useInView.ts` — 需要 IntersectionObserver mock
4. `src/data/portfolio.ts` — 数据完整性测试
5. `src/components/*.tsx` — 组件渲染测试

---

*测试分析：2026-04-25*
