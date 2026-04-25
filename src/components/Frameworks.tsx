import { memo } from 'react';
import { useInView } from './hooks/useInView';
import type { Framework, Evaluation } from '../types';

interface Props {
  frameworks: Framework[];
  evaluations: Evaluation[];
}

const FrameworkCard = memo<{ fw: Framework; index: number }>(({ fw, index }) => {
  const { ref, v } = useInView();
  const typeColors: Record<string, string> = {
    '微调': 'var(--cyan)',
    '推理': '#f59e0b',
    '应用': '#10b981',
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="p-4 rounded-lg border transition-all duration-500"
      style={{
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 50}ms`,
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-[10px] px-2 py-0.5 rounded font-mono"
          style={{
            background: `${typeColors[fw.type]}15`,
            color: typeColors[fw.type],
          }}
        >
          {fw.type}
        </span>
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
        {fw.name}
      </h3>
      <p className="text-[11px]" style={{ color: 'var(--text-2)' }}>
        {fw.description}
      </p>
    </div>
  );
});

const EvalCard = memo<{ item: Evaluation; index: number }>(({ item, index }) => {
  const { ref, v } = useInView();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-500"
      style={{
        opacity: v ? 1 : 0,
        transform: v ? 'translateX(0)' : 'translateX(-20px)',
        transitionDelay: `${index * 80}ms`,
        borderColor: 'var(--border)',
      }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
        background: 'rgba(0, 245, 255, 0.1)',
        color: 'var(--cyan)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
      }}>
        {index + 1}
      </div>
      <div>
        <h4 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
          {item.name}
        </h4>
        <p className="text-[11px]" style={{ color: 'var(--text-2)' }}>
          {item.scope}
        </p>
      </div>
    </div>
  );
});

export default memo<Props>(({ frameworks, evaluations }) => (
  <section
    id="frameworks"
    className="py-20 px-6 relative"
    aria-labelledby="frameworks-heading"
  >
    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div className="relative max-w-6xl mx-auto">
      {/* Frameworks Section */}
      <div className="mb-16">
        <div className="section-label mb-8" id="frameworks-heading">03 — FRAMEWORKS & TOOLS</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {frameworks.map((fw, i) => (
            <FrameworkCard key={fw.name} fw={fw} index={i} />
          ))}
        </div>
      </div>

      {/* Evaluations Section */}
      <div>
        <div className="section-label mb-8">04 — BENCHMARKS</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {evaluations.map((item, i) => (
            <EvalCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  </section>
));