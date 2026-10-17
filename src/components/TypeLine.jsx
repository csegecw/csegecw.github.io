import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../arrow';

/**
 * Types `text` out one character at a time behind a blinking block caret, like a terminal.
 * The untyped rest is rendered transparent so the paragraph keeps its final size from the start.
 */
export default function TypeLine({ text, delay = 0, speed = 26, className = '' }) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let timer = 0;
    let n = 0;
    const step = () => {
      n += 1;
      setCount(n);
      if (n < text.length) timer = setTimeout(step, speed);
    };
    timer = setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span className="type-caret" />
        <span className="type-rest">{text.slice(count)}</span>
      </span>
    </p>
  );
}
