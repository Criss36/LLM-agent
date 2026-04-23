import HeroChat from './components/HeroChat';
import { demos, blogPosts, skills, timeline } from './data/portfolio';

const statusBadge: Record<string, string> = {
  live: 'bg-green-500/20 text-green-400 border border-green-500/30',
  coming: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  concept: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};
const statusLabel: Record<string, string> = { live: '● Live Demo', coming: '⚡ Coming Soon', concept: '💡 Concept' };

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0a14]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">C</div>
            <span className="font-semibold text-sm">Criss36<span className="text-blue-400">/LLM</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#demos" className="hover:text-white transition-colors">Demos</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="https://github.com/Criss36" className="hover:text-white transition-colors">GitHub</a>
            <a href="#contact" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white">简历</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Open to opportunities · 全栈 LLM 工程
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              你好，我是<br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">LLM 应用工程师</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed mb-2">
              专注于 <strong className="text-white">RAG 系统、多 Agent 架构、LLM 推理优化</strong>的实战型 LLM 工程师。<br />
              3 年生产级 AI 项目经验，累计服务<strong className="text-white"> 10,000+ </strong>用户。
            </p>
            <p className="text-gray-500 text-sm mb-8">
              基于 <span className="text-blue-400">liguodongiot/llm-action</span> 知识库构建 · GitHub 1.5k Stars
            </p>
            <div className="flex gap-4">
              <a href="#demos" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors text-sm">
                查看 Demo ↓
              </a>
              <a href="https://github.com/Criss36" className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-xl transition-colors text-sm text-gray-300">
                GitHub
              </a>
            </div>
          </div>
          <div>
            <HeroChat />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/5 bg-[#0f0f1e]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['3+', '年 LLM 开发经验'],
            ['8+', '生产级项目交付'],
            ['10k+', 'AI 产品用户'],
            ['1.5k', 'GitHub Stars'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">{num}</div>
              <div className="text-gray-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMOS ── */}
      <section id="demos" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-mono mb-2">// 02. 技术 Demo</p>
            <h2 className="text-3xl font-bold mb-3">生产级项目展示</h2>
            <p className="text-gray-400 text-sm max-w-xl">每个 Demo 都是完整可运行的系统，附带架构说明、核心代码和部署方案。</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {demos.map(demo => (
              <div key={demo.id} className="bg-[#111128] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/20 flex items-center justify-center text-xl">
                    {demo.id === 'rag-chatbot' ? '🔍' : demo.id === 'agent-workflow' ? '🤖' : demo.id === 'fine-tuning' ? '⚡' : '📊'}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusBadge[demo.status]}`}>{statusLabel[demo.status]}</span>
                </div>
                <h3 className="font-semibold text-base mb-1">{demo.title}</h3>
                <p className="text-blue-400 text-xs font-mono mb-3">{demo.titleEn}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{demo.description}</p>
                {demo.code && (
                  <pre className="bg-black/40 rounded-lg p-3 text-xs text-green-400 font-mono overflow-x-auto mb-4 border border-white/5">
                    <code>{demo.code}</code>
                  </pre>
                )}
                <div className="flex flex-wrap gap-2">
                  {demo.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section id="blog" className="py-20 px-6 bg-[#0f0f1e] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-mono mb-2">// 03. 技术博客</p>
            <h2 className="text-3xl font-bold mb-3">深度复盘与思考</h2>
            <p className="text-gray-400 text-sm">从踩坑经验中提炼的方法论，每篇都是可以写在简历上的真实项目总结。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-[#111128] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">{post.date}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-base mb-2 group-hover:text-blue-400 transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-400 text-sm font-mono mb-2">// 04. 技术栈</p>
            <h2 className="text-3xl font-bold mb-3">全栈 LLM 工程能力</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map(skill => (
              <div key={skill.category} className="bg-[#111128] border border-white/8 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-blue-400 mb-4">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 flex-shrink-0" />
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
      <section className="py-20 px-6 bg-[#0f0f1e] border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-blue-400 text-sm font-mono mb-2">// 05. 成长轨迹</p>
            <h2 className="text-3xl font-bold">项目时间线</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#0f0f1e] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <div className="bg-[#111128] border border-white/8 rounded-xl p-4">
                    <span className="text-xs font-mono text-blue-400">{item.period}</span>
                    <p className="text-white text-sm mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-blue-400 text-sm font-mono mb-3">// 06. 联系方式</p>
          <h2 className="text-3xl font-bold mb-4">正在寻找 LLM 相关机会</h2>
          <p className="text-gray-400 text-sm mb-8">欢迎联系我交流 LLM 技术、探讨合作机会，或索取完整简历。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:criss@example.com" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors text-sm">
              📧 发送邮件
            </a>
            <a href="https://github.com/Criss36" className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-xl transition-colors text-sm text-gray-300">
              GitHub · Criss36
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-600 text-xs">
        <p>Built with OpenClaw · Powered by llm-action knowledge base · {new Date().getFullYear()}</p>
        <p className="mt-1">站点源码：<a href="https://github.com/Criss36/llm-career-portfolio" className="text-blue-500 hover:text-blue-400">Criss36/llm-career-portfolio</a></p>
      </footer>
    </div>
  );
}
