import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronRight, FileText, Info, Scale, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type Law = { slug: string; title: string; short: string; details: string; source: string; tag: string };
const LAWS: Law[] = [
  { slug: 'wages', title: 'Code on Wages, 2019', tag: 'Pay & fairness', short: 'A framework for minimum wages, timely payment, equal remuneration and bonuses.', details: 'The Code consolidates laws on wages and equal remuneration. Entitlements and procedures depend on applicable notifications, rules, worker category and the facts of a case.', source: 'https://www.indiacode.nic.in/indiacode/handle/123456789/15793?view_type=browse' },
  { slug: 'industrial-relations', title: 'Industrial Relations Code, 2020', tag: 'Unions & disputes', short: 'Covers trade unions, standing orders, industrial disputes and related processes.', details: 'The Code addresses industrial relations, including trade union recognition, dispute resolution and specified workplace processes. Applicability depends on establishment and current rules.', source: 'https://www.indiacode.nic.in/indiacode/handle/123456789/22040?view_type=browse' },
  { slug: 'social-security', title: 'Code on Social Security, 2020', tag: 'Benefits & protection', short: 'Brings together provisions concerning social security and benefits for workers.', details: 'The Code covers social security schemes and provisions such as provident fund, insurance, gratuity and maternity benefits for eligible categories. Verify eligibility and implementing rules for your situation.', source: 'https://www.indiacode.nic.in/indiacode/handle/123456789/16823?view_type=browse' },
  { slug: 'osh', title: 'Occupational Safety, Health and Working Conditions Code, 2020', tag: 'Safety at work', short: 'Addresses workplace safety, health, welfare and working conditions.', details: 'The Code covers safety and health duties, welfare, working conditions and specified worker categories. Actual protections can depend on the establishment, role and applicable State/UT rules.', source: 'https://www.indiacode.nic.in/indiacode/handle/123456789/22041?view_type=browse' },
  { slug: 'posh', title: 'Sexual Harassment of Women at Workplace Act, 2013', tag: 'Safe workplace', short: 'Provides a workplace complaint and redressal framework for sexual harassment.', details: 'The Act provides for an Internal Committee in covered workplaces and a Local Committee at district level for specified cases. If you need to report an incident, consider the designated committee or appropriate authority; share sensitive details only through a trusted official channel.', source: 'https://www.indiacode.nic.in/handle/123456789/17057?sam_handle=123456789%2F2490' },
  { slug: 'rpwd', title: 'Rights of Persons with Disabilities Act, 2016', tag: 'Inclusion & access', short: 'Includes equality and non-discrimination provisions relevant to employment.', details: 'The Act includes provisions on equality and non-discrimination, including in employment, and duties for establishments. Specific obligations and remedies depend on the provision and circumstances.', source: 'https://www.indiacode.nic.in/handle/123456789/2155?locale=en' },
  { slug: 'apprentices', title: 'Apprentices Act, 1961', tag: 'Training & apprenticeships', short: 'Sets the framework for apprenticeship training, contracts and responsibilities.', details: 'The Act establishes the apprenticeship training framework and obligations of apprentices and establishments. Check the latest rules and official apprenticeship portal for current eligibility and terms.', source: 'https://www.indiacode.nic.in/indiacode/handle/123456789/1668?col=123456789%2F1362&view_type=search' },
  { slug: 'child-labour', title: 'Child and Adolescent Labour Act, 1986', tag: 'Young workers', short: 'Restricts child employment and regulates adolescent work, including hazardous work.', details: 'The Act prohibits child employment in occupations and processes, with limited statutory exceptions, and prohibits adolescents from hazardous work. Contact the relevant government authority if a child may be at risk.', source: 'https://www.indiacode.nic.in/bitstream/123456789/1848/1/A1986-61.pdf' },
  { slug: 'maternity-reference', title: 'Maternity Benefit Act, 1961 · reference', tag: 'Care & parenthood', short: 'A related historic Act whose subject is now addressed within the Code on Social Security framework.', details: 'This remains a useful reference for understanding maternity protections. Since the Labour Codes took effect, read it together with the Code on Social Security, applicable rules and current notifications; do not assume the older Act alone describes the full current position.', source: 'https://www.indiacode.nic.in/handle/123456789/1681?col=123456789%2F1362' },
  { slug: 'employee-compensation-reference', title: 'Employees’ Compensation Act, 1923 · reference', tag: 'Injury & compensation', short: 'A related historic Act on employment injury compensation, now addressed within the Social Security Code framework.', details: 'The Act historically provided compensation for specified employment injuries. For current rights after the Labour Codes took effect, review the Code on Social Security, implementing rules and applicable notifications alongside this source.', source: 'https://www.indiacode.nic.in/bitstream/123456789/20347/1/a1923-08.pdf' },
];

