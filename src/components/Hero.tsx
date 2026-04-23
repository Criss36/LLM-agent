import { useState, useEffect, memo } from 'react';
import { useInView } from './hooks/useInView';
import { useTyping } from './hooks/useTyping';

const STATS = [
  { num: '3+', label: 'years llm dev' },
  { num: '91%', label: 'rag recall' },
  { num: '5×', label: 'throughput gain' },
  { num: '<120ms', label: 'p95 latency' },
] as const;

const Hero = memo(() => {
  const [started, setStarted] = useState(false);
  const { v } = useInView({ threshold: 0.05 });
  const typed = useTyping(
    '> systems initialized. building production-ready llm applications.',
    38,
    started
  );

  useEffect(() => { if (v) setStarted(true); }, [v]);

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center bg-grid bg-grid-radial overflow-hidden"
      aria-label="个人介绍"
    >
      {/* Radial glow top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,217,255,0.07) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-36 pb-20">
        {/* Terminal block */}
        <div
          className="terminal mb-12 max-w-2xl"
          style={{
            opacity: v ? 1 : 0,
            transform: v ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 100ms',
          }}
        >
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-r" />
            <span className="terminal-dot terminal-dot-y" />
            <span className="terminal-dot terminal-dot-g" />
            <span className="terminal-title">CRISS36.SYS — v2.4.1</span>
          </div>
          <div className="terminal-body">
            <span className="text-[var(--text-3)]">$ </span>
            <span className="text-[var(--cyan)]">{typed}</span>
            <span className="cursor-blink text-[var(--cyan)]"> ▋</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{
          opacity: v ? 1 : 0,
          transform: v ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 1s ease 300ms',
        }}>
          <div className="section-label mb-8">LLM 应用工程师</div>

          <h1
            className="font-bold leading-[0.95] tracking-[-0.03em] mb-8 text-balance"
            style={{ fontSize: 'var(--text-hero)', fontFamily: 'var(--font-display)' }}
          >
            搭生产级
            <br />
            <span className="text-gradient">LLM 系统</span>
          </h1>

          <p className="text-[var(--text-2)] text-lg max-w-xl leading-relaxed mb-10">
            不是 Demo。是有数字、有源码、有踩坑记录的完整系统。基于 RAGFlow · CrewAI · vLLM 等真实生产实践。
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="btn-primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              看项目
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <a
              href="https://github.com/Criss36"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          style={{ opacity: v ? 1 : 0, transition: 'opacity 0.8s ease 600ms' }}
        >
          {STATS.map(({ num, label }) => (
            <div key={label} className="border-glow-cyan rounded-xl px-6 py-5 bg-[var(--surface)]">
              <div className="text-2xl font-bold text-[var(--cyan)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {num}
              </div>
              <div className="text-[10px] uppercase text-[var(--text-3)]" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-[var(--cyan)] to-transparent" />
      </div>
    </section>
  );
});

export default Hero;
