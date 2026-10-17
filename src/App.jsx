import AceLogo from './components/AceLogo';
import Cursor from './components/Cursor';
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
      </main>

      <footer className="foot">
        <Ticker items={site.ticker} />
      </footer>
    </div>
  );
}
