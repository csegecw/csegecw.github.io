import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../arrow';

function Counter({ value, delay }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (prefersReducedMotion()) {
      el.textContent = value;
      return undefined;
    }
    const duration = 1600;
    const start = performance.now() + delay;
    let frame = 0;
    const step = (now) => {
      const p = Math.min(Math.max((now - start) / duration, 0), 1);
      el.textContent = Math.round(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, delay]);

  return (
    <span className="stat-num" ref={ref}>
      0
    </span>
  );
}

export default function Stats({ items }) {
  return (
    <ul className="stats">
      {items.map((s, i) => (
        <li key={s.label.join(' ')}>
          <Counter value={s.value} delay={1300 + i * 150} />
          <span className="stat-label">
            {s.label[0]}
            <br />
            {s.label[1]}
          </span>
        </li>
      ))}
    </ul>
  );
}
