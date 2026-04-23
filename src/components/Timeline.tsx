import { memo } from 'react';
import { useInView } from './hooks/useInView';

interface TimelineItem { period: string; event: string }
interface Props { list: TimelineItem[] }

const Timeline = memo<Props>(({ list }) => (
  <section id="journey" className="py-28 px-6 bg-[var(--deep)]" aria-labelledby="journey-heading">
    <div className="max-w-6xl mx-auto">
      <div className="section-label">04 — JOURNEY</div>
      <h2 id="journey-heading" className="text-5xl font-bold text-[var(--text)] leading-tight tracking-tight mt-6 mb-16" style={{ fontFamily: 'var(--font-display)' }}>
        经历
      </h2>
      <div className="max-w-2xl">
        {list.map((item, i) => {
          const { ref, v } = useInView();
          return (
            <div
              key={i}
              ref={ref as React.RefObject<HTMLDivElement>}
              className="flex gap-10 py-6 border-b border-[var(--border)] last:border-0"
              style={{ opacity: v ? 1 : 0, transition: `opacity 0.5s ease ${i * 80}ms` }}
            >
              <div className="shrink-0 w-28">
                <span className="text-xs text-[var(--cyan)]" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{item.period}</span>
              </div>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">{item.event}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
));

export default Timeline;
