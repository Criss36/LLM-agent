import { useState, useEffect, useRef } from 'react';

export function useInView(opts: { threshold?: number } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: opts.threshold ?? 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opts.threshold]);
  return { ref, v };
}
