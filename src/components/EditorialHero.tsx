import React, { useEffect, useState } from 'react';
import { X, Instagram, Youtube } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * Assets — exact URLs from the spec, not substituted.
 * ------------------------------------------------------------------ */
const BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85';

const FRONT_PORTRAIT = '/assets/images/devyanshu_hero_hd.png';

const BRAND = 'DigiWebNow';

const HERO_MARQUEE = 'CUSTOM WEB DEVELOPMENT \u2022 FULL-STACK ARCHITECTURE \u2022 UI/UX DESIGN \u2022 HIGH PERFORMANCE WEBSITES';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/officialdigiwebnow' },
  { label: 'iYOU Global', href: 'https://iyouglobal.com/' },
  { label: 'Gaur Furniture', href: 'https://www.gaurfurniture.com/' },
];

const DRAWER_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#/contact' },
];

const FOOTER_LEFT = [
  'Custom Web & E-Commerce Engineering',
  'Full-Stack Web Apps • Cloud Architecture',
  'Modern UI/UX Design & High-Converting Websites',
  'API Integrations & Performance Optimization',
];
const FOOTER_RIGHT = ['Featured live work', 'iYOU Global & Gaur Furniture'];

const EASE_DRAWER = 'cubic-bezier(0.76, 0, 0.24, 1)';

