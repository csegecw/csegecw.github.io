import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import AceLogo from './components/AceLogo';
import Ticker from './components/Ticker';
import TypeLine from './components/TypeLine';
import { prefersReducedMotion } from './arrow';
import { site } from './content';

// Clicking the logo inverts the page, wiping out in a circle from where it was clicked.
function useInvert() {
  const [inverted, setInverted] = useState(false);

  const toggle = (x, y) => {
    // Applied synchronously, so the view transition captures the new colours.
    const flip = () => {
      const root = document.documentElement;
      const next = root.dataset.theme !== 'inverted';
      if (next) root.dataset.theme = 'inverted';
      else delete root.dataset.theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#0a0a0a' : '#ffffff');
      flushSync(() => setInverted(next));
    };
    if (!document.startViewTransition || prefersReducedMotion()) {
      flip();
      return;
    }
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(flip);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(0.2, 0.7, 0.1, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  };

  return [inverted, toggle];
}

export default function App() {
  const pageRef = useRef(null);
  const logoRef = useRef(null);
  const [inverted, toggleInvert] = useInvert();

  // Feed the pointer position to CSS for the lit-up dots.
  useEffect(() => {
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = pageRef.current.getBoundingClientRect();
        pageRef.current.style.setProperty('--mx', `${e.clientX - box.left}px`);
        pageRef.current.style.setProperty('--my', `${e.clientY - box.top}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const onLogoClick = (e) => {
    const button = logoRef.current;
    // Restart the arrow's press animation.
    button.classList.remove('is-clicking');
    void button.offsetWidth;
    button.classList.add('is-clicking');

    const box = button.getBoundingClientRect();
    const fromKeyboard = e.detail === 0;
    toggleInvert(fromKeyboard ? box.left + box.width / 2 : e.clientX, fromKeyboard ? box.top + box.height / 2 : e.clientY);
  };

  return (
    <div className="page" ref={pageRef}>
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
        <button
          ref={logoRef}
          type="button"
          className="logo-button"
          onClick={onLogoClick}
          onAnimationEnd={(e) => e.animationName === 'press' && logoRef.current.classList.remove('is-clicking')}
          aria-pressed={inverted}
          aria-label="ACE logo. Invert colours"
        >
          <AceLogo interactive className="hero-logo" title="ACE logo" />
        </button>

        <p className="hero-name" aria-hidden="true">
          {site.fullName}
        </p>
        <p className="hero-college">{site.college}</p>

        <TypeLine className="hero-tagline" text={site.tagline} delay={1500} />

        <p className="hint" aria-hidden="true">
          {site.hint}
        </p>
      </main>

      <footer className="foot">
        <Ticker items={site.ticker} />
      </footer>
    </div>
  );
}