export const WorkerRights: React.FC = () => {
  const { user } = useAuth();
  const [selectedLaw, setSelectedLaw] = useState(LAWS[0].slug);
  const [kind, setKind] = useState<'query' | 'report'>('query');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'preview'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const law = useMemo(() => LAWS.find(item => item.slug === selectedLaw) ?? LAWS[0], [selectedLaw]);

  const startSubmission = (slug: string) => {
    setSelectedLaw(slug);
    document.getElementById('law-submission')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    if (!isSupabaseConfigured) {
      setStatus({ type: 'preview', text: 'Preview mode: this form is not connected. Configure Supabase and apply the worker-law submissions migration to accept submissions.' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('worker_law_submissions').insert({
      user_id: user?.id ?? null,
      name: name.trim() || null,
      email: email.trim(),
      law_slug: selectedLaw,
      submission_type: kind,
      message: message.trim(),
    });
    setSubmitting(false);
    if (error) {
      setStatus({ type: 'error', text: 'We could not submit this right now. Please try again later or use the official support channel linked above.' });
      return;
    }
    setMessage('');
    setStatus({ type: 'success', text: 'Your message was submitted to the Balance Compass support inbox. This is not an official legal complaint filing.' });
  };

  return <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-950 via-ink-900 to-sage-950 px-6 py-10 text-white shadow-lift sm:px-10 sm:py-14">
        <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-sage-400/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-sage-100"><Scale className="h-4 w-4"/> India · Work & worker rights</div>
          <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">Know your rights at work.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">A plain-language starting point for key Indian workplace laws, with links to the official text and a private way to send our team a question or report.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#laws" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-ink-900 hover:bg-sage-100">Explore the laws <ChevronRight className="h-4 w-4"/></a>
            <a href="https://samadhan.labour.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold hover:bg-white/10">Official labour grievance portal <ArrowUpRight className="h-4 w-4"/></a>
          </div>
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-2xl border border-sage-200 bg-sage-50 p-4 text-sm text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-linen-200">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-sage-700 dark:text-sage-300"/><p><strong>Current framework:</strong> the Ministry of Labour & Employment announced the four Labour Codes came into effect on 21 November 2025. Rules and coverage may vary by State/UT, establishment and worker category. This page is general information, not legal advice. <a className="font-semibold underline underline-offset-2" href="https://labour.gov.in/sites/default/files/pib2192463.pdf" target="_blank" rel="noreferrer">Ministry announcement</a>.</p>
      </section>

      <section id="laws" className="scroll-mt-8 space-y-5">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-sage-700 dark:text-sage-300">The essentials</p><h2 className="mt-2 font-heading text-3xl font-extrabold text-ink-900 dark:text-linen-100">Indian workplace laws</h2><p className="mt-2 max-w-2xl text-sm text-ink-700/70 dark:text-linen-200/70">Start with a short overview, then open the official Act or Code for the full text.</p></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{LAWS.map((item, index) => <article key={item.slug} className="group flex min-h-64 flex-col rounded-3xl border border-sage-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lift dark:border-ink-700 dark:bg-ink-900">
          <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-100 text-sage-800 dark:bg-sage-950 dark:text-sage-200"><FileText className="h-5 w-5"/></span><span className="text-xs font-semibold text-ink-700/45 dark:text-linen-200/45">0{index + 1}</span></div>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">{item.tag}</p><h3 className="mt-2 font-heading text-lg font-bold leading-snug text-ink-900 dark:text-linen-100">{item.title}</h3><p className="mt-2 text-sm leading-6 text-ink-700/70 dark:text-linen-200/70">{item.short}</p><p className="mt-2 text-xs leading-5 text-ink-700/55 dark:text-linen-200/55">{item.details}</p>
          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-sage-100 pt-4 dark:border-ink-800"><a href={item.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-sage-700 hover:underline dark:text-sage-300">Official text <ArrowUpRight className="h-3.5 w-3.5"/></a><button type="button" onClick={() => startSubmission(item.slug)} className="ml-auto text-xs font-bold text-ink-700 hover:text-sage-700 dark:text-linen-200 dark:hover:text-sage-300">Ask / report <ChevronRight className="inline h-3.5 w-3.5"/></button></div>
        </article>)}</div>
      </section>

      <section id="law-submission" className="scroll-mt-8 grid gap-8 rounded-[2rem] border border-sage-200 bg-white p-6 shadow-sm dark:border-ink-700 dark:bg-ink-900 sm:p-9 lg:grid-cols-[.8fr_1.2fr]">
        <div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-100 text-sage-800 dark:bg-sage-950 dark:text-sage-200"><Send className="h-5 w-5"/></div><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-sage-700 dark:text-sage-300">We’re listening</p><h2 className="mt-2 font-heading text-3xl font-extrabold text-ink-900 dark:text-linen-100">Submit a query or report</h2><p className="mt-3 text-sm leading-6 text-ink-700/70 dark:text-linen-200/70">Tell our team which law is relevant and what information would help. We store submissions privately in the configured support database.</p><div className="mt-5 rounded-2xl bg-linen-100 p-4 text-xs leading-5 text-ink-700 dark:bg-ink-950 dark:text-linen-200"><strong>For formal action:</strong> this form does not notify an employer, committee or government authority. For workplace complaints, contact the appropriate Internal/Local Committee or labour authority. The <a className="font-bold underline" href="https://samadhan.labour.gov.in/" target="_blank" rel="noreferrer">Ministry’s SAMADHAN portal</a> accepts specified labour grievances. For urgent danger, contact local emergency services. Avoid including sensitive identity, medical or incident details here.</div></div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-ink-700 dark:text-linen-200">Related law<select value={selectedLaw} onChange={e => setSelectedLaw(e.target.value)} className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950">{LAWS.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label><label className="block text-xs font-semibold text-ink-700 dark:text-linen-200">Message type<select value={kind} onChange={e => setKind(e.target.value as 'query' | 'report')} className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950"><option value="query">I have a query</option><option value="report">I want to report a concern</option></select></label></div>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-ink-700 dark:text-linen-200">Name (optional)<input value={name} onChange={e => setName(e.target.value)} maxLength={100} className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950" placeholder="Your name"/></label><label className="block text-xs font-semibold text-ink-700 dark:text-linen-200">Email<input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950" placeholder="you@example.com"/></label></div>
          <label className="block text-xs font-semibold text-ink-700 dark:text-linen-200">How can we help?<textarea required minLength={10} maxLength={4000} rows={5} value={message} onChange={e => setMessage(e.target.value)} className="mt-2 w-full resize-y rounded-xl border border-sage-200 bg-white px-3 py-3 text-sm dark:border-ink-700 dark:bg-ink-950" placeholder={`Share a general question or concern related to ${law.title}…`}/></label>
          {status && <div role="status" className={`rounded-xl border p-3 text-sm ${status.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : status.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>{status.type === 'success' && <CheckCircle2 className="mr-1 inline h-4 w-4"/>}{status.text}</div>}
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-sage-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-sage-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Submitting…' : 'Submit privately'} <Send className="h-4 w-4"/></button><p className="text-[11px] text-ink-700/50 dark:text-linen-200/50">Submitting means our support team may contact you at the email provided. Do not use this form for emergencies or official filings.</p>
        </form>
      </section>
    </div>
  </div>;
};
