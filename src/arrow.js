// The cursor arrow from the ACE logo, described along its own axis (u = from tip to tail,
// v = sideways) and then rotated to the logo's angle. Shared by the logo and the custom cursor.
const ANGLE = (54 * Math.PI) / 180;

const SHAPE = [
  [0, 0], // tip
  [245, 114], // left wing
  [200, 17], // notch
  [300, 17], // tail
  [300, -17],
  [200, -17], // notch
  [245, -114], // right wing
];

export function arrowPath(tipX = 0, tipY = 0, scale = 1) {
  const c = Math.cos(ANGLE);
  const s = Math.sin(ANGLE);
  const points = SHAPE.map(([u, v], i) => {
    const x = tipX + (u * c - v * s) * scale;
    const y = tipY + (u * s + v * c) * scale;
    return `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return `${points.join(' ')} Z`;
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
