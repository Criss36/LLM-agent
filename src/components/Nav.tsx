import { useState, useCallback, useEffect, memo } from 'react';
import { useTheme } from './hooks/useTheme';

const THEMES = [
  { key: 'dark' as const, label: '暗' },
  { key: 'light' as const, label: '亮' },
  { key: 'system' as const, label: '自动' },
];

const NAV_ITEMS = [
  { id: 'projects', label: '项目' },
  { id: 'writing', label: '写作' },
  { id: 'stack', label: '技术栈' },
  { id: 'journey', label: '时间线' },
] as const;

const Nav = memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const onScroll = useCallback(() => setScrolled(window.scrollY > 60), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  // Attach scroll listener once
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[var(--void)]/95 backdrop-blur-md border-b border-[rgba(0,217,255,0.08)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo('top')}
          className="flex items-center gap-3 bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded-sm"
        >
          <div className="relative w-8 h-8 shrink-0">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-[var(--cyan)] text-sm font-bold"
              style={{
                fontFamily: 'var(--font-mono)',
                border: '1px solid rgba(0,217,255,0.5)',
                boxShadow: '0 0 12px rgba(0,217,255,0.25)',
                background: 'rgba(0,217,255,0.05)',
              }}
            >
              C
            </div>
          </div>
          <span className="text-sm font-medium tracking-tight text-[var(--text)] hidden sm:block">Criss36</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="主导航">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="px-4 py-2 text-sm text-[var(--text-2)] hover:text-[var(--cyan)] transition-colors cursor-pointer bg-transparent border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded-sm"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <div
            className="flex items-center rounded-md overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
            role="group"
            aria-label="切换主题"
          >
            {THEMES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`px-3 py-1.5 text-xs transition-all border-0 cursor-pointer focus:outline-none ${
                  theme === key
                    ? 'text-[var(--void)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                  background: theme === key ? 'var(--cyan)' : 'transparent',
                }}
                aria-pressed={theme === key}
              >
                {label}
              </button>
            ))}
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/Criss36"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-2)] hover:text-[var(--cyan)] transition-colors"
            aria-label="GitHub（在新窗口打开）"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 bg-transparent border-0 cursor-pointer p-1"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className={`block w-5 h-px bg-[var(--text-2)] transition-all duration-200 ${
                  menuOpen && i === 0 ? 'rotate-45 translate-y-2' : ''
                } ${menuOpen && i === 1 ? 'opacity-0' : ''} ${menuOpen && i === 2 ? '-rotate-45 -translate-y-2' : ''}`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--deep)] border-t border-[var(--border)] px-6 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="text-left text-sm text-[var(--text-2)] hover:text-[var(--cyan)] py-2.5 bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
});

export default Nav;
