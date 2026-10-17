// Black band along the bottom, echoing the bars on the ACE letterhead.
export default function Ticker({ items }) {
  const run = [...items, ...items];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-run" key={copy}>
            {run.map((text, i) => (
              <span key={`${copy}-${i}`}>
                {text}
                <svg className="ticker-mark" viewBox="0 0 10 10">
                  <path d="M0 0 L10 4.5 L5.5 5.5 L4.5 10 Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
