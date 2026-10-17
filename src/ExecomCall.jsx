import { useState } from 'react';
import AceLogo from './components/AceLogo';
import Ticker from './components/Ticker';
import { execomCall as copy, site } from './content';

const empty = Object.fromEntries(copy.fields.map((f) => [f.key, '']));

export default function ExecomCall() {
  const [values, setValues] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get('website')) return; // honeypot: real people never fill this in
    setStatus('sending');
    try {
      // text/plain keeps this a "simple" request, so the browser skips the CORS preflight Apps Script can't answer.
      const res = await fetch(copy.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error);
      setValues(empty);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="page">
      <header className="nav">
        <a className="nav-mark" href="/" aria-label="ACE home">
          <AceLogo />
        </a>
        <span className="nav-place">{site.place}</span>
      </header>

      <main className="form-wrap">
        {status === 'done' ? (
          <section className="form-card form-done" aria-live="polite">
            <h1 className="form-title">{copy.doneTitle}</h1>
            <p className="form-intro">{copy.doneText}</p>
            <button type="button" className="form-button" onClick={() => setStatus('idle')}>
              {copy.another}
            </button>
          </section>
        ) : (
          <form className="form-card" onSubmit={onSubmit}>
            <h1 className="form-title">{copy.title}</h1>
            <p className="form-intro">{copy.intro}</p>

            {copy.fields.map((f) => (
              <label className="field" key={f.key}>
                <span className="field-label">
                  {f.label}
                  {f.required && <span aria-hidden="true"> *</span>}
                </span>
                {f.type === 'textarea' ? (
                  <textarea value={values[f.key]} onChange={set(f.key)} rows={f.rows} maxLength={2000} />
                ) : (
                  <input
                    type={f.type}
                    value={values[f.key]}
                    onChange={set(f.key)}
                    autoComplete={f.autoComplete}
                    required={f.required}
                    maxLength={200}
                  />
                )}
              </label>
            ))}

            <input className="sr-only" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <button type="submit" className="form-button" disabled={status === 'sending'}>
              {status === 'sending' ? copy.sending : copy.submit}
            </button>
            {status === 'error' && (
              <p className="form-error" role="alert">
                {copy.error}
              </p>
            )}
          </form>
        )}
      </main>

      <footer className="foot">
        <Ticker items={site.ticker} />
      </footer>
    </div>
  );
}
