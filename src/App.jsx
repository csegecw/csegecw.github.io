import AceLogo from './components/AceLogo';
import Cursor from './components/Cursor';
import Stats from './components/Stats';
import Ticker from './components/Ticker';
import { site } from './content';

export default function App() {
  return (
    <div className="page">
      <Cursor />

      <header className="nav">
        <a className="nav-mark" href="/" aria-label="ACE home">
          <AceLogo />
        </a>
        <nav aria-label="Main">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <span className="nav-place">{site.place}</span>
      </header>

      <main className="hero">
        <h1 className="sr-only">
          ACE, {site.fullName}, {site.college}
        </h1>
        <AceLogo interactive className="hero-logo" title="ACE logo" />

        <p className="hero-name" aria-hidden="true">
          {site.fullName}
        </p>
        <p className="hero-college">{site.college}</p>

        <p className="hero-tagline">{site.tagline}</p>

        <hr className="dash" />

        <Stats items={site.stats} />
      </main>

      <footer className="foot">
        <ul className="pills" aria-label="What we do">
          {site.tags.map((tag) => (
            <li key={tag} className="pill">
              {tag}
            </li>
          ))}
          <li className="pill pill-more" aria-label="More">
            •••
          </li>
        </ul>
        <Ticker items={site.ticker} />
      </footer>
    </div>
  );
}
