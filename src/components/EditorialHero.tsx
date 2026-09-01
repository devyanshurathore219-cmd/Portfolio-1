import React, { useEffect, useState } from 'react';
import { X, Instagram } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * Assets — exact URLs from the spec, not substituted.
 * ------------------------------------------------------------------ */
const BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85';

const FRONT_PORTRAIT = '/assets/images/devyanshu_hero_avatar.png';

const FIRST_NAME = 'DigiWebNow';
const LAST_NAME = '';
const BRAND = 'DigiWebNow';
const YEAR = '2026';

/* Centered Segmented Bar items matching the spec & uploaded design */
const NAV_SEGMENTS = [
  { id: 'about', label: 'Story', href: '#about' },
  { id: 'services', label: 'Jobs', href: '#services' },
  { id: 'contact', label: 'Message', href: '#contact' },
  { id: 'projects', label: 'Global', href: '#projects' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/officialdigiwebnow' },
  { label: 'iYOU Global', href: 'https://iyouglobal.com/' },
  { label: 'Gaur Furniture', href: 'https://www.gaurfurniture.com/' },
];

const FOOTER_LEFT = ['Custom Web Engineer', 'Founder of DigiWebNow', 'BCA — MERI Institute'];
const FOOTER_RIGHT = ['Featured live work', 'iYOU Global & Gaur Furniture'];

const EASE_DRAWER = 'cubic-bezier(0.76, 0, 0.24, 1)';

export const EditorialHero: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

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

  /* Track scroll position to update active segment pill */
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      const sections = NAV_SEGMENTS.map((s) => {
        const el = document.getElementById(s.id);
        return {
          id: s.id,
          top: el ? el.offsetTop : 0,
          bottom: el ? el.offsetTop + el.offsetHeight : 0,
        };
      });

      for (const section of sections) {
        if (scrollPos >= section.top && scrollPos <= section.bottom) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <span className="pr-[6vw]">
      {FIRST_NAME}{LAST_NAME ? ` \u2014 ${LAST_NAME}` : ''}&nbsp;
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

      {/* ---------- Marquee name (z-10) with depth parallax ---------- */}
      <motion.div
        style={{ x: marqueeParallaxX }}
        className="anim-fade-up absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh]"
        aria-hidden="true"
      >
        <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] leading-none text-cream sm:text-[26vh]">
          {marqueeSpan}
          {marqueeSpan}
        </div>
      </motion.div>

      {/* ---------- Horizontal cream rule (z-10) ---------- */}
      <div
        className="anim-line absolute inset-x-6 bottom-[calc(5.5rem_+_var(--section-curve))] z-10 h-0.5 bg-cream sm:inset-x-10 sm:bottom-[calc(7rem_+_var(--section-curve))]"
        style={{ animationDelay: '1200ms' }}
      />

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
        className="pointer-events-none absolute bottom-[var(--section-curve)] left-[35%] z-20 h-[92vh] sm:h-[96vh] max-h-[1050px] w-auto flex items-end will-change-transform"
      >
        <img
          src={FRONT_PORTRAIT}
          alt="DigiWebNow Portrait"
          className="anim-rise-in h-full w-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          style={{ animationDelay: '300ms' }}
        />
      </motion.div>

      {/* ---------- Header with Centered Segmented Bar (z-30) ---------- */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        {/* Left: Brand Name */}
        <a
          href="#top"
          className="anim-fade-up font-hn text-lg tracking-wide transition-opacity duration-300 hover:opacity-60 z-10 min-w-[100px]"
          style={{ animationDelay: '800ms' }}
        >
          {BRAND}
        </a>

        {/* Center: Centered Segmented Bar (Desktop & Tablet) */}
        <nav
          aria-label="Main Navigation"
          className="anim-fade-up hidden sm:flex items-center absolute left-[38.5%] -translate-x-1/2 z-20"
          style={{ animationDelay: '900ms' }}
        >
          <div className="flex items-center rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-cream backdrop-blur-md border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.25)] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium tracking-wide transition-all">
            {NAV_SEGMENTS.map((segment) => {
              const isActive = activeTab === segment.id;
              return (
                <React.Fragment key={segment.id}>
                  <a
                    href={segment.href}
                    onClick={() => setActiveTab(segment.id)}
                    className={`relative rounded-full px-3 sm:px-3.5 py-1 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-white/25 text-white border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                        : 'text-cream/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {segment.label}
                  </a>

                  {/* Vertical divider */}
                  <span className="text-white/20 font-light select-none mx-0.5 sm:mx-1 text-xs">
                    |
                  </span>
                </React.Fragment>
              );
            })}

            {/* Social Icons Segment */}
            <a
              href={SOCIAL_LINKS[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold text-cream/70 hover:text-white hover:bg-white/10 transition-all"
              title="Official Instagram"
            >
              <Instagram className="h-3.5 w-3.5 text-cream" />
              <span className="hidden md:inline text-[11px] tracking-normal">social icons</span>
            </a>
          </div>
        </nav>

        {/* Right: Year & Mobile Hamburger Button */}
        <div className="flex items-center gap-4 z-10 min-w-[100px] justify-end">
          <span className="anim-fade-up hidden sm:inline-block text-sm" style={{ animationDelay: '900ms' }}>
            {YEAR}
          </span>

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
      <footer className="absolute inset-x-0 bottom-[var(--section-curve)] z-30 flex items-end justify-between px-6 pb-5 font-hn text-xs leading-relaxed sm:z-10 sm:px-10 sm:pb-8 sm:text-sm">
        <div className="anim-fade-up" style={{ animationDelay: '1400ms' }}>
          {FOOTER_LEFT.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="anim-fade-up text-right" style={{ animationDelay: '1550ms' }}>
          {FOOTER_RIGHT.map((line) => (
            <p key={line}>{line}</p>
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
          {NAV_SEGMENTS.map((link, i) => (
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
