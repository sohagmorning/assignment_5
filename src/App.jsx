import { useEffect, useState } from 'react';
import { Menu, Star, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const navLinks = ['Home', 'Technologies', 'Projects', 'About', 'Contact'];

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''}`} href="#home" aria-label="Dev Stack home">
      <span className="brand-mark">DS</span>
      <span className="brand-name">Dev<span>Stack</span></span>
    </a>
  );
}

function Header({ isMenuOpen, setIsMenuOpen }) {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <button className="icon-button menu-button" type="button" aria-label="Toggle navigation" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Brand />
        <nav className={`main-nav ${isMenuOpen ? 'main-nav--open' : ''}`} aria-label="Primary navigation">
          {navLinks.map((link) => <a className={link === 'Home' ? 'active' : ''} href={`#${link.toLowerCase()}`} key={link} onClick={() => setIsMenuOpen(false)}>{link}</a>)}
        </nav>
        <div className="auth-actions">
          <button className="text-button" type="button">Sign In</button>
          <button className="gradient-button gradient-button--small" type="button">Sign Up</button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" id="home">
      <div className="hero-copy">
        <p className="eyebrow">THE DEVELOPER TOOLKIT</p>
        <h1>Build Your Ideal<br /><span>Development Stack</span></h1>
        <p className="hero-description">Explore frontend, backend, database, and tooling options,<br className="desktop-only" /> compare them side by side, and put together the stack that fits your next project.</p>
        <div className="hero-actions">
          <a className="gradient-button" href="#technologies">Explore Technologies</a>
          <a className="outline-button" href="#about">Learn More</a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true"><img src="/assets/banner-stack.png" alt="" /></div>
    </section>
  );
}

function TechnologyCard({ tech, isAdded, onAdd }) {
  return (
    <article className="tech-card">
      <div className="card-topline">
        <div className="tech-icon"><img src={tech.icon} alt="" /></div>
        <span className={`badge badge--${tech.category.toLowerCase()}`}>{tech.badge}</span>
      </div>
      <h3>{tech.name}</h3>
      <p className="card-description">{tech.description}</p>
      <div className="card-meta">
        <span className="category-chip">{tech.category}</span>
        <span>{tech.difficulty}</span>
        <span className="rating"><Star size={12} fill="currentColor" /> {tech.rating}</span>
      </div>
      <button className={`add-button ${isAdded ? 'add-button--added' : ''}`} type="button" disabled={isAdded} onClick={() => onAdd(tech)}>
        {isAdded ? '✓ Added to Stack' : 'Add to Stack'}
      </button>
    </article>
  );
}

function StackPanel({ stack, onRemove, onRemoveAll }) {
  return (
    <aside className="stack-panel" aria-labelledby="stack-heading">
      <div className="stack-heading">
        <h2 id="stack-heading">Your Stack</h2>
        <p>{stack.length ? `${stack.length} Technology${stack.length === 1 ? '' : 'ies'} Selected` : 'No technologies selected yet.'}</p>
      </div>
      {stack.length === 0 ? (
        <div className="empty-stack">Your stack is empty.</div>
      ) : (
        <div className="stack-items">
          {stack.map((tech) => (
            <div className="stack-item" key={tech.id}>
              <img src={tech.icon} alt="" />
              <div><strong>{tech.name}</strong><small>{tech.category}</small></div>
              <button className="remove-button" type="button" aria-label={`Remove ${tech.name}`} onClick={() => onRemove(tech)}><X size={18} /></button>
            </div>
          ))}
        </div>
      )}
      {stack.length > 0 && <button className="remove-all" type="button" onClick={onRemoveAll}>Remove All</button>}
    </aside>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-main">
        <div className="footer-brand"><Brand compact /><p>Curated tools, technologies, and resources for developers building modern software.</p><div className="social-links"><a href="https://github.com">GitHub</a><a href="https://twitter.com">Twitter</a><a href="https://linkedin.com">LinkedIn</a></div></div>
        <FooterLinks title="Product" links={['Home', 'Technologies', 'Projects']} />
        <FooterLinks title="Company" links={['About', 'Contact', 'Careers']} />
        <FooterLinks title="Legal" links={['Privacy Policy', 'Terms of Service']} />
      </div>
      <div className="container footer-bottom"><span>© 2026 Dev Stack. All rights reserved.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return <div className="footer-links"><h3>{title}</h3>{links.map((link) => <a href={`#${link.toLowerCase().replaceAll(' ', '-')}`} key={link}>{link}</a>)}</div>;
}

export default function App() {
  const [technologies, setTechnologies] = useState([]);
  const [stack, setStack] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/data/technologies.json')
      .then((response) => { if (!response.ok) throw new Error('Unable to load technologies'); return response.json(); })
      .then(setTechnologies)
      .catch(() => setLoadError('We could not load the technology list. Please refresh and try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  const addToStack = (tech) => {
    if (stack.some((item) => item.id === tech.id)) { toast.warn(`${tech.name} is already in your stack.`); return; }
    setStack((current) => [...current, tech]);
    toast.success(`${tech.name} added to your stack.`);
  };
  const removeFromStack = (tech) => { setStack((current) => current.filter((item) => item.id !== tech.id)); toast.info(`${tech.name} removed from your stack.`); };
  const removeAll = () => { setStack([]); toast.info('Your stack has been cleared.'); };

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Hero />
        <section className="technologies-section container" id="technologies">
          <div className="section-heading"><div><p className="eyebrow">CURATE YOUR TOOLKIT</p><h2>Explore the <span>Technologies</span></h2><p>Pick the right technology for every layer of your next project.</p></div></div>
          {isLoading && <div className="loading-state"><span className="spinner" /> Loading technologies...</div>}
          {loadError && <div className="error-state">{loadError}</div>}
          {!isLoading && !loadError && <div className="content-layout"><div className="technology-grid">{technologies.map((tech) => <TechnologyCard key={tech.id} tech={tech} isAdded={stack.some((item) => item.id === tech.id)} onAdd={addToStack} />)}</div><StackPanel stack={stack} onRemove={removeFromStack} onRemoveAll={removeAll} /></div>}
        </section>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2400} hideProgressBar theme="light" />
    </>
  );
}
