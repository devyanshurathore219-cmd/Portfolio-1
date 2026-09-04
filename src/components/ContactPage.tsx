import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Instagram,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Send,
  Lock,
} from 'lucide-react';
import {
  saveContactSubmission,
} from '../utils/excelStorage';

const INQUIRY_EMAIL = 'infodigiwebnow@gmail.com';
const PHONES = ['98108 37875', '9870324454'];
const INSTAGRAM = { handle: '@officialdigiwebnow', url: 'https://instagram.com/officialdigiwebnow' };

const STUDIO: { hours: string; address: string[] } = {
  hours: '',
  address: [],
};

const SOCIALS = [{ label: 'Instagram', icon: Instagram, url: INSTAGRAM.url }];

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

const FIELD =
  'w-full border-0 border-b border-white/15 bg-transparent px-0 py-2.5 text-base text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#00f2fe] focus:ring-0';

const LABEL = 'block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-1';

const MAP_IMAGE = 'assets/images/contact_map.jpg';

const MapBackdrop: React.FC = () => (
  <img
    src={MAP_IMAGE}
    alt=""
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
  />
);

const CornerBrackets: React.FC = () => (
  <>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-14 w-14 border-l-2 border-t-2 border-[#00f2fe] sm:h-20 sm:w-20"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 h-14 w-14 border-r-2 border-t-2 border-[#00f2fe] sm:h-20 sm:w-20"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 h-14 w-14 border-b-2 border-l-2 border-[#00f2fe] sm:h-20 sm:w-20"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 h-14 w-14 border-b-2 border-r-2 border-[#00f2fe] sm:h-20 sm:w-20"
    />
  </>
);

const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-[#ff6b6b]">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

export const ContactPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = 'Please enter your full name.';

    if (!form.email.trim()) next.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = 'Please enter a valid email address.';

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);

    try {
      // 1. Save data securely into owner database (localStorage)
      saveContactSubmission({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        message: form.message,
        sourceRoute: '#/contact',
      });

      // 2. Optionally forward to owner Google Sheet webhook if configured
      const webhook = localStorage.getItem('digiwebnow_google_sheet_webhook');
      if (webhook) {
        try {
          fetch(webhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              phone: form.phone,
              company: form.company,
              message: form.message,
              submittedAt: new Date().toISOString(),
            }),
          }).catch((err) => console.log('Webhook forwarding:', err));
        } catch {
          // ignore network webhook failure on client side
        }
      }

      setSubmittedName(form.name);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasStudioBlock = !!STUDIO.hours || STUDIO.address.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111111] text-[#D7E2EA] font-kanit">
      <MapBackdrop />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#111111]/90 via-[#111111]/85 to-[#111111]/90 lg:bg-gradient-to-r lg:from-[#111111]/95 lg:via-[#111111]/70 lg:to-[#111111]/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 62% 45%, transparent 0%, rgba(17,17,17,0.55) 70%, #111111 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-[#00f2fe] hover:text-white focus-visible:border-[#00f2fe] focus-visible:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#00f2fe]" />
            <span>Back to portfolio</span>
          </button>
        </div>

        <main className="mx-auto flex w-full max-w-7xl flex-grow items-center px-6 py-12 md:px-12 md:py-16">
          <div className="grid w-full grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            {/* ================= Left: heading + details ================= */}
            <div>
              <h1 className="font-black leading-[0.95] tracking-tight text-white text-[clamp(2.75rem,8vw,5.5rem)]">
                Contact Us<span className="text-[#00f2fe]">.</span>
              </h1>

              <div className="mt-10 border-l-2 border-[#00f2fe] pl-6 sm:pl-8">
                {hasStudioBlock && (
                  <div className="mb-9">
                    <p className="mb-3 text-sm font-medium text-white/45">
                      {STUDIO.hours ? 'Studio hours' : 'Studio'}
                    </p>
                    {STUDIO.hours && (
                      <p className="text-base font-medium leading-relaxed text-white">
                        {STUDIO.hours}
                      </p>
                    )}
                    {STUDIO.address.map((line) => (
                      <p key={line} className="text-base font-medium leading-relaxed text-white">
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mb-9">
                  <p className="mb-3 text-sm font-medium text-white/45">Email</p>
                  <a
                    href={`mailto:${INQUIRY_EMAIL}`}
                    className="block text-base font-medium leading-relaxed text-white transition-colors hover:text-[#00f2fe]"
                  >
                    {INQUIRY_EMAIL}
                  </a>
                </div>

                <div className="mb-9">
                  <p className="mb-3 text-sm font-medium text-white/45">Phone</p>
                  {PHONES.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                      className="block text-base font-medium leading-relaxed text-white transition-colors hover:text-[#00f2fe]"
                    >
                      {phone}
                    </a>
                  ))}
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-white/45">Follow</p>
                  <a
                    href={INSTAGRAM.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-base font-medium leading-relaxed text-white transition-colors hover:text-[#00f2fe]"
                  >
                    {INSTAGRAM.handle}
                  </a>
                </div>
              </div>
            </div>

            {/* ================= Right: bracketed form card ================= */}
            <div className="relative p-4 sm:p-6">
              <CornerBrackets />

              <div className="relative bg-[#232427]/95 p-6 shadow-2xl backdrop-blur-sm sm:p-9 rounded-2xl">
                <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
                  Contact Form
                </h2>

                {submitted ? (
                  <div
                    role="status"
                    className="border border-[#00f2fe]/40 bg-[#00f2fe]/[0.08] p-8 rounded-2xl text-center space-y-4 animate-fadeIn"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/40 text-[#00f2fe]">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Thank You{submittedName ? `, ${submittedName}` : ''}!
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed max-w-md mx-auto">
                      Your message has been received successfully. The DigiWebNow team will review your inquiry and get back to you shortly.
                    </p>
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#00f2fe] hover:text-[#00f2fe] transition-colors"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <label className={LABEL} htmlFor="cf-name">
                        Name <span className="text-[#00f2fe]">*</span>
                      </label>
                      <input
                        id="cf-name"
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        className={FIELD}
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'cf-name-err' : undefined}
                      />
                      <FieldError id="cf-name-err" message={errors.name} />
                    </div>

                    <div>
                      <label className={LABEL} htmlFor="cf-email">
                        Email <span className="text-[#00f2fe]">*</span>
                      </label>
                      <input
                        id="cf-email"
                        type="email"
                        placeholder="your.email@example.com"
                        autoComplete="email"
                        className={FIELD}
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'cf-email-err' : undefined}
                      />
                      <FieldError id="cf-email-err" message={errors.email} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={LABEL} htmlFor="cf-phone">
                          Phone Number
                        </label>
                        <input
                          id="cf-phone"
                          type="tel"
                          placeholder="+91 98108 37875"
                          autoComplete="tel"
                          className={FIELD}
                          value={form.phone}
                          onChange={(e) => set('phone', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={LABEL} htmlFor="cf-company">
                          Company / Organization
                        </label>
                        <input
                          id="cf-company"
                          type="text"
                          placeholder="Your business name"
                          autoComplete="organization"
                          className={FIELD}
                          value={form.company}
                          onChange={(e) => set('company', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={LABEL} htmlFor="cf-message">
                        Project Details / Message
                      </label>
                      <textarea
                        id="cf-message"
                        rows={3}
                        placeholder="Tell us about your project requirements or timeline..."
                        className="w-full border-0 border-b border-white/15 bg-transparent px-0 py-2.5 text-base text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#00f2fe] focus:ring-0 resize-none"
                        value={form.message}
                        onChange={(e) => set('message', e.target.value)}
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 bg-[#00f2fe] py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-[#5df7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-lg shadow-[#00f2fe]/20 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* ================= Bottom bar ================= */}
        <footer className="mx-auto w-full max-w-7xl px-6 pb-10 md:px-12">
          <div className="flex flex-col-reverse items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
            <div className="flex items-center gap-5">
              {SOCIALS.map(({ label, icon: Icon, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/45 transition-colors hover:text-[#00f2fe]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <a
                href={`mailto:${INQUIRY_EMAIL}`}
                aria-label="Email"
                className="text-white/45 transition-colors hover:text-[#00f2fe]"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={`tel:${PHONES[0].replace(/[^\d+]/g, '')}`}
                aria-label="Phone"
                className="text-white/45 transition-colors hover:text-[#00f2fe]"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>

            <div className="flex items-center gap-4 text-center sm:text-right">
              <p className="text-xs text-white/40">
                &copy; {new Date().getFullYear()} DigiWebNow.
              </p>
              {/* Discrete Owner Portal Access */}
              <a
                href="#/admin"
                className="inline-flex items-center gap-1 text-[11px] text-white/20 hover:text-[#00f2fe] transition-colors"
                title="Owner Hub"
              >
                <Lock className="h-3 w-3" />
                <span>Owner</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

