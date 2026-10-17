import { useEffect, useRef, useState } from 'react';
import { arrowPath, prefersReducedMotion } from '../arrow';

const CURSOR_SCALE = 0.17;
const CURSOR_PATH = arrowPath(0, 0, CURSOR_SCALE);
const HOVER_TARGETS = 'a, button, .pill';

/**
 * The logo's arrow as the mouse cursor. It is white with `mix-blend-mode: difference`,
 * so it inverts whatever it passes over, like the arrow in the logo. Every click or tap
 * also sends out a ring. Touch screens keep their normal behaviour and only get the rings.
 */
export default function Cursor() {
  const ref = useRef(null);
  const [rings, setRings] = useState([]);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = prefersReducedMotion();
    let nextId = 0;

    const onDown = (e) => {
      if (reduce) return;
      const id = nextId++;
      setRings((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });

    if (!fine) {
      return () => window.removeEventListener('pointerdown', onDown);
    }

    const root = document.documentElement;
    root.classList.add('has-cursor');
    const el = ref.current;
    const state = { x: -100, y: -100, tx: -100, ty: -100, s: 1, ts: 1, seen: false };
    let pressed = false;
    let hovering = false;
    let frame = 0;

    const targetScale = () => (pressed ? 0.8 : hovering ? 1.45 : 1);

    const onMove = (e) => {
      state.tx = e.clientX;
      state.ty = e.clientY;
      if (!state.seen) {
        state.seen = true;
        state.x = state.tx;
        state.y = state.ty;
        el.classList.add('is-visible');
      }
      hovering = Boolean(e.target.closest?.(HOVER_TARGETS));
      state.ts = targetScale();
    };
    const onPress = () => {
      pressed = true;
      state.ts = targetScale();
    };
    const onRelease = () => {
      pressed = false;
      state.ts = targetScale();
    };
    const onLeave = () => {
      state.seen = false;
      el.classList.remove('is-visible');
    };

    const follow = reduce ? 1 : 0.38;
    const tick = () => {
      state.x += (state.tx - state.x) * follow;
      state.y += (state.ty - state.y) * follow;
      state.s += (state.ts - state.s) * 0.2;
      el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.s.toFixed(3)})`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPress, { passive: true });
    window.addEventListener('pointerup', onRelease, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove('has-cursor');
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPress);
      window.removeEventListener('pointerup', onRelease);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const removeRing = (id) => setRings((r) => r.filter((ring) => ring.id !== id));

  return (
    <>
      <div className="cursor" ref={ref} aria-hidden="true">
        <svg viewBox="0 0 54 54" width="54" height="54">
          <path d={CURSOR_PATH} />
        </svg>
      </div>
      {rings.map((ring) => (
        <span
          key={ring.id}
          className="click-ring"
          style={{ left: ring.x, top: ring.y }}
          onAnimationEnd={() => removeRing(ring.id)}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
