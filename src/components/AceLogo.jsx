import { useEffect, useId, useRef, useState } from 'react';
import { arrowPath, prefersReducedMotion } from '../arrow';

// Geometry traced from the original 640 x 640 logo artwork.
const VIEW = '118 188 392 300';
const BASELINE = 381;
const FONT_SIZE = 205;
const LETTERS = [
  { ch: 'a', x: 128 },
  { ch: 'c', x: 236 },
  { ch: 'e', x: 378 },
];
const ARROW = arrowPath(213, 203);

// Where the arrow flies in from, and how far it may lean towards the pointer.
const INTRO_OFFSET = { x: 300, y: 340 };
const LEAN = 16;

function Letters({ className = '' }) {
  return LETTERS.map((l, i) => (
    <text key={l.ch} className={`ace-letter ${className}`} style={{ '--i': i }} x={l.x} y={BASELINE}>
      {l.ch}
    </text>
  ));
}

/**
 * The ACE logo, drawn as SVG. Where the arrow and the letters overlap the colour inverts,
 * done with two masks (letters minus arrow, arrow minus letters) so it works in any colour.
 * When `interactive`, the arrow flies in on load and then leans towards the pointer.
 */
export default function AceLogo({ interactive = false, className = '', title = 'ACE' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const maskArrow = useRef(null);
  const drawnArrow = useRef(null);
  const svgRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Wait for the logo font so the letters never flash in a fallback face.
  useEffect(() => {
    let alive = true;
    const done = () => alive && setReady(true);
    if (document.fonts?.load) document.fonts.load(`700 ${FONT_SIZE}px Jost`).then(done, done);
    else done();
    const fallback = setTimeout(done, 2500);
    return () => {
      alive = false;
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!interactive || !ready) return;
    const reduce = prefersReducedMotion();
    const pointer = { x: null, y: null };
    let x = reduce ? 0 : INTRO_OFFSET.x;
    let y = reduce ? 0 : INTRO_OFFSET.y;
    let frame = 0;

    const apply = () => {
      const t = `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
      maskArrow.current?.setAttribute('transform', t);
      drawnArrow.current?.setAttribute('transform', t);
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = null;
      pointer.y = null;
    };

    const tick = () => {
      let tx = 0;
      let ty = 0;
      const box = svgRef.current?.getBoundingClientRect();
      if (box && pointer.x !== null) {
        const nx = (pointer.x - (box.left + box.width / 2)) / window.innerWidth;
        const ny = (pointer.y - (box.top + box.height / 2)) / window.innerHeight;
        tx = Math.max(-1, Math.min(1, nx * 2)) * LEAN;
        ty = Math.max(-1, Math.min(1, ny * 2)) * LEAN;
      }
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      apply();
      frame = requestAnimationFrame(tick);
    };

    apply();
    if (reduce) return undefined;

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    // Let the letters rise first, then bring the arrow in.
    const start = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, 550);

    return () => {
      clearTimeout(start);
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [interactive, ready]);

  const startTransform = interactive && ready && !prefersReducedMotion() ? `translate(${INTRO_OFFSET.x} ${INTRO_OFFSET.y})` : undefined;

  return (
    <svg
      ref={svgRef}
      className={`ace-logo ${ready ? 'is-ready' : ''} ${interactive ? 'is-interactive' : ''} ${className}`}
      viewBox={VIEW}
      role="img"
      aria-label={title}
    >
      <defs>
        <mask id={`${uid}-no-arrow`} maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="640">
          <rect x="0" y="0" width="640" height="640" fill="#fff" />
          <g className="ace-press">
            <path ref={maskArrow} d={ARROW} fill="#000" transform={startTransform} />
          </g>
        </mask>
        <mask id={`${uid}-no-letters`} maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="640">
          <rect x="0" y="0" width="640" height="640" fill="#fff" />
          <g fill="#000" className="ace-type">
            <Letters />
          </g>
        </mask>
      </defs>

      <g mask={`url(#${uid}-no-arrow)`} fill="currentColor" className="ace-type">
        <Letters />
      </g>
      <g mask={`url(#${uid}-no-letters)`}>
        <g className="ace-press">
          <path ref={drawnArrow} className="ace-arrow" d={ARROW} fill="currentColor" transform={startTransform} />
        </g>
      </g>
    </svg>
  );
}
