import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react';
import AceLogo from './components/AceLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { placement as copy, site } from './content';

const empty = { name: '', email: '', phone: '', sem: '', skills: [], otherSkills: '', achievements: '', consent: false };
const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const readBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

function Field({ id, label, required, hint, className, children }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function Placement() {
  const [values, setValues] = useState(empty);
  const [file, setFile] = useState(null);
  const [fileProblem, setFileProblem] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [step, setStep] = useState(0);
  const [skillsProblem, setSkillsProblem] = useState('');
  const fileRef = useRef(null);
  const last = step === copy.steps.length - 1;

  const set = (key) => (v) => setValues((s) => ({ ...s, [key]: v }));
  const text = (key) => (e) => set(key)(e.target.value);
  const toggleSkill = (skill) =>
    setValues((s) => ({
      ...s,
      skills: s.skills.includes(skill) ? s.skills.filter((x) => x !== skill) : [...s.skills, skill],
    }));

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const okType = fileTypes.includes(f.type) || /\.(pdf|docx?)$/i.test(f.name);
    if (!okType || f.size > copy.maxFileMB * 1024 * 1024) {
      setFile(null);
      setFileProblem(copy.fileError);
      e.target.value = '';
      return;
    }
    setFileProblem('');
    setFile(f);
  };

  const clearFile = () => {
    setFile(null);
    setFileProblem('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const goBack = () => {
    setStatus('idle');
    setStep((n) => Math.max(0, n - 1));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Only the current step's fields are rendered, so native validation covers just this step.
    if (step === 1 && !values.skills.length && !values.otherSkills.trim()) {
      setSkillsProblem(copy.skillsError);
      return;
    }
    setSkillsProblem('');
    if (step === 2 && !file) {
      setFileProblem('Please attach your resume.');
      return;
    }
    if (!last) {
      setStep((n) => n + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const form = new FormData(e.currentTarget);
    if (form.get('website')) return; // honeypot: real people never fill this in
    setStatus('sending');
    try {
      const payload = {
        ...values,
        skills: values.skills.join(', '),
        resume: { name: file.name, type: file.type || 'application/octet-stream', data: await readBase64(file) },
      };
      // text/plain keeps this a "simple" request, so the browser skips the CORS preflight Apps Script can't answer.
      const res = await fetch(copy.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error);
      setValues(empty);
      clearFile();
      setStep(0);
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

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-14">
        {status === 'done' ? (
          <Card className="items-center text-center">
            <CardHeader className="items-center" aria-live="polite">
              <CheckCircle2 className="mb-2 size-10" aria-hidden="true" />
              <CardTitle className="text-2xl">{copy.doneTitle}</CardTitle>
              <CardDescription>{copy.doneText}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => setStatus('idle')}>
                {copy.another}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{copy.title}</h1>
              {step === 0 && (
                <>
                  <p className="text-muted-foreground">{copy.intro}</p>
                  <ul className="space-y-1.5 rounded-lg border bg-secondary/50 p-4 text-sm">
                    {copy.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div aria-label="Progress" className="space-y-2">
              <div className="flex gap-1.5">
                {copy.steps.map((s, i) => (
                  <div key={s.title} className={cn('h-1.5 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-secondary')} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Step {step + 1} of {copy.steps.length}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{copy.steps[step].title}</CardTitle>
                <CardDescription>{copy.steps[step].hint}</CardDescription>
              </CardHeader>

              {step === 0 && (
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <Field id="f-name" label="Full name" required className="sm:col-span-2">
                    <Input id="f-name" value={values.name} onChange={text('name')} autoComplete="name" required maxLength={120} />
                  </Field>
                  <Field id="f-email" label="Email" required>
                    <Input id="f-email" type="email" value={values.email} onChange={text('email')} autoComplete="email" required maxLength={200} />
                  </Field>
                  <Field id="f-phone" label="Phone" required>
                    <Input id="f-phone" type="tel" value={values.phone} onChange={text('phone')} autoComplete="tel" required maxLength={20} />
                  </Field>
                  <Field id="f-sem" label="Sem" required>
                    <Select name="sem" value={values.sem} onValueChange={set('sem')} required>
                      <SelectTrigger id="f-sem" className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {copy.sems.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </CardContent>
              )}

              {step === 1 && (
                <CardContent className="space-y-5">
                  <ul className="grid gap-2 sm:grid-cols-2" aria-label="Skills">
                    {copy.skills.map((s) => {
                      const on = values.skills.includes(s);
                      return (
                        <li key={s}>
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            onClick={() => toggleSkill(s)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                              on ? 'border-primary bg-secondary font-medium' : 'bg-background hover:bg-accent',
                            )}
                          >
                            <span
                              className={cn(
                                'flex size-5 shrink-0 items-center justify-center rounded border',
                                on ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
                              )}
                            >
                              {on && <Check className="size-3.5" aria-hidden="true" />}
                            </span>
                            {s}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <Field id="f-other" label="Other skills">
                    <Input id="f-other" value={values.otherSkills} onChange={text('otherSkills')} placeholder="e.g. Go, Figma, Blender" maxLength={200} />
                  </Field>
                  {skillsProblem && (
                    <p className="text-sm text-destructive" role="alert">
                      {skillsProblem}
                    </p>
                  )}
                </CardContent>
              )}

              {step === 2 && (
                <CardContent className="space-y-5">
                  <Field id="f-resume" label="Resume" required hint={`PDF, DOC or DOCX, up to ${copy.maxFileMB} MB.`}>
                    <input ref={fileRef} id="f-resume" type="file" accept=".pdf,.doc,.docx" onChange={pickFile} className="sr-only" />
                    {file ? (
                      <div className="flex items-center gap-3 rounded-md border p-3 text-sm">
                        <FileText className="size-5 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">{file.name}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={clearFile} aria-label="Remove file">
                          <X className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" className="w-full border-dashed py-6" onClick={() => fileRef.current?.click()}>
                        <Upload className="size-4" aria-hidden="true" />
                        Upload resume
                      </Button>
                    )}
                    {fileProblem && (
                      <p className="text-sm text-destructive" role="alert">
                        {fileProblem}
                      </p>
                    )}
                  </Field>
                  <Field
                    id="f-ach"
                    label="Achievements"
                    hint="Hackathon wins, competitions, projects, certifications, internships, open source."
                  >
                    <Textarea id="f-ach" value={values.achievements} onChange={text('achievements')} rows={5} maxLength={2000} />
                  </Field>
                </CardContent>
              )}

              {step === 3 && (
                <CardContent className="space-y-5">
                  <dl className="divide-y rounded-lg border text-sm">
                    {[
                      ['Name', values.name],
                      ['Email', values.email],
                      ['Phone', values.phone],
                      ['Sem', values.sem],
                      ['Skills', [...values.skills, values.otherSkills].filter(Boolean).join(', ')],
                      ['Resume', file?.name],
                      ['Achievements', values.achievements],
                    ].map(([k, v]) => (
                      <div key={k} className="grid gap-1 px-3 py-2 sm:grid-cols-[8rem_1fr]">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="whitespace-pre-wrap break-words">{v || '—'}</dd>
                      </div>
                    ))}
                  </dl>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      required
                      checked={values.consent}
                      onChange={(e) => set('consent')(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 accent-foreground"
                    />
                    {copy.consent}
                  </label>
                  <input className="sr-only" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                </CardContent>
              )}

              <CardFooter className="justify-between gap-3">
                <Button type="button" variant="outline" onClick={goBack} className={cn(step === 0 && 'invisible')}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  {copy.back}
                </Button>
                {last ? (
                  <Button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                    {status === 'sending' ? copy.sending : copy.submit}
                  </Button>
                ) : (
                  <Button type="submit">
                    {copy.next}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                )}
              </CardFooter>
            </Card>

            {status === 'error' && (
              <p className="text-center text-sm text-destructive" role="alert">
                {copy.error}
              </p>
            )}
          </form>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">{site.ticker.slice(0, 2).join(' · ')}</footer>
    </div>
  );
}
