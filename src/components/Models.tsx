import { memo } from 'react';
import { useInView } from './hooks/useInView';
import type { Model } from '../types';

interface Props {
  list: Model[];
}

const ModelCard = memo<{ model: Model; index: number }>(({ model, index }) => {
  const { ref, v } = useInView();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="p-4 rounded-lg border transition-all duration-500"
      style={{
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 60}ms`,
        borderColor: 'var(--border)',
        background: 'rgba(0, 245, 255, 0.03)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
          {model.name}
        </h3>
        {model.commercial && (
          <span className="text-[9px] px-2 py-0.5 rounded-full" style={{
            fontFamily: 'var(--font-mono)',
            background: 'rgba(52, 211, 153, 0.1)',
            color: '#34d399',
            border: '1px solid rgba(52, 211, 153, 0.2)',
          }}>
            可商用
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] px-2 py-0.5 rounded" style={{
          fontFamily: 'var(--font-mono)',
          background: 'var(--cyan)',
          color: 'var(--void)',
        }}>
          {model.provider}
        </span>
        <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
          {model.params}
        </span>
      </div>
      <div className="text-[11px]" style={{ color: 'var(--text-2)' }}>
        <span style={{ color: 'var(--cyan)' }}>上下文</span>: {model.context}
      </div>
    </div>
  );
});

export default memo<Props>(({ list }) => (
  <section
    id="models"
    className="py-20 px-6 relative"
    aria-labelledby="models-heading"
  >
    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
    <div className="relative max-w-6xl mx-auto">
      <div className="section-label mb-10" id="models-heading">02 — CHINESE LLM MODELS</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((model, i) => (
          <ModelCard key={model.name} model={model} index={i} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href="https://github.com/HqWu-HITCS/Awesome-Chinese-LLM"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          参考 Awesome-Chinese-LLM 查看完整模型列表
        </a>
      </div>
    </div>
  </section>
));