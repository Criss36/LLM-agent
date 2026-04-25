import { useState, memo } from 'react';
import { useInView } from './hooks/useInView';

interface Demo { id: string; title: string; titleEn: string; description: string; tags: string[]; status: string; code?: string }
interface Props { list: Demo[] }

const ProjectCard = memo<{ demo: Demo; index: number }>(({ demo, index }) => {
  const { ref, v } = useInView();
  const [codeOpen, setCodeOpen] = useState(false);

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className="card-project group"
      style={{
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.65s ease ${index * 90}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[var(--text-3)]" style={{ fontFamily: 'var(--font-mono)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          {demo.status === 'live' && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px]"
              style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                color: '#34d399',
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.2)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#34d399', animation: 'glow-pulse 2s ease-in-out infinite' }}
              />
              LIVE
            </span>
          )}
        </div>
        {/* External arrow */}
        <div
          className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5"
          style={{ border: '1px solid var(--border)', color: 'var(--text-3)' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors mb-1 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
        {demo.title}
      </h3>
      <div className="text-[10px] text-[var(--text-3)] mb-4" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
        {demo.titleEn}
      </div>

      {/* Description */}
      <p className="text-[var(--text-2)] text-sm leading-relaxed mb-5">{demo.description}</p>

      {/* Code toggle */}
      {demo.code && (
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setCodeOpen(o => !o)}
            className="flex items-center gap-2 text-xs bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cyan)] rounded-sm px-0 py-0"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--cyan)' }}
            aria-expanded={codeOpen}
          >
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-200 ${codeOpen ? 'rotate-90' : ''}`}
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
            {codeOpen ? 'CLOSE' : 'SHOW_CODE'}
          </button>

          {codeOpen && (
            <pre
              className="mt-3 rounded-lg p-4 text-[11px] leading-relaxed overflow-x-auto"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--void)',
                border: '1px solid var(--border)',
                color: 'var(--text-2)',
              }}
              role="region"
              aria-label="代码示例"
            >
              <code>{demo.code}</code>
            </pre>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {demo.tags.map(tag => (
          <span key={tag} className="tag-chip">{tag}</span>
        ))}
      </div>
    </article>
  );
});

const Projects = memo<Props>(({ list }) => (
  <section
    id="projects"
    className="py-28 px-6 relative"
    aria-labelledby="projects-heading"
  >
    <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div className="relative max-w-6xl mx-auto">
      <div className="section-label mb-10" id="projects-heading">01 — PROJECTS</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {list.map((demo, i) => (
          <ProjectCard key={demo.id} demo={demo} index={i} />
        ))}
      </div>
    </div>
  </section>
));

export default Projects;
