---
wave: 1
name: 高 ROI 缺陷修复与样式清理
requirements: [PERF-01, PERF-02, STYLE-01]
files_modified:
  - src/components/HeroChat.tsx
  - src/components/hooks/useInView.ts
  - src/index.css
autonomous: true
---

## 目标

修复已识别的 3 个高 ROI 问题：内存泄漏、动画重触发、CSS 重复样式。

## 任务

### 任务 1: 修复 HeroChat.tsx setTimeout 内存泄漏
**文件:** `src/components/HeroChat.tsx`

<read_first>
- src/components/HeroChat.tsx
</read_first>

<action>
已在 `RAGView` 中添加 `useRef<ReturnType<typeof setTimeout>>()` 跟踪定时器，并在 `useEffect` cleanup 中清理。
导入新增: `useRef`, `useEffect`。
验证: `timerRef.current = setTimeout(...)` 存引用，`useEffect(() => () => clearTimeout(timerRef.current), [])` 卸载时清理。
</action>

<acceptance_criteria>
- `src/components/HeroChat.tsx` 包含 `import { useRef, useEffect }` 声明
- `RAGView` 函数内有 `timerRef = useRef<ReturnType<typeof setTimeout>>()`
- `useEffect(() => () => clearTimeout(timerRef.current), [])` 存在
- `setTimeout` 返回值赋值给 `timerRef.current`
- 组件间快速切换 Tab 无 React setState on unmounted component 警告
</acceptance_criteria>

### 任务 2: 修复 useInView hook 支持重复触发
**文件:** `src/components/hooks/useInView.ts`

<read_first>
- src/components/hooks/useInView.ts
</read_first>

<action>
已为 `useInView` 新增 `once` 参数（默认 `true` 保持向后兼容）。
当 `once: false` 时，元素离开视口设置 `v = false`，重新进入再次触发。
改动: `export function useInView(opts: { threshold?: number; once?: boolean } = {})`，新增 `const once = opts.once !== false` 判断。
</action>

<acceptance_criteria>
- `useInView` 函数签名包含 `once?: boolean` 参数
- `opts.once !== false` 默认值为 true
- `once` 为 false 时元素离开视口设置 `setV(false)`
- 现有组件（Hero, Stack, Timeline 等）不受影响（默认 once=true）
</acceptance_criteria>

### 任务 3: 删除 index.css 重复 :focus-visible 规则
**文件:** `src/index.css`

<read_first>
- src/index.css
</read_first>

<action>
已删除第 395-399 行的重复 `:focus-visible` 规则块。
保留第 292 行的原始规则: `outline: 2px solid var(--cyan); outline-offset: 3px; border-radius: 3px;`
</action>

<acceptance_criteria>
- `src/index.css` 中 `:focus-visible` 仅出现一次定义
- `outline: 2px solid var(--cyan)` 保留
- `outline-offset: 3px` 保留
</acceptance_criteria>

## 验证

1. `npm run build` 通过
2. 快速切换导航 Tab，控制台无 React 警告
3. 进入/离开视口区域多次，动画正确重复
4. Tab 遍历焦点样式唯一
