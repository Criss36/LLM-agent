import { memo } from 'react';
import { useInView } from './hooks/useInView';

interface Skill { category: string; items: string[] }
interface Props { list: Skill[] }

const Stack = memo<Props>(({ list }) => (
  <section id="stack" className="py-28 px-6 relative" aria-labelledby="stack-heading">
    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div className="relative max-w-6xl mx-auto">
      <div className="section-label">03 — STACK</div>
      <h2 id="stack-heading" className="text-5xl font-bold text-[var(--text)] leading-tight tracking-tight mt-6 mb-16" style={{ fontFamily: 'var(--font-display)' }}>
        工具链
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {list.map((skill, i) => {
          const { ref, v } = useInView();
          return (
            <div
              key={skill.category}
              ref={ref as React.RefObject<HTMLDivElement>}
              className="border-glow-cyan rounded-xl p-5"
              style={{
                background: 'var(--surface)',
                opacity: v ? 1 : 0,
                transform: v ? 'translateY(0)' : 'translateY(16px)',
                transition: `all 0.5s ease ${i * 60}ms`,
              }}
            >
              <h3 className="text-[10px] uppercase text-[var(--cyan)] tracking-[0.15em] mb-4" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>
                {skill.category}
              </h3>
              <ul className="space-y-2">
                {skill.items.map(item => (
                  <li key={item} className="text-xs text-[var(--text-2)] leading-snug">{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  </section>
));

export default Stack;
