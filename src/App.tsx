import Nav from './components/Nav';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Writing from './components/Writing';
import Stack from './components/Stack';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import { demos, blogPosts, skills, timeline } from './data/portfolio';

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

      <main id="main">
        <Hero />
        <Projects list={demos} />
        <Writing list={blogPosts} />
        <Stack list={skills} />
        <Timeline list={timeline} />
      </main>

      <Footer />
    </div>
  );
}
