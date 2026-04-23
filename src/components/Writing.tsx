import { memo } from 'react';
import { useInView } from './hooks/useInView';

interface BlogPost { id: string; title: string; excerpt: string; date: string; tags: string[]; readTime: string }
interface Props { list: BlogPost[] }

const BlogItem = memo<{ post: BlogPost; index: number }>(({ post, index }) => {
  const { ref, v } = useInView();
  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className="group py-7 border-b border-[var(--border)] last:border-0"
      style={{ opacity: v ? 1 : 0, transition: `opacity 0.6s ease ${index * 70}ms` }}
    >
      <div className="flex gap-8 items-start">
        <div className="hidden sm:block shrink-0 w-24 pt-1">
          <div className="text-[10px] text-[var(--cyan)] opacity-70" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>{post.date}</div>
          <div className="text-[10px] text-[var(--text-3)] mt-1" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{post.readTime}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors mb-2 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
            {post.title}
          </h3>
          <p className="text-[var(--text-2)] text-sm leading-relaxed mb-4">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
          </div>
          <div className="sm:hidden text-[10px] text-[var(--text-3)] mt-3" style={{ fontFamily: 'var(--font-mono)' }}>
            {post.date} · {post.readTime}
          </div>
        </div>
      </div>
    </article>
  );
});

const Writing = memo<Props>(({ list }) => (
  <section id="writing" className="py-28 px-6 bg-[var(--deep)]" aria-labelledby="writing-heading">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
        <div>
          <div className="section-label">02 — WRITING</div>
          <h2 id="writing-heading" className="text-5xl font-bold text-[var(--text)] leading-tight tracking-tight mt-6 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            踩坑<br />与复盘
          </h2>
          <p className="text-[var(--text-2)] leading-relaxed text-sm">
            不写入门教程。只写实际踩过的坑，和怎么爬出来。
          </p>
        </div>
        <div>
          {list.map((post, i) => <BlogItem key={post.id} post={post} index={i} />)}
        </div>
      </div>
    </div>
  </section>
));

export default Writing;
