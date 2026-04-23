import { useState, useEffect } from 'react';
import { demos, blogPosts, skills, timeline } from './data/portfolio';

const L = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-medium tracking-[0.12em] text-stone-400 uppercase mb-6">{children}</p>
);

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white text-xs font-bold">C</div>
            <span className="text-sm font-semibold text-stone-800">LLM<span className="text-indigo-600">工具箱</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-stone-500">
            {[['项目','#demos'],['写作','#writing'],['技术栈','#stack'],['时间线','#journey']].map(([label,href]) => (
              <a key={href} href={href} className="hover:text-stone-900 transition-colors">{label}</a>
            ))}
          </div>
          <a href="https://github.com/Criss36" className="text-[13px] text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1">
            GitHub <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-medium mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              open to interesting problems
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold text-stone-900 leading-[1.02] tracking-tight">
              LLM<br /><span className="text-indigo-600">工具箱</span>
            </h1>

            <div className="mt-8 space-y-4 max-w-xl">
              <p className="text-stone-500 text-[15px] leading-relaxed">
                做 LLM 应用开发的工程笔记。不追新，只追能在生产环境里跑的东西。
              </p>
              <p className="text-stone-400 text-sm leading-relaxed">
                基于全球最好的开源项目（RAGFlow · CrewAI · NirDiamant/RAG_Techniques）提炼出真实可落地的 LLM 应用工程方法。
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#demos" className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-colors">
                看项目
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </a>
              <a href="https://github.com/Criss36" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm transition-colors">
                github.com/Criss36 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      {/* ── PROBLEMS ── */}
      <section className="py-28 border-b border-stone-200/70 bg-stone-50/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <L>// 解决了什么问题</L>
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-16">
            真实生产环境里的<br />四个工程问题
          </h2>

          <div className="grid md:grid-cols-2 gap-px bg-stone-200/70 rounded-2xl overflow-hidden border border-stone-200/70">
            {[
              { num: '01', title: 'LLM 不知道业务上下文', body: '私有文档、内部数据、行业知识——LLM 看不到。RAG 是标准解法，但向量检索有天花板。知识图谱 + 混合检索才能真正解决。' },
              { num: '02', title: 'Agent 跑起来不受控', body: 'ReAct 简单有效，但多步任务里错误会累积。Supervisor 模式 + 清晰边界 + MCP 协议是生产级收敛方案。' },
              { num: '03', title: '"看起来对"不等于"对"', body: 'LLM 输出靠直觉不可靠。G-Eval、RAGAS、LLM-as-Judge 才能把质量量化、可复现、可回归。' },
              { num: '04', title: '推理成本失控', body: '800ms 延迟、20 QPS 是开局常见。PagedAttention + Continuous Batching + SLoRA 可以把成本降 5 倍。' },
            ].map(p => (
              <div key={p.num} className="bg-white p-8 lg:p-10">
                <span className="text-[11px] font-mono text-stone-300 font-medium">{p.num}</span>
                <h3 className="mt-2 mb-3 text-base font-semibold text-stone-800">{p.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="demos" className="py-28 border-b border-stone-200/70">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <L>// 01. 项目</L>
          <div className="flex items-end justify-between mb-12 gap-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              每个都跑在<br />生产环境里
            </h2>
            <p className="hidden md:block max-w-xs text-right text-stone-400 text-sm leading-relaxed">
              不是 Demo，是可以上线的系统。有代码、有指标、有踩坑记录。
            </p>
          </div>

          <div className="space-y-5">
            {demos.map((demo, i) => (
              <div key={demo.id} className="group bg-white border border-stone-200/80 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-sm transition-all duration-300">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono text-stone-300 font-medium w-5">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-base font-semibold text-stone-800">{demo.title}</h3>
                      <p className="text-[11px] font-mono text-stone-400 mt-0.5">{demo.titleEn}</p>
                    </div>
                  </div>
                  <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-medium shrink-0 ${demo.status === 'live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
                    {demo.status === 'live' ? '● Live' : demo.status === 'coming' ? '⚡ Soon' : '💡 Concept'}
                  </span>
                </div>
                <p className="text-[15px] text-stone-500 leading-relaxed mb-4">{demo.description}</p>
                {demo.code && (
                  <pre className="bg-stone-50 rounded-xl p-5 text-[12.5px] text-stone-700 font-mono overflow-x-auto mb-5 border border-stone-100 leading-relaxed">
                    <code>{demo.code}</code>
                  </pre>
                )}
                <div className="flex flex-wrap gap-2">
                  {demo.tags.map(tag => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WRITING ── */}
      <section id="writing" className="py-28 border-b border-stone-200/70 bg-stone-50/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <L>// 02. 写作</L>
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-12">
            踩坑复盘与方法提炼
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post, i) => (
              <article key={post.id} className="group bg-white border border-stone-200/80 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-sm transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-mono text-stone-400">{post.date}</span>
                  <span className="text-stone-200 text-xs">·</span>
                  <span className="text-[11px] font-mono text-stone-400">{post.readTime}</span>
                  <span className="ml-auto text-[11px] font-mono text-indigo-400/60">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-semibold text-stone-900 text-[15px] leading-snug mb-3 group-hover:text-indigo-700 transition-colors">{post.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {post.tags.map(t => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium">{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section id="stack" className="py-28 border-b border-stone-200/70">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <L>// 03. 技术栈</L>
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-12">
            用过、踩过、在生产里跑过
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map(skill => (
              <div key={skill.category} className="p-6 rounded-2xl border border-stone-200/80 bg-white">
                <h3 className="text-[11px] font-semibold text-indigo-600 tracking-wide uppercase mb-4">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] text-stone-600">
                      <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section id="journey" className="py-28 border-b border-stone-200/70 bg-stone-50/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <L>// 04. 时间线</L>
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-14">
            从 Demo 到生产系统
          </h2>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-300 via-stone-200 to-transparent" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-14">
                  <div className="absolute left-[13px] top-2.5 w-3 h-3 rounded-full border-2 border-indigo-400 bg-white shadow-[0_0_0_3px_rgba(99,102,241,0.12)]" />
                  <div className="bg-white border border-stone-200/80 rounded-xl p-5 hover:border-indigo-200 transition-colors">
                    <span className="text-[11px] font-mono text-indigo-500/70 font-medium">{item.period}</span>
                    <p className="text-stone-700 text-[14px] mt-1 leading-snug">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 pt-8">
          <div>
            <p className="text-stone-400 text-[12px]">Built with OpenClaw · {new Date().getFullYear()}</p>
            <p className="text-stone-500 text-[12px] mt-1">
              源码：<a href="https://github.com/Criss36/llm-career-portfolio" className="text-indigo-500 hover:text-indigo-700 transition-colors">github.com/Criss36</a>
            </p>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-stone-400">
            <a href="https://github.com/Criss36" className="hover:text-stone-700 transition-colors">GitHub</a>
            <span className="text-stone-300">·</span>
            <a href="#demos" className="hover:text-stone-700 transition-colors">项目</a>
            <span className="text-stone-300">·</span>
            <a href="#writing" className="hover:text-stone-700 transition-colors">写作</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
