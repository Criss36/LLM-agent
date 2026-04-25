import { useState, useEffect, useRef } from 'react';

export function useInView(opts: { threshold?: number; once?: boolean } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const once = opts.once !== false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setV(false);
        }
      },
      { threshold: opts.threshold ?? 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opts.threshold, opts.once]);
  return { ref, v };
}
