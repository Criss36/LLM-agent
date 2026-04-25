import { lazy, Suspense } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Footer from './components/Footer';
import { demos, blogPosts, skills, timeline, models, frameworks, evaluations } from './data/portfolio';

const Models = lazy(() => import('./components/Models'));
const Frameworks = lazy(() => import('./components/Frameworks'));
const Writing = lazy(() => import('./components/Writing'));
const Stack = lazy(() => import('./components/Stack'));
const Timeline = lazy(() => import('./components/Timeline'));

function SectionFallback() {
  return (
    <div className="py-20 px-6" style={{ background: 'var(--void)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="h-4 w-32 rounded" style={{ background: 'var(--surface)', opacity: 0.3 }} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--void)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--cyan)] focus:text-[var(--void)] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
      >
        跳到内容
      </a>

      <Nav />

      <main id="main" style={{ scrollMarginTop: '100px' }}>
        <Hero />
        <Projects list={demos} />
        <Suspense fallback={<SectionFallback />}>
          <Models list={models} />
          <Frameworks frameworks={frameworks} evaluations={evaluations} />
          <Writing list={blogPosts} />
          <Stack list={skills} />
          <Timeline list={timeline} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}