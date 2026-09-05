import React from 'react';
import { Instagram, Youtube } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * Assets — exact URLs from the spec, not substituted.
 * ------------------------------------------------------------------ */
const BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85';

const FRONT_PORTRAIT = '/assets/images/devyanshu_hero_hd.png';

const HERO_MARQUEE = 'CUSTOM WEB DEVELOPMENT \u2022 FULL-STACK ARCHITECTURE \u2022 UI/UX DESIGN \u2022 HIGH PERFORMANCE WEBSITES';

const FOOTER_LEFT = [
  'Custom Web & E-Commerce Engineering',
  'Full-Stack Web Apps • Cloud Architecture',
  'Modern UI/UX Design & High-Converting Websites',
];
const FOOTER_RIGHT = ['Featured live work', 'iYOU Global & Gaur Furniture'];

export const EditorialHero: React.FC = () => {
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
        className="anim-fade-up absolute inset-x-0 top-[22vh] sm:top-[20vh] md:top-[24vh] z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="marquee flex w-max whitespace-nowrap font-kanit font-black uppercase tracking-tight text-[11vh] sm:text-[13vh] md:text-[18vh] lg:text-[20vh] leading-none text-cream/90"
          style={{ animationDuration: '90s' }}
        >
          {marqueeSpan}
          {marqueeSpan}
        </div>
      </motion.div>

      {/* ---------- Horizontal cream rule (tablet/desktop only) ---------- */}
      <div
        className="anim-line hidden sm:block absolute inset-x-4 sm:inset-x-10 bottom-[calc(7rem_+_var(--section-curve))] z-10 h-0.5 bg-cream"
        style={{ animationDelay: '1200ms' }}
      />

      {/* ---------- 3D Interactive Avatar Portrait (Centered in middle of Hero area) ---------- */}
      <div className="pointer-events-none absolute bottom-[var(--section-curve)] inset-x-0 z-20 flex items-end justify-center overflow-hidden">
        <motion.div
          style={{
            x: avatarX,
            y: avatarY,
            rotateY: rotateY,
            rotateX: rotateX,
            scale: avatarScale,
            transformStyle: 'preserve-3d',
          }}
          className="flex items-end justify-center h-[73vh] sm:h-[80vh] md:h-[84vh] lg:h-[88vh] max-h-[660px] sm:max-h-[780px] md:max-h-[940px] w-auto will-change-transform"
        >
          <img
            src={FRONT_PORTRAIT}
            alt="DigiWebNow Portrait"
            className="anim-rise-in h-full w-auto max-w-none object-contain object-bottom drop-shadow-2xl"
            style={{ animationDelay: '300ms' }}
          />
        </motion.div>
      </div>

      {/* ---------- Header with Clean Responsive Top Bar (z-30) ---------- */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6 md:px-10 md:pt-8">
        {/* Left: Official Company Logo */}
        <a
          href="#top"
          className="anim-fade-up z-10 flex items-center transition-transform duration-300 hover:scale-105"
          style={{ animationDelay: '800ms' }}
        >
          <img
            src="/assets/images/digiwebnow_logo.png"
            alt="Digiwebnow - Digital Products. Intelligent Solutions."
            className="h-7 sm:h-8 md:h-10 lg:h-11 w-auto object-contain"
          />
        </a>

        {/* Right: Social Media Icons */}
        <div className="flex items-center gap-2 sm:gap-2.5 z-10">
          {/* Top-Right Social Icons (Instagram & YouTube) */}
          <div className="anim-fade-up flex items-center gap-2 sm:gap-2.5" style={{ animationDelay: '900ms' }}>
            <a
              href="https://instagram.com/officialdigiwebnow"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-[#00f2fe] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <Instagram size={15} className="sm:w-[17px] sm:h-[17px]" />
            </a>
            <a
              href="https://www.youtube.com/@Digiwebnow"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-[#00f2fe] hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <Youtube size={15} className="sm:w-[17px] sm:h-[17px]" />
            </a>
          </div>
        </div>
      </header>

      {/* ---------- Footer: desktop z-10 (under portrait), mobile z-30 with bottom spacing ---------- */}
      <footer className="absolute inset-x-0 bottom-24 sm:bottom-[var(--section-curve)] z-30 flex flex-col sm:flex-row items-start sm:items-end justify-between px-5 sm:px-8 md:px-10 pb-2 sm:pb-5 md:pb-6 font-hn text-[11px] sm:text-xs leading-snug sm:z-10 gap-2 sm:gap-0 pointer-events-none">
        <div className="anim-fade-up space-y-0.5 max-w-xs sm:max-w-sm pointer-events-auto [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)]" style={{ animationDelay: '1400ms' }}>
          {FOOTER_LEFT.map((line, idx) => (
            <p key={line} className={`tracking-wide ${idx === 0 ? 'text-white font-semibold text-xs sm:text-sm' : 'text-cream/85 font-medium text-[10.5px] sm:text-xs'}`}>
              {line}
            </p>
          ))}
        </div>

        <div className="anim-fade-up text-left sm:text-right space-y-0.5 pointer-events-auto [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)]" style={{ animationDelay: '1550ms' }}>
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[#00f2fe] font-mono font-medium">{FOOTER_RIGHT[0]}</p>
          <p className="tracking-wide text-white font-semibold text-xs sm:text-sm">{FOOTER_RIGHT[1]}</p>
        </div>
      </footer>
    </section>
  );
};
