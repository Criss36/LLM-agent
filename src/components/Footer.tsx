import { memo } from 'react';

const Footer = memo(() => (
  <footer className="py-10 px-6 border-t border-[var(--border)]" role="contentinfo">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <p className="text-xs text-[var(--text-3)]">Criss36 · LLM 应用工程师</p>
        <p className="text-[10px] text-[var(--text-3)] mt-1 uppercase" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          open source · production grade · no bs
        </p>
      </div>
      <div className="flex items-center gap-6 text-xs text-[var(--text-3)]">
        <a href="https://github.com/Criss36" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">
          GitHub
        </a>
        <button
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="hover:text-[var(--cyan)] transition-colors bg-transparent border-0 cursor-pointer focus:outline-none"
        >
          项目
        </button>
        <button
          onClick={() => document.getElementById('writing')?.scrollIntoView({ behavior: 'smooth' })}
          className="hover:text-[var(--cyan)] transition-colors bg-transparent border-0 cursor-pointer focus:outline-none"
        >
          写作
        </button>
      </div>
    </div>
  </footer>
));

export default Footer;
