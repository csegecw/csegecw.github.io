import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import AceLogo from './components/AceLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { execomCall as copy, site } from './content';

const empty = Object.fromEntries(copy.fields.map((f) => [f.key, '']));
// Short fields pair up on wide screens; long ones take the full row.
const half = new Set(['sem', 'phone']);

function Field({ field, value, onChange }) {
  const id = `f-${field.key}`;
  let control;
  if (field.type === 'select') {
    control = (
      <Select name={field.key} value={value} onValueChange={onChange} required={field.required}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  } else if (field.type === 'textarea') {
    control = (
      <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={field.rows} maxLength={2000} />
    );
  } else {
    control = (
      <Input
        id={id}
        type={field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={field.autoComplete}
        required={field.required}
        placeholder={field.placeholder}
        maxLength={200}
      />
    );
  }
  return (
    <div className={half.has(field.key) ? 'space-y-2' : 'space-y-2 sm:col-span-2'}>
      <Label htmlFor={id}>
        {field.label}
        {field.required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {control}
    </div>
  );
}

export default function ExecomCall() {
  const [values, setValues] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const set = (key) => (v) => setValues((s) => ({ ...s, [key]: v }));

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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <a href="/" aria-label="ACE home">
            <AceLogo className="h-9 w-auto text-foreground" />
          </a>
          <span className="text-sm text-muted-foreground">{site.place}</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 items-start px-4 py-10 sm:items-center sm:py-16">
        <Card className="w-full gap-0 rounded-none border-0 bg-transparent p-0 shadow-none">
          {status === 'done' ? (
            <>
              <CardHeader className="items-center text-center" aria-live="polite">
                <CheckCircle2 className="mb-2 size-10" aria-hidden="true" />
                <CardTitle className="text-2xl">{copy.doneTitle}</CardTitle>
                <CardDescription>{copy.doneText}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-center">
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  {copy.another}
                </Button>
              </CardFooter>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              <CardHeader>
                <CardTitle className="text-2xl">{copy.title}</CardTitle>
                <CardDescription>{copy.intro}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 py-6 sm:grid-cols-2">
                {copy.fields.map((f) => (
                  <Field key={f.key} field={f} value={values[f.key]} onChange={set(f.key)} />
                ))}
                <input className="sr-only" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-3">
                <Button type="submit" size="lg" disabled={status === 'sending'}>
                  {status === 'sending' && <Loader2 className="size-4" aria-hidden="true" />}
                  {status === 'sending' ? copy.sending : copy.submit}
                </Button>
                {status === 'error' && (
                  <p className="text-center text-sm text-destructive" role="alert">
                    {copy.error}
                  </p>
                )}
              </CardFooter>
            </form>
          )}
        </Card>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        {site.ticker.slice(0, 2).join(' · ')}
      </footer>
    </div>
  );
}
