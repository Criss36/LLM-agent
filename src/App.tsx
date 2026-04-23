import { useState, useEffect } from 'react';
import { demos, blogPosts, skills, timeline } from './data/portfolio';

// ── Animated Grid Background ──────────────────────────────────────────────
function GridBG() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050510]" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#6366f1" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050510]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-500/30">C</div>
          <span className="font-semibold text-sm tracking-tight">
            Criss<span className="text-indigo-400">.dev</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          {['Demos', 'Blog', 'Skills', 'About'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">{link}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/Criss36" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub</a>
          <a href="#contact" className="px-4 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-sm text-white transition-all">
            联系我
          </a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs mb-8 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Available for opportunities · 全栈 LLM 工程
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          LLM 应用<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            开发工程师
          </span>
        </h1>
        <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          专注 <span className="text-white font-medium">RAG 系统 · 多 Agent 架构 · LLM 推理优化</span><br />
          3 年生产级 AI 项目实战，服务 <span className="text-indigo-300 font-medium">10,000+ 用户</span>
        </p>
        <p className="text-gray-600 text-sm mb-10 font-mono">
          基于 <span className="text-indigo-400/80">liguodongiot/llm-action</span> 知识库构建
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#demos" className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-medium text-white shadow-xl shadow-indigo-500/20 transition-all text-sm">
            查看项目演示 →
          </a>
          <a href="https://github.com/Criss36" className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm text-gray-300 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub Profile
          </a>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs animate-bounce">
        <span>scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: '3+', label: '年 LLM 开发经验', sub: '生产环境实战' },
    { value: '8+', label: '生产级项目交付', sub: '覆盖 10k+ 用户' },
    { value: '91%', label: 'RAG 召回率', sub: 'RAGAS 评测认证' },
    { value: '180ms', label: 'P95 推理延迟', sub: 'vLLM 优化' },
  ];
  return (
    <section className="relative z-10 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-colors">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-1">{s.value}</div>
              <div className="text-white text-sm font-medium">{s.label}</div>
              <div className="text-gray-600 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Demos ────────────────────────────────────────────────────────────────
function Demos() {
  const statusMap: Record<string, { label: string; cls: string }> = {
    live:   { label: '● Live',  cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    coming:  { label: '⚡ Soon',  cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    concept: { label: '💡 Concept', cls: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
  };
  const icons: Record<string, string> = {
    'rag-chatbot': '🔍', 'agent-workflow': '🤖',
    'fine-tuning': '⚡', 'eval-dashboard': '📊',
  };

  return (
    <section id="demos" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-indigo-400 font-mono text-xs mb-3 tracking-widest uppercase">// 01. Projects</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">生产级项目</h2>
          <p className="text-gray-500 text-sm max-w-lg">每个项目都有完整代码、架构文档和可运行的 Demo，面试时可以当场演示。</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {demos.map(demo => {
            const st = statusMap[demo.status];
            return (
              <div key={demo.id} className="group relative bg-[#0d0d1f] border border-white/8 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden">
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-600/[0.05] to-purple-600/[0.05]" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center text-2xl">
                      {icons[demo.id] ?? '🔧'}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-1">{demo.title}</h3>
                  <p className="text-indigo-400/80 text-xs font-mono mb-4">{demo.titleEn}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{demo.description}</p>
                  {demo.code && (
                    <pre className="bg-black/50 rounded-xl p-4 text-xs text-emerald-400/80 font-mono overflow-x-auto mb-5 border border-white/5 leading-relaxed">
                      <code>{demo.code}</code>
                    </pre>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {demo.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] text-gray-500 border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Blog ─────────────────────────────────────────────────────────────────
function Blog() {
  return (
    <section id="blog" className="relative z-10 py-24 px-6 bg-white/[0.01] border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-indigo-400 font-mono text-xs mb-3 tracking-widest uppercase">// 02. Writing</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">深度技术博客</h2>
          <p className="text-gray-500 text-sm">踩坑复盘、方法提炼、可直接写在简历上的真实项目总结。</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => (
            <article key={post.id} className="group bg-[#0d0d1f] border border-white/8 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-gray-600 font-mono">{post.date}</span>
                <span className="text-gray-800">·</span>
                <span className="text-xs text-gray-600">{post.readTime}</span>
                <span className="ml-auto text-xs text-indigo-400/60 font-mono">0{i+1}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-3 leading-snug group-hover:text-indigo-300 transition-colors">{post.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-5 flex-1 line-clamp-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400/80 border border-indigo-500/15">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-indigo-400 font-mono text-xs mb-3 tracking-widest uppercase">// 03. Stack</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">技术栈</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map(skill => (
            <div key={skill.category} className="bg-[#0d0d1f] border border-white/8 rounded-2xl p-6">
              <h3 className="text-xs font-semibold text-indigo-400 mb-5 tracking-wider uppercase">{skill.category}</h3>
              <ul className="space-y-2.5">
                {skill.items.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Timeline ─────────────────────────────────────────────────────────────
function Timeline() {
  return (
    <section className="relative z-10 py-24 px-6 bg-white/[0.01] border-y border-white/5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-indigo-400 font-mono text-xs mb-3 tracking-widest uppercase">// 04. Journey</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">成长时间线</h2>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-purple-500/40 to-pink-500/20" />
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-indigo-500 bg-[#050510] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                <div className="bg-[#0d0d1f] border border-white/8 rounded-xl p-4 hover:border-indigo-500/20 transition-colors">
                  <span className="text-xs font-mono text-indigo-400/80">{item.period}</span>
                  <p className="text-white text-sm mt-0.5 leading-snug">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="relative z-10 py-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-indigo-400 font-mono text-xs mb-3 tracking-widest uppercase">// 05. Contact</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">正在寻找 LLM 相关机会</h2>
        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
          欢迎联系我交流技术、探讨合作，或索取完整简历。<br />
          <span className="text-gray-600">GitHub · 技术博客 · 在线 Demo</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://github.com/Criss36" className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all text-sm text-white flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            github.com/Criss36
          </a>
          <a href="https://5pobknu2iqlr.space.minimaxi.com" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all text-sm text-white shadow-lg shadow-indigo-500/20">
            🌐 在线 Demo
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-700 text-xs">
        <p>Built with OpenClaw · Powered by liguodongiot/llm-action · {new Date().getFullYear()}</p>
        <p>
          站点源码：<a href="https://github.com/Criss36/llm-career-portfolio" className="text-indigo-500/60 hover:text-indigo-400 transition-colors">Criss36/llm-career-portfolio</a>
        </p>
      </div>
    </footer>
  );
}

// ── App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans antialiased">
      <GridBG />
      <Navbar />
      <Hero />
      <Stats />
      <Demos />
      <Blog />
      <Skills />
      <Timeline />
      <Contact />
      <Footer />
    </div>
  );
}