export const EditorialHero: React.FC = () => {
  const [open, setOpen] = useState(false);

  /* 3D Mouse Parallax & Tilt physics */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Responsive 3D transforms for the avatar
  const avatarX = useTransform(smoothX, [-0.5, 0.5], [-45, 45]);
  const avatarY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const avatarScale = useTransform(smoothX, [-0.5, 0, 0.5], [1.02, 1, 1.02]);

  // Subtle depth parallax for background marquee
  const marqueeParallaxX = useTransform(smoothX, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* Lock the page while the drawer is open. */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const marqueeSpan = (
    <span className="pr-[6vw] font-kanit font-black uppercase tracking-tight">
      {HERO_MARQUEE}&nbsp;&bull;&nbsp;
    </span>
  );

  return (
    <section
      id="top"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[calc(100dvh_+_var(--section-curve))] w-full overflow-hidden bg-black font-hn text-cream select-none"
      style={{ perspective: '1200px' }}
    >
      {/* ---------- Background image (bottom layer) ---------- */}
      <img
        src={BG_IMAGE}
        alt=""
        aria-hidden="true"
        className="anim-fade-in absolute inset-0 h-full w-full object-cover"
      />

      {/* ---------- Marquee services title (z-10) with depth parallax ---------- */}
      <motion.div
        style={{ x: marqueeParallaxX }}
        className="anim-fade-up absolute inset-x-0 top-[18vh] z-10 overflow-hidden sm:top-[16vh]"
        aria-hidden="true"
      >
        <div
          className="marquee flex w-max whitespace-nowrap font-kanit font-black uppercase tracking-tight text-[13vh] leading-none text-cream/90 sm:text-[20vh]"
          style={{ animationDuration: '90s' }}
        >
          {marqueeSpan}
          {marqueeSpan}
        </div>
      </motion.div>

      {/* ---------- 3D Interactive Avatar Portrait (z-20) ---------- */}
      <motion.div
        style={{
          x: avatarX,
          y: avatarY,
          rotateY: rotateY,
          rotateX: rotateX,
          scale: avatarScale,
          transformStyle: 'preserve-3d',
        }}
        className="pointer-events-none absolute bottom-[var(--section-curve)] left-[35%] z-20 h-[80vh] sm:h-[84vh] max-h-[850px] w-auto flex items-end will-change-transform"
      >
        <img
          src={FRONT_PORTRAIT}
          alt="DigiWebNow Portrait"
          className="anim-rise-in h-full w-auto object-contain object-bottom"
          style={{ animationDelay: '300ms' }}
        />
      </motion.div>

      {/* ---------- Horizontal cream rule (z-30) ---------- */}
      <div
        className="anim-line absolute inset-x-6 bottom-[calc(5.5rem_+_var(--section-curve))] z-30 h-0.5 bg-cream sm:inset-x-10 sm:bottom-[calc(7rem_+_var(--section-curve))]"
        style={{ animationDelay: '1200ms' }}
      />

      {/* ---------- Header with Centered Segmented Bar (z-30) ---------- */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        {/* Left: Brand Name (Bold and Distinctive Logo) */}
        <a
          href="#top"
          className="anim-fade-up font-kanit font-black text-xl sm:text-2xl tracking-wider uppercase text-white hover:text-[#00f2fe] transition-all duration-300 z-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] flex items-center gap-1.5"
          style={{ animationDelay: '800ms' }}
        >
          <span>{BRAND}</span>
          <span className="text-[#00f2fe] text-sm">&bull;</span>
        </a>

        {/* Center space kept clear for the Floating Capsule Navbar */}

        {/* Right: Social Media Icons & Mobile Hamburger Button */}
        <div className="flex items-center gap-2.5 z-10 min-w-[100px] justify-end">
          {/* Top-Right Social Icons (Instagram & YouTube only) */}
          <div className="anim-fade-up hidden sm:flex items-center gap-2.5" style={{ animationDelay: '900ms' }}>
            <a
              href="https://instagram.com/officialdigiwebnow"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-[#00f2fe] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://youtube.com/@digiwebnow"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-[#00f2fe] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <Youtube size={17} />
            </a>
          </div>

          {/* Mobile hamburger, morphs into an X (z-50) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="anim-fade-up relative z-50 flex h-10 w-10 items-center justify-center sm:hidden"
            style={{ animationDelay: '900ms' }}
          >
            <span className="relative block h-4 w-6">
              <span
                className="absolute left-0 top-0 h-0.5 w-full bg-cream transition-transform"
                style={{
                  transitionDuration: '500ms',
                  transitionTimingFunction: EASE_DRAWER,
                  transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-cream transition-opacity duration-300"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute bottom-0 left-0 h-0.5 w-full bg-cream transition-transform"
                style={{
                  transitionDuration: '500ms',
                  transitionTimingFunction: EASE_DRAWER,
                  transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* ---------- Footer: desktop z-10 (under portrait), mobile z-30 ---------- */}
      <footer className="absolute inset-x-0 bottom-[var(--section-curve)] z-30 flex items-end justify-between px-6 pb-4 font-hn text-[11px] sm:text-xs leading-snug sm:z-10 sm:px-10 sm:pb-6">
        <div className="anim-fade-up space-y-0.5 max-w-sm" style={{ animationDelay: '1400ms' }}>
          {FOOTER_LEFT.map((line) => (
            <p key={line} className="tracking-wide text-cream/90">{line}</p>
          ))}
        </div>

        <div className="anim-fade-up text-right space-y-0.5" style={{ animationDelay: '1550ms' }}>
          {FOOTER_RIGHT.map((line) => (
            <p key={line} className="tracking-wide text-cream/80">{line}</p>
          ))}
        </div>
      </footer>

      {/* ---------- Mobile drawer (z-40) ---------- */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 sm:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed right-0 top-0 z-40 h-full w-[80%] max-w-sm bg-[#141414] px-8 py-10 sm:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          transitionProperty: 'transform',
          transitionDuration: '600ms',
          transitionTimingFunction: EASE_DRAWER,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute right-6 top-6 z-50"
          style={{
            transition: 'transform 500ms, opacity 500ms',
            transitionDelay: open ? '300ms' : '0ms',
            transform: open ? 'rotate(0deg)' : 'rotate(90deg)',
            opacity: open ? 1 : 0,
          }}
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        {/* Site Index */}
        <p
          className="text-xs uppercase tracking-[0.2em] text-cream/50"
          style={{
            transition: 'transform 500ms, opacity 500ms',
            transitionDelay: open ? '250ms' : '0ms',
            transform: open ? 'translateY(0)' : 'translateY(1rem)',
            opacity: open ? 1 : 0,
          }}
        >
          Site Index
        </p>

        <nav className="mt-6 flex flex-col gap-1">
          {DRAWER_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-4xl leading-tight text-cream hover:text-[#00f2fe] transition-colors"
              style={{
                transition: 'transform 500ms, opacity 500ms',
                transitionDelay: open ? `${300 + i * 80}ms` : '0ms',
                transform: open ? 'translateY(0)' : 'translateY(1.5rem)',
                opacity: open ? 1 : 0,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Find Me */}
        <p
          className="mt-12 text-xs uppercase tracking-[0.2em] text-cream/50"
          style={{
            transition: 'transform 500ms, opacity 500ms',
            transitionDelay: open ? '500ms' : '0ms',
            transform: open ? 'translateY(0)' : 'translateY(1rem)',
            opacity: open ? 1 : 0,
          }}
        >
          Find Me
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {SOCIAL_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                transition: 'transform 500ms, opacity 500ms',
                transitionDelay: open ? `${550 + i * 60}ms` : '0ms',
                transform: open ? 'translateY(0)' : 'translateY(1rem)',
                opacity: open ? 1 : 0,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </aside>
    </section>
  );
};
